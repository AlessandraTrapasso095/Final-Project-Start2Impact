// questo file mi serve per gestire tutte le richieste che non trovano nessuna rotta valida.

import { createErrorResponse } from "../utils/create-api-response.js";

// mi serve per chiudere in modo ordinato le rotte inesistenti.
export const notFoundHandler = (request, response) => {
  response.status(404).json(
    createErrorResponse("Risorsa non trovata.", [
      `${request.method} ${request.originalUrl} non esiste.`,
    ]),
  );
};
