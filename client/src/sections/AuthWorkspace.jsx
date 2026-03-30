// questo file mi serve per gestire la vera UI di login e registrazione collegata alle API.
// lo uso per tenere insieme form, validazione locale, stato sessione, token salvato e logout senza sporcare il resto dell'app.

import { startTransition, useEffect, useState } from "react";
import AuthModeSwitch from "../components/auth/AuthModeSwitch.jsx";
import WorkspaceDashboard from "../components/dashboard/WorkspaceDashboard.jsx";
import AppShell from "../components/layout/AppShell.jsx";
import LandingFooter from "../components/layout/LandingFooter.jsx";
import LandingHeader from "../components/layout/LandingHeader.jsx";
import FormField from "../components/forms/FormField.jsx";
import Button from "../components/ui/Button.jsx";
import FeedbackPanel from "../components/ui/FeedbackPanel.jsx";
import LoadingRing from "../components/ui/LoadingRing.jsx";
import SurfaceCard from "../components/ui/SurfaceCard.jsx";
import AuthExperience from "./AuthExperience.jsx";
import LandingSections from "./LandingSections.jsx";
import {
  getCurrentAuthSession,
  loginAuthUser,
  logoutAuthUser,
  registerAuthUser,
} from "../services/auth-api.js";
import { clearStoredSessionToken, getStoredSessionToken, storeSessionToken } from "../utils/session-storage.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const createGuestSessionState = () => ({
  status: "guest",
  user: null,
  session: null,
});

const createInitialFeedback = () => ({
  tone: "neutral",
  message: "",
  details: [],
});

const authModeContent = {
  register: {
    eyebrow: "",
    title: "Nuovo Account",
    description: "Crea il tuo accesso e inizia a lavorare nel workspace del team.",
    submitLabel: "Crea account",
    loadingLabel: "Sto preparando il tuo accesso al workspace...",
    successMessage: (name) => `Profilo creato. Benvenuta, ${name}.`,
    fields: [
      {
        name: "name",
        label: "Nome completo",
        type: "text",
        placeholder: "Mario Rossi",
        autoComplete: "name",
      },
      {
        name: "email",
        label: "Email di lavoro",
        type: "email",
        placeholder: "mario@pixelforge.it",
        autoComplete: "email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        autoComplete: "new-password",
      },
    ],
  },
  login: {
    eyebrow: "",
    title: "Accedi",
    description: "Rientra nel workspace per riprendere task e priorita' del team.",
    submitLabel: "Accedi",
    loadingLabel: "Sto verificando il tuo accesso...",
    successMessage: (name) => `Accesso completato. Bentornata, ${name}.`,
    fields: [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "mario@pixelforge.it",
        autoComplete: "email",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "••••••••",
        autoComplete: "current-password",
      },
    ],
  },
};

const resetSensitiveFields = (mode, currentValues) => ({
  ...currentValues,
  password: "",
  confirmPassword: mode === "register" ? "" : currentValues.confirmPassword,
});

const normalizeApiErrorMessage = (error, fallbackMessage) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
};

const createFeedbackFromError = (error, fallbackMessage) => ({
  tone: "warning",
  message: normalizeApiErrorMessage(error, fallbackMessage),
  details: Array.isArray(error?.details) ? error.details : [],
});

const validateAuthForm = (mode, formValues) => {
  const nextErrors = {};

  // mi serve per controllare solo i campi rilevanti della modalita' attuale.
  // cosi' evito validazioni inutili e tengo la logica del form piu' leggibile.
  if (mode === "register" && formValues.name.trim().length < 2) {
    nextErrors.name = "Scrivo almeno 2 caratteri per il nome.";
  }

  if (!emailPattern.test(formValues.email.trim().toLowerCase())) {
    nextErrors.email = "Mi serve un'email valida.";
  }

  if (formValues.password.length < 8) {
    nextErrors.password = "La password deve avere almeno 8 caratteri.";
  }

  return nextErrors;
};

const buildRequestPayload = (mode, formValues) => {
  if (mode === "register") {
    return {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      password: formValues.password,
    };
  }

  return {
    email: formValues.email.trim(),
    password: formValues.password,
  };
};

// mi serve per comporre e gestire il pannello auth vero e proprio.
// qui tengo tutto quello che riguarda il comportamento reale del form e della sessione, cosi' il resto dell'app resta piu' pulito.
function AuthWorkspace() {
  const [mode, setMode] = useState("register");
  const [formValues, setFormValues] = useState(initialFormValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [feedback, setFeedback] = useState(createInitialFeedback);
  const [sessionState, setSessionState] = useState(createGuestSessionState);

  const currentModeContent = authModeContent[mode];
  const shouldShowGuestFeedback =
    isSubmitting || feedback.tone !== "neutral" || feedback.message.trim().length > 0;

  const renderGuestAccessPanel = () => {
    if (isCheckingSession) {
      return (
        <div className="auth-workspace">
          <SurfaceCard
            eyebrow="Ingresso"
            title="Sto preparando il tuo accesso"
            description="Controllo se il browser ha gia' un accesso attivo per rientrare subito nel workspace."
            className="auth-workspace__card"
          >
            <LoadingRing label="Sto recuperando il tuo accesso..." />
          </SurfaceCard>
        </div>
      );
    }

    return (
      <div className="auth-workspace">
        <SurfaceCard
          eyebrow={currentModeContent.eyebrow}
          title={currentModeContent.title}
          description={currentModeContent.description}
          className="auth-workspace__card auth-workspace__card--minimal"
        >
          <AuthModeSwitch activeMode={mode} onModeChange={handleModeChange} />

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__fields">
              {currentModeContent.fields.map((field) => (
                <FormField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formValues[field.name]}
                  onChange={handleFieldChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  hint={field.hint}
                  error={fieldErrors[field.name]}
                />
              ))}
            </div>

            <div className="auth-form__actions">
              <Button
                type="submit"
                size="large"
                className="auth-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Attendere..." : currentModeContent.submitLabel}
              </Button>
            </div>
          </form>

          {shouldShowGuestFeedback ? (
            <FeedbackPanel
              tone={feedback.tone}
              message={feedback.message}
              details={feedback.details}
              isLoading={isSubmitting}
              loadingLabel={currentModeContent.loadingLabel}
            />
          ) : null}
        </SurfaceCard>
      </div>
    );
  };

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedSessionToken = getStoredSessionToken();

      if (!storedSessionToken) {
        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setSessionState(createGuestSessionState());
        });
        setIsCheckingSession(false);
        return;
      }

      setFeedback({
        tone: "neutral",
        message: "Sto recuperando il tuo accesso salvato...",
        details: [],
      });

      try {
        const authPayload = await getCurrentAuthSession(storedSessionToken);

        if (!isMounted) {
          return;
        }

        storeSessionToken(authPayload.session.token);

        startTransition(() => {
          setSessionState({
            status: "authenticated",
            user: authPayload.user,
            session: authPayload.session,
          });
        });

        setFeedback({
          tone: "success",
          message: `Bentornata, ${authPayload.user.name}. Il tuo workspace e' pronto.`,
          details: [],
        });
      } catch (error) {
        clearStoredSessionToken();

        if (!isMounted) {
          return;
        }

        startTransition(() => {
          setSessionState(createGuestSessionState());
        });

        setFeedback(
          createFeedbackFromError(
            error,
            "Non ho trovato un accesso valido. Ti riporto all'area di ingresso.",
          ),
        );
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // mi serve per cambiare modalita' senza lasciare errori vecchi in giro.
  // quando passo da login a registrazione, ripulisco feedback ed errori per non confondere la UI.
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setFieldErrors({});
    setFeedback(createInitialFeedback());
  };

  // mi serve per aggiornare un campo alla volta in modo riusabile.
  // lo uso anche per togliere l'errore di quel campo appena l'utente ricomincia a scrivere.
  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
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

  // mi serve per inviare il form giusto al backend e salvare la sessione se tutto va bene.
  // questo aggiorna frontend e browser storage nello stesso flusso, cosi' la sessione resta coerente dopo il refresh.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateAuthForm(mode, formValues);

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFeedback({
        tone: "warning",
        message: "Controllo i campi evidenziati prima di andare avanti.",
        details: [],
      });
      return;
    }

    const requestPayload = buildRequestPayload(mode, formValues);
    const requestHandler = mode === "register" ? registerAuthUser : loginAuthUser;

    setIsSubmitting(true);
    setFeedback({
      tone: "neutral",
      message: currentModeContent.loadingLabel,
      details: [],
    });

    try {
      const authPayload = await requestHandler(requestPayload);

      storeSessionToken(authPayload.session.token);

      startTransition(() => {
        setSessionState({
          status: "authenticated",
          user: authPayload.user,
          session: authPayload.session,
        });
      });

      setFormValues((currentValues) => resetSensitiveFields(mode, currentValues));
      setFieldErrors({});
      setFeedback({
        tone: "success",
        message: currentModeContent.successMessage(authPayload.user.name),
        details: [],
      });
    } catch (error) {
      setFeedback(
        createFeedbackFromError(
          error,
          "La richiesta non e' andata a buon fine. Riprovo tra poco.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // mi serve per chiudere davvero la sessione attiva sia nel backend sia nel browser.
  // questo cancella il token salvato e riporta la UI allo stato guest in modo pulito.
  const handleLogout = async () => {
    if (!sessionState.session?.token) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutAuthUser(sessionState.session.token);
      clearStoredSessionToken();

      startTransition(() => {
        setSessionState(createGuestSessionState());
      });

      setFeedback({
        tone: "success",
        message: "Sei uscita dal workspace. Quando vuoi puoi rientrare da qui.",
        details: [],
      });
    } catch (error) {
      setFeedback(
        createFeedbackFromError(
          error,
          "Non sono riuscita a completare l'uscita. Riprova tra poco.",
        ),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  // mi serve per riportare il frontend allo stato guest se la sessione non vale piu'.
  // questo mi aiuta soprattutto quando una rotta task risponde 401 e voglio far ripartire il flusso in modo pulito.
  const handleSessionExpired = (message) => {
    clearStoredSessionToken();

    startTransition(() => {
      setSessionState(createGuestSessionState());
    });

    setFeedback({
      tone: "warning",
      message:
        message ||
        "Il tuo accesso non e' piu' valido. Ti riporto all'ingresso del workspace.",
      details: [],
    });
  };

  if (sessionState.status === "authenticated" && sessionState.user && sessionState.session) {
    return (
      <WorkspaceDashboard
        user={sessionState.user}
        session={sessionState.session}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
        onSessionExpired={handleSessionExpired}
        onUserChange={(nextUser) => {
          startTransition(() => {
            setSessionState((currentState) => ({
              ...currentState,
              user: nextUser,
            }));
          });
        }}
      />
    );
  }

  return (
    <AppShell
      header={<LandingHeader />}
      hero={<AuthExperience />}
      preview={renderGuestAccessPanel()}
      content={<LandingSections />}
      footer={<LandingFooter />}
    />
  );
}

export default AuthWorkspace;
