// questo file mi serve per tenere tutte le chiamate del profilo utente in un posto solo.
// lo uso per leggere e aggiornare le informazioni personali senza sporcare i componenti con fetch ripetute.

import { sendApiRequest } from "./api-client.js";

// mi serve per recuperare il profilo completo dell'utente autenticato.
// lo uso quando apro la dashboard e voglio sincronizzare nome, ruolo e bio.
export const getCurrentProfile = async (sessionToken) =>
  sendApiRequest("/profile", {
    method: "GET",
    sessionToken,
  });

// mi serve per aggiornare il profilo corrente.
// mando al backend solo i campi modificabili del form personale.
export const updateCurrentProfile = async (sessionToken, profileInput) =>
  sendApiRequest("/profile", {
    method: "PATCH",
    sessionToken,
    body: profileInput,
  });
