// questo file mi serve per definire la forma dei record di sessione.
// lo uso per generare token, timestamp e campi coerenti ogni volta che un utente fa login o registrazione.

import { randomBytes } from "node:crypto";
import { createRecordMeta } from "../../utils/create-record-meta.js";

const sessionTokenSize = 48;

// mi serve per creare token lunghi e poco prevedibili.
// lo uso al posto di valori semplici cosi' la sessione e' piu' sicura gia' da questa base.
export const createSessionToken = () => randomBytes(sessionTokenSize).toString("hex");

// mi serve per costruire il record sessione completo da salvare nel file dati.
// questo collega il token all'utente e tiene traccia dell'ultimo utilizzo della sessione.
export const createSessionRecord = ({ userId }) => {
  const recordMeta = createRecordMeta();

  return {
    ...recordMeta,
    userId,
    token: createSessionToken(),
    lastUsedAt: recordMeta.createdAt,
  };
};

// mi serve per aggiornare la sessione quando viene riutilizzata.
// questo ci permette di sapere quando e' stata usata l'ultima volta senza cambiare token.
export const touchSessionRecord = (session) => {
  const nextTimestamp = new Date().toISOString();

  return {
    ...session,
    updatedAt: nextTimestamp,
    lastUsedAt: nextTimestamp,
  };
};
