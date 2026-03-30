// questo file mi serve per definire la forma dei dati utente.
// lo uso per creare record coerenti e per nascondere i campi sensibili quando serve restituire un utente al client.

import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

const defaultRole = "member";

// mi serve per uniformare sempre l'email prima di salvarla o confrontarla.
// questo evita problemi banali tipo maiuscole, spazi o doppioni scritti in modo diverso.
export const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

// mi serve per creare il record utente completo che salveremo nel file dati.
// lo uso gia' adesso come modello base, poi nello step auth gli passeremo la password hashata vera.
export const createUserRecord = ({ name, email, passwordHash, role = defaultRole }) => ({
  ...createRecordMeta(),
  name: String(name).trim(),
  email: normalizeEmail(email),
  passwordHash,
  role,
  profile: {
    gender: "",
    jobTitle: "",
    bio: "",
    avatarUrl: "",
  },
});

// mi serve per aggiornare nome e campi profilo mantenendo intatto tutto il resto.
// questo mi torna utile quando l'utente modifica solo una parte delle informazioni personali.
export const updateUserProfileRecord = (user, profileUpdates = {}) => ({
  ...user,
  name:
    typeof profileUpdates.name === "string" && profileUpdates.name.trim().length >= 2
      ? profileUpdates.name.trim()
      : user.name,
  updatedAt: getUpdatedTimestamp(),
  profile: {
    ...user.profile,
    gender:
      typeof profileUpdates.gender === "string" ? profileUpdates.gender.trim() : user.profile.gender,
    jobTitle:
      typeof profileUpdates.jobTitle === "string"
        ? profileUpdates.jobTitle.trim()
        : user.profile.jobTitle,
    bio: typeof profileUpdates.bio === "string" ? profileUpdates.bio.trim() : user.profile.bio,
    avatarUrl:
      typeof profileUpdates.avatarUrl === "string"
        ? profileUpdates.avatarUrl.trim()
        : user.profile.avatarUrl,
  },
});

// mi serve per togliere la password hashata dai dati che escono verso il client.
// lo uso per non rischiare di mostrare un campo sensibile per sbaglio.
export const toPublicUser = ({ passwordHash, ...user }) => user;
