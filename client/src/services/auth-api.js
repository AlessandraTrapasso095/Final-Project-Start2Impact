// questo file mi serve per tenere tutte le chiamate auth del frontend in un posto solo.

import { sendApiRequest } from "./api-client.js";

// lo uso quando il form registrazione ha gia' passato i controlli locali e voglio aprire subito la sessione.
export const registerAuthUser = async ({ name, email, password }) =>
  sendApiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });

// mi serve per fare login con email e password.
export const loginAuthUser = async ({ email, password }) =>
  sendApiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

// lo uso al caricamento della pagina per capire se l'utente e' gia' autenticato.
export const getCurrentAuthSession = async (sessionToken) =>
  sendApiRequest("/auth/session", {
    method: "GET",
    sessionToken,
  });

// lo uso quando l'utente clicca logout e voglio invalidare il token sia lato frontend sia lato backend.
export const logoutAuthUser = async (sessionToken) =>
  sendApiRequest("/auth/logout", {
    method: "POST",
    sessionToken,
  });
