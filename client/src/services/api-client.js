// mi serve per centralizzare le chiamate fetch del frontend verso il backend.

import { appConfig } from "../config/app-config.js";

// mi serve per costruire sempre l'url giusto delle api.
const buildRequestUrl = (path) => `${appConfig.backendBaseUrl}${path}`;

// mi serve per avere errori frontend piu' facili da gestire.
export const createApiError = (message, details = [], statusCode = 500) => {
  const error = new Error(message);
  error.details = Array.isArray(details) ? details : [String(details)];
  error.statusCode = statusCode;
  return error;
};

// mi serve per leggere la risposta del backend e trasformarla in dati utili.
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
