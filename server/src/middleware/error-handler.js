// questo file mi serve per gestire gli errori in un solo punto.
// lo uso per non ripetere la stessa risposta di errore in ogni controller e per restare ordinato.

import { createErrorResponse } from "../utils/create-api-response.js";

// mi serve come rete di sicurezza finale.
// questo intercetta errori inattesi, decide lo status code e restituisce una risposta json coerente.
export const errorHandler = (error, request, response, next) => {
  const isEntityTooLargeError = error.type === "entity.too.large" || error.status === 413;
  const statusCode = isEntityTooLargeError ? 413 : error.statusCode || 500;
  const errorMessage = isEntityTooLargeError
    ? "L'immagine profilo e' troppo pesante."
    : error.message || "Errore interno del server.";
  const errorDetails = isEntityTooLargeError
    ? ["Provo con un'immagine piu' piccola o piu' compressa."]
    : Array.isArray(error.errors) && error.errors.length > 0
      ? error.errors
      : [errorMessage];
  const publicMessage = isEntityTooLargeError
    ? "L'immagine profilo e' troppo pesante. Scelgo un file piu' leggero."
    : error.publicMessage ||
      (statusCode >= 500 ? "Si e' verificato un errore nel server." : errorMessage);

  // mi serve per vedere nel terminale l'errore reale mentre sviluppo.
  console.error(error);

  response.status(statusCode).json(createErrorResponse(publicMessage, errorDetails));
};
