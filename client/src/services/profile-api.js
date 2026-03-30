// lo uso per leggere e aggiornare le informazioni personali senza sporcare i componenti con fetch ripetute.

import { sendApiRequest } from "./api-client.js";

// mi serve per recuperare il profilo completo dell'utente autenticato.
export const getCurrentProfile = async (sessionToken) =>
  sendApiRequest("/profile", {
    method: "GET",
    sessionToken,
  });

// mi serve per aggiornare il profilo corrente.
export const updateCurrentProfile = async (sessionToken, profileInput) =>
  sendApiRequest("/profile", {
    method: "PATCH",
    sessionToken,
    body: profileInput,
  });
