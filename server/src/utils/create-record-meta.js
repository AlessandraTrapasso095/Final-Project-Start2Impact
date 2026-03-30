// questo file mi serve per creare campi comuni come id e timestamp.

import { randomUUID } from "node:crypto";

// mi serve per creare una base uguale per tutti i record salvati.
export const createRecordMeta = () => {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
};

// mi serve quando un record viene modificato e voglio aggiornare solo la data.
export const getUpdatedTimestamp = () => new Date().toISOString();
