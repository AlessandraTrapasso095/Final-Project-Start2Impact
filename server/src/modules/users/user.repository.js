// lo uso per fare leggere e scrivere i record utente senza mescolare file system e logica di dominio.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import {
  createUserRecord,
  normalizeEmail,
  toPublicUser,
  updateUserProfileRecord,
} from "./user.model.js";

// mi serve per recuperare tutti gli utenti salvati.
export const getUsers = async () => {
  const database = await readDatabase();

  return database.users;
};

// mi serve per cercare un utente con l'email gia' normalizzata.
export const findUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const users = await getUsers();

  return users.find((user) => user.email === normalizedEmail) || null;
};

// mi serve per cercare un utente partendo dal suo id.
export const findUserById = async (userId) => {
  const users = await getUsers();

  return users.find((user) => user.id === userId) || null;
};

// mi serve per salvare un nuovo utente nel file dati.
export const createUser = async (userData) => {
  const nextUser = createUserRecord(userData);

  await updateDatabase((database) => {
    database.users.push(nextUser);
    return database;
  });

  return nextUser;
};

// mi serve per aggiornare il profilo di un utente gia' esistente.
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
export const getPublicUser = (user) => (user ? toPublicUser(user) : null);
