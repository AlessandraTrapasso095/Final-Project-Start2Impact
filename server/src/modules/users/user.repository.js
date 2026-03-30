// questo file mi serve per isolare tutte le operazioni sui dati degli utenti.
// lo uso per fare leggere e scrivere i record utente senza mescolare file system e logica di dominio.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import {
  createUserRecord,
  normalizeEmail,
  toPublicUser,
  updateUserProfileRecord,
} from "./user.model.js";

// mi serve per recuperare tutti gli utenti salvati.
// lo uso soprattutto nei test e nei controlli interni, mentre al client manderemo solo la versione pubblica.
export const getUsers = async () => {
  const database = await readDatabase();

  return database.users;
};

// mi serve per cercare un utente con l'email gia' normalizzata.
// questo ci servira' tanto nello step login e register per evitare doppioni.
export const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const users = await getUsers();

  return users.find((user) => user.email === normalizedEmail) || null;
};

// mi serve per cercare un utente partendo dal suo id.
// lo uso per recuperare l'utente loggato e anche per legare i task al proprietario giusto.
export const findUserById = async (userId) => {
  const users = await getUsers();

  return users.find((user) => user.id === userId) || null;
};

// mi serve per salvare un nuovo utente nel file dati.
// questo crea il record completo e poi aggiorna solo la collezione users lasciando intatto il resto del database.
export const createUser = async (userData) => {
  const nextUser = createUserRecord(userData);

  await updateDatabase((database) => {
    database.users.push(nextUser);
    return database;
  });

  return nextUser;
};

// mi serve per aggiornare il profilo di un utente gia' esistente.
// questo prepara una funzione riusabile che sfrutteremo piu' avanti senza duplicare logica.
export const updateUserProfile = async (userId, profileUpdates) => {
  let updatedUser = null;

  await updateDatabase((database) => {
    database.users = database.users.map((user) => {
      if (user.id !== userId) {
        return user;
      }

      updatedUser = updateUserProfileRecord(user, profileUpdates);
      return updatedUser;
    });

    return database;
  });

  return updatedUser;
};

// mi serve per trasformare un record utente nella sua versione sicura.
// lo uso per centralizzare la sanitizzazione invece di farla controller per controller.
export const getPublicUser = (user) => (user ? toPublicUser(user) : null);
