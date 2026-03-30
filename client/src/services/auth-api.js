// questo file mi serve per tenere tutte le chiamate auth del frontend in un posto solo.
// lo uso per centralizzare fetch, header, parsing delle risposte e gestione degli errori delle api.

import { sendApiRequest } from "./api-client.js";

// mi serve per registrare un nuovo utente dal frontend.
// lo uso quando il form registrazione ha gia' passato i controlli locali e voglio aprire subito la sessione.
export const registerAuthUser = async ({ name, email, password }) =>
  sendApiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

// mi serve per fare login con email e password.
// questo restituisce utente e sessione attiva se il backend conferma le credenziali.
export const loginAuthUser = async ({ email, password }) =>
  sendApiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

// mi serve per recuperare la sessione corrente usando il token gia' salvato nel browser.
// lo uso al caricamento della pagina per capire se l'utente e' gia' autenticato.
export const getCurrentAuthSession = async (sessionToken) =>
  sendApiRequest("/auth/session", {
    method: "GET",
    sessionToken,
  });

// mi serve per chiudere la sessione attiva.
// lo uso quando l'utente clicca logout e voglio invalidare il token sia lato frontend sia lato backend.
export const logoutAuthUser = async (sessionToken) =>
  sendApiRequest("/auth/logout", {
    method: "POST",
    sessionToken,
  });
