// lo uso per leggere e aggiornare le informazioni personali senza spargere controlli in controller e router.

import { createHttpError } from "../../utils/create-http-error.js";
import {
  findUserById,
  getPublicUser,
  updateUserProfile,
} from "../users/user.repository.js";
import { createNotificationForUser } from "../notifications/notifications.service.js";

const maximumJobTitleLength = 60;
const maximumBioLength = 240;
const maximumAvatarValueLength = 3_000_000;
const allowedGenderValues = ["female", "male"];
const isAcceptedAvatarValue = (value = "") =>
  /^https?:\/\/\S+/i.test(value) ||
  /^data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=]+$/i.test(value);

const sanitizeProfileInput = (payload = {}) => ({
  name: typeof payload.name === "string" ? payload.name.trim() : undefined,
  gender: typeof payload.gender === "string" ? payload.gender.trim() : undefined,
  jobTitle: typeof payload.jobTitle === "string" ? payload.jobTitle.trim() : undefined,
  bio: typeof payload.bio === "string" ? payload.bio.trim() : undefined,
  avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl.trim() : undefined,
});

// mi serve per evitare update vuoti o dati poco sensati.
const validateProfileInput = (profileInput) => {
  const validationErrors = [];
  const hasKnownField =
    typeof profileInput.name === "string" ||
    typeof profileInput.gender === "string" ||
    typeof profileInput.jobTitle === "string" ||
    typeof profileInput.bio === "string" ||
    typeof profileInput.avatarUrl === "string";

  if (!hasKnownField) {
    validationErrors.push("Mi serve almeno un campo da aggiornare nel profilo.");
  }

  if (typeof profileInput.name === "string" && profileInput.name.length < 2) {
    validationErrors.push("Il nome deve contenere almeno 2 caratteri.");
  }

  if (
    typeof profileInput.gender === "string" &&
    profileInput.gender.length > 0 &&
    !allowedGenderValues.includes(profileInput.gender)
  ) {
    validationErrors.push("Il genere deve essere femminile oppure maschile.");
  }

  if (
    typeof profileInput.jobTitle === "string" &&
    profileInput.jobTitle.length > maximumJobTitleLength
  ) {
    validationErrors.push(
      `Il ruolo professionale puo' contenere al massimo ${maximumJobTitleLength} caratteri.`,
    );
  }

  if (typeof profileInput.bio === "string" && profileInput.bio.length > maximumBioLength) {
    validationErrors.push(`La bio puo' contenere al massimo ${maximumBioLength} caratteri.`);
  }

  if (
    typeof profileInput.avatarUrl === "string" &&
    profileInput.avatarUrl.length > maximumAvatarValueLength
  ) {
    validationErrors.push("L'immagine profilo e' troppo pesante. Uso un file piu' leggero.");
  }

  if (
    typeof profileInput.avatarUrl === "string" &&
    profileInput.avatarUrl.length > 0 &&
    !isAcceptedAvatarValue(profileInput.avatarUrl)
  ) {
    validationErrors.push(
      "Se inserisco un avatar, uso un link valido oppure un'immagine profilo caricata dal form.",
    );
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Dati profilo non validi.",
      validationErrors,
      "Controlla le informazioni del profilo prima di salvare.",
    );
  }
};

// mi serve per leggere il profilo dell'utente autenticato in forma sicura.
export const getProfileForUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw createHttpError(
      404,
      "Profilo non trovato.",
      ["Non esiste nessun utente con questo id nel database locale."],
      "Profilo non trovato.",
    );
  }

  return {
    user: getPublicUser(user),
  };
};

// mi serve per aggiornare nome, genere, ruolo, bio e avatar dell'utente corrente.
export const updateProfileForUser = async (userId, payload) => {
  const sanitizedProfileInput = sanitizeProfileInput(payload);

  validateProfileInput(sanitizedProfileInput);

  const updatedUser = await updateUserProfile(userId, sanitizedProfileInput);

  if (!updatedUser) {
    throw createHttpError(
      404,
      "Profilo non trovato.",
      ["Non sono riuscita a trovare l'utente da aggiornare."],
      "Profilo non trovato.",
    );
  }

  await createNotificationForUser(userId, {
    type: "profile",
    title: "Profilo aggiornato",
    message: "Le informazioni personali del workspace sono state salvate correttamente.",
    link: "#profilo",
  });

  return {
    user: getPublicUser(updatedUser),
  };
};
