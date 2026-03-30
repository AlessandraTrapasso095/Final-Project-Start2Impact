// questo file mi serve per creare campi comuni come id e timestamp.
// lo uso per non ripetere la stessa logica ogni volta che creo un utente o un task nuovo.

import { randomUUID } from "node:crypto";

// mi serve per creare una base uguale per tutti i record salvati.
// questo genera un id univoco e imposta createdAt e updatedAt nello stesso momento.
export const createRecordMeta = () => {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
};

// mi serve quando un record viene modificato e voglio aggiornare solo la data.
// lo uso piu' avanti per tenere traccia dell'ultima modifica senza riscrivere sempre la stessa riga.
export const getUpdatedTimestamp = () => new Date().toISOString();
