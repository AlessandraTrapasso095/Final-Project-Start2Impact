// questo file mi serve per gestire tutte le richieste che non trovano nessuna rotta valida.
// lo uso per restituire un errore chiaro invece del classico messaggio confuso o vuoto.

import { createErrorResponse } from "../utils/create-api-response.js";

// mi serve per chiudere in modo ordinato le rotte inesistenti.
// questo prende metodo e url cosi' nel client capiamo subito cosa non ha funzionato.
export const notFoundHandler = (request, response) => {
  response.status(404).json(
    createErrorResponse("Risorsa non trovata.", [
      `${request.method} ${request.originalUrl} non esiste.`,
    ]),
  );
};
