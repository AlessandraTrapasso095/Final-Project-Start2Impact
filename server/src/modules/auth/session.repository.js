// questo file mi serve per isolare tutte le operazioni di persistenza delle sessioni.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import { createSessionRecord, touchSessionRecord } from "./session.model.js";

// mi serve per recuperare tutte le sessioni attive salvate nel file dati.
export const getSessions = async () => {
  const database = await readDatabase();

  return database.sessions;
};

// mi serve per trovare una sessione a partire dal suo token.
export const findSessionByToken = async (sessionToken) => {
  const sessions = await getSessions();

  return sessions.find((session) => session.token === sessionToken) || null;
};

// mi serve per salvare una nuova sessione quando un utente si registra o fa login.
export const createSession = async (userId) => {
  const nextSession = createSessionRecord({ userId });

  await updateDatabase((database) => {
    database.sessions.push(nextSession);
    return database;
  });

  return nextSession;
};

// mi serve per aggiornare lastUsedAt quando una sessione viene letta con successo.
export const touchSessionByToken = async (sessionToken) => {
  let touchedSession = null;

  await updateDatabase((database) => {
    database.sessions = database.sessions.map((session) => {
      if (session.token !== sessionToken) {
        return session;
      }

      touchedSession = touchSessionRecord(session);
      return touchedSession;
    });

    return database;
  });

  return touchedSession;
};

// questo elimina il record giusto dal file dati e mi restituisce anche la sessione rimossa se esisteva.
export const deleteSessionByToken = async (sessionToken) => {
  let deletedSession = null;

  await updateDatabase((database) => {
    database.sessions = database.sessions.filter((session) => {
      if (session.token !== sessionToken) {
        return true;
      }

      deletedSession = session;
      return false;
    });

    return database;
  });

  return deletedSession;
};
