// questo file mi serve per mostrare e aggiornare il profilo utente nella dashboard.
// lo uso per tenere insieme form, caricamento iniziale e salvataggio senza appesantire il contenitore principale.

import { startTransition, useEffect, useRef, useState } from "react";
import { getCurrentProfile, updateCurrentProfile } from "../../services/profile-api.js";
import FormField from "../forms/FormField.jsx";
import Button from "../ui/Button.jsx";
import FeedbackPanel from "../ui/FeedbackPanel.jsx";
import LoadingRing from "../ui/LoadingRing.jsx";
import SurfaceCard from "../ui/SurfaceCard.jsx";

const createInitialProfileValues = (user) => ({
  name: user.name || "",
  gender: user.profile?.gender || "",
  jobTitle: user.profile?.jobTitle || "",
  bio: user.profile?.bio || "",
  avatarUrl: user.profile?.avatarUrl || "",
});

const createProfileFeedback = (message = "", tone = "neutral", details = []) => ({
  tone,
  message,
  details,
});

const acceptedAvatarMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maximumAvatarFileSize = 8 * 1024 * 1024;
const maximumAvatarDimension = 640;
const maximumAvatarDataUrlLength = 900_000;

// mi serve per tenere valida sia un'immagine con link esterno sia un'immagine caricata dal computer.
// cosi' posso mostrare subito l'anteprima nella sidebar e poi salvarla nello stesso campo avatar.
const isAcceptedAvatarValue = (value = "") =>
  /^https?:\/\/\S+/i.test(value) ||
  /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(value);

// mi serve per trasformare il file scelto in una stringa leggibile dal browser.
// lo uso per avere subito l'anteprima nell'avatar prima del salvataggio finale.
const readAvatarFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Non sono riuscita a leggere l'immagine selezionata."));
    reader.readAsDataURL(file);
  });

// mi serve per aprire il file immagine scelto dal computer.
// lo uso prima di ridimensionarlo cosi' posso lavorare sempre con larghezza e altezza reali.
const loadImageElement = (imageSource) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Non sono riuscita ad aprire l'immagine selezionata."));
    image.src = imageSource;
  });

// mi serve per salvare l'immagine in un formato piu' leggero prima dell'invio.
// lo uso per evitare payload troppo pesanti quando carico la foto profilo dalla sidebar.
const exportCanvasAsDataUrl = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Non sono riuscita a preparare l'immagine profilo."));
          return;
        }

        readAvatarFileAsDataUrl(blob).then(resolve).catch(reject);
      },
      "image/webp",
      quality,
    );
  });

// mi serve per ridurre dimensioni e peso dell'immagine prima di salvarla nel profilo.
// faccio piu' tentativi con dimensioni e qualita' piu' leggere finche' ottengo un risultato accettabile.
const convertAvatarFileToOptimizedDataUrl = async (file) => {
  const previewUrl = URL.createObjectURL(file);

  try {
    const image = await loadImageElement(previewUrl);
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight) || 1;
    const baseScale = Math.min(1, maximumAvatarDimension / longestSide);
    const attempts = [
      { scale: baseScale, quality: 0.86 },
      { scale: baseScale * 0.88, quality: 0.78 },
      { scale: baseScale * 0.76, quality: 0.7 },
      { scale: baseScale * 0.64, quality: 0.62 },
    ];

    for (const attempt of attempts) {
      const targetWidth = Math.max(1, Math.round(image.naturalWidth * attempt.scale));
      const targetHeight = Math.max(1, Math.round(image.naturalHeight * attempt.scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Non sono riuscita a preparare il canvas dell'immagine.");
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      const nextAvatarDataUrl = await exportCanvasAsDataUrl(canvas, attempt.quality);

      if (nextAvatarDataUrl.length <= maximumAvatarDataUrlLength) {
        return nextAvatarDataUrl;
      }
    }

    throw new Error("L'immagine e' ancora troppo pesante. Ne scelgo una piu' leggera.");
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
};

// mi serve per gestire il pannello profilo della sidebar.
// qui sincronizzo i dati iniziali e salvo gli aggiornamenti che poi rientrano anche nel messaggio di benvenuto.
function ProfilePanel({ user, session, onUserChange, onSessionExpired, onActivity }) {
  const [profileValues, setProfileValues] = useState(createInitialProfileValues(user));
  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(createProfileFeedback());
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    setProfileValues(createInitialProfileValues(user));
  }, [user]);

  useEffect(() => {
    if (!isAvatarMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event) => {
      if (!avatarMenuRef.current?.contains(event.target)) {
        setIsAvatarMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      window.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [isAvatarMenuOpen]);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      setIsLoadingProfile(true);

      try {
        const profilePayload = await getCurrentProfile(session.token);

        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setProfileValues(createInitialProfileValues(profilePayload.user));
        });
        onUserChange(profilePayload.user);
      } catch (error) {
        if (error?.statusCode === 401) {
          onSessionExpired(error.message);
          return;
        }

        if (!isMounted) {
          return;
        }

        setFeedback({
          tone: "warning",
          message: error instanceof Error ? error.message : "Non sono riuscita a leggere il profilo.",
          details: Array.isArray(error?.details) ? error.details : [],
        });
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [session.token]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setProfileValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const validateProfileForm = () => {
    const nextErrors = {};

    if (profileValues.name.trim().length < 2) {
      nextErrors.name = "Il nome deve avere almeno 2 caratteri.";
    }

    if (
      profileValues.avatarUrl.trim().length > 0 &&
      !isAcceptedAvatarValue(profileValues.avatarUrl.trim())
    ) {
      nextErrors.avatarUrl = "Uso un link valido oppure carico una foto dal menu dell'avatar.";
    }

    return nextErrors;
  };

  const handleOpenAvatarPicker = () => {
    setIsAvatarMenuOpen(false);
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    if (!acceptedAvatarMimeTypes.includes(selectedFile.type)) {
      setFeedback(
        createProfileFeedback("Per l'immagine profilo uso JPG, PNG o WEBP.", "warning"),
      );
      return;
    }

    if (selectedFile.size > maximumAvatarFileSize) {
      setFeedback(
        createProfileFeedback("L'immagine profilo deve restare sotto i 2 MB.", "warning"),
      );
      return;
    }

    try {
      const avatarDataUrl = await convertAvatarFileToOptimizedDataUrl(selectedFile);

      setProfileValues((currentValues) => ({
        ...currentValues,
        avatarUrl: avatarDataUrl,
      }));

      setFieldErrors((currentErrors) => {
        if (!currentErrors.avatarUrl) {
          return currentErrors;
        }

        const nextErrors = { ...currentErrors };
        delete nextErrors.avatarUrl;
        return nextErrors;
      });

      setFeedback(createProfileFeedback("Immagine pronta. Ora salvo il profilo.", "success"));
    } catch (error) {
      setFeedback(
        createProfileFeedback(
          error instanceof Error ? error.message : "Non sono riuscita a caricare l'immagine.",
          "warning",
        ),
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateProfileForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFeedback(createProfileFeedback("Controllo i campi del profilo prima di salvare.", "warning"));
      return;
    }

    setIsSavingProfile(true);
    setFeedback(createProfileFeedback("Sto salvando il profilo...", "neutral"));

    try {
      const profilePayload = await updateCurrentProfile(session.token, profileValues);

      onUserChange(profilePayload.user);
      onActivity();
      setFeedback(createProfileFeedback("Profilo aggiornato correttamente.", "success"));
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a salvare il profilo.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <SurfaceCard
      title="Informazioni personali"
      className="workspace-panel workspace-panel--sidebar"
    >
      {isLoadingProfile ? (
        <LoadingRing label="Sto caricando il profilo..." />
      ) : (
        <form className="workspace-form profile-panel" id="profilo" onSubmit={handleSubmit}>
          <div className="profile-panel__avatar-stack" ref={avatarMenuRef}>
            <div className="profile-panel__avatar">
              {profileValues.avatarUrl ? (
                <img
                  className="profile-panel__avatar-image"
                  src={profileValues.avatarUrl}
                  alt={`Avatar di ${profileValues.name || "utente"}`}
                />
              ) : (
                <span>{(profileValues.name || user.name || "PF").slice(0, 2).toUpperCase()}</span>
              )}
            </div>

            <button
              className="profile-panel__avatar-trigger"
              type="button"
              aria-label="Azioni immagine profilo"
              aria-expanded={isAvatarMenuOpen}
              onClick={() => setIsAvatarMenuOpen((currentValue) => !currentValue)}
            >
              <span />
              <span />
              <span />
            </button>

            {isAvatarMenuOpen ? (
              <div className="profile-panel__avatar-menu">
                <button type="button" onClick={handleOpenAvatarPicker}>
                  Carica immagine profilo
                </button>
              </div>
            ) : null}

            <input
              ref={avatarInputRef}
              type="file"
              accept={acceptedAvatarMimeTypes.join(",")}
              className="profile-panel__avatar-input"
              onChange={handleAvatarFileChange}
            />
          </div>

          <div className="profile-panel__identity">
            <strong>{profileValues.name || user.name}</strong>
            <span>{profileValues.jobTitle || "Ruolo non ancora impostato"}</span>
          </div>

          <div className="workspace-form__grid">
            <FormField
              label="Nome completo"
              name="name"
              value={profileValues.name}
              onChange={handleFieldChange}
              placeholder="Mario Rossi"
              error={fieldErrors.name}
            />

            <FormField
              as="select"
              label="Genere"
              name="gender"
              value={profileValues.gender}
              onChange={handleFieldChange}
              options={[
                { value: "", label: "Seleziona" },
                { value: "female", label: "Femminile" },
                { value: "male", label: "Maschile" },
              ]}
            />

            <FormField
              label="Ruolo"
              name="jobTitle"
              value={profileValues.jobTitle}
              onChange={handleFieldChange}
              placeholder="Art director"
            />

            <FormField
              as="textarea"
              label="Bio"
              name="bio"
              value={profileValues.bio}
              onChange={handleFieldChange}
              placeholder="Scrivo due righe per presentarmi al team..."
              rows={4}
            />
          </div>

          <Button type="submit" size="large" disabled={isSavingProfile}>
            {isSavingProfile ? "Sto salvando..." : "Salva profilo"}
          </Button>
        </form>
      )}

      {isSavingProfile || feedback.tone === "warning" || feedback.tone === "success" ? (
        <FeedbackPanel
          tone={feedback.tone}
          message={feedback.message}
          details={feedback.details}
          isLoading={isSavingProfile}
          loadingLabel="Sto salvando il profilo..."
        />
      ) : null}
    </SurfaceCard>
  );
}

export default ProfilePanel;
