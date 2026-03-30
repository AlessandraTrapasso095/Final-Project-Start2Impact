// questo file mi serve per centralizzare le chiamate fetch del frontend verso il backend.
// lo uso per restare DRY tra auth e task board, cosi' parsing errori e header stanno in un posto solo.

import { appConfig } from "../config/app-config.js";

// mi serve per costruire sempre l'url giusto delle api.
// lo uso cosi' nei servizi dei moduli passo solo il path finale e non ripeto tutta la base url.
const buildRequestUrl = (path) => `${appConfig.backendBaseUrl}${path}`;

// mi serve per avere errori frontend piu' facili da gestire.
// lo uso per tenermi dietro messaggio, dettagli e anche lo status code della risposta.
export const createApiError = (message, details = [], statusCode = 500) => {
  const error = new Error(message);
  error.details = Array.isArray(details) ? details : [String(details)];
  error.statusCode = statusCode;
  return error;
};

// mi serve per leggere la risposta del backend e trasformarla in dati utili.
// questo controlla sia gli errori http sia il flag success del payload json.
const parseApiResponse = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    throw createApiError("La risposta del server non e' valida.", [
      "Non sono riuscita a leggere il JSON restituito dalle API.",
    ]);
  }

  if (!response.ok || !payload.success) {
    throw createApiError(
      payload?.message || "La richiesta alle API non e' andata a buon fine.",
      payload?.errors || [],
      response.status,
    );
  }

  return payload.data;
};

// mi serve per inviare richieste fetch con una forma unica e riusabile.
// lo uso per aggiungere token, body json e parsing finale senza duplicare codice nei singoli moduli.
export const sendApiRequest = async (
  path,
  { method = "GET", sessionToken = "", body } = {},
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (sessionToken) {
    headers.Authorization = `Bearer ${sessionToken}`;
    headers["X-Session-Token"] = sessionToken;
  }

  const response = await fetch(buildRequestUrl(path), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return parseApiResponse(response);
};
