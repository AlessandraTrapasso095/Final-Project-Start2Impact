// questo file mi serve per costruire sempre risposte json con la stessa forma.
// lo uso per restare DRY e non riscrivere ogni volta success, message, data ed errors.

// mi serve come base unica per tutte le risposte api.
// questo prende i pezzi che servono e li rimette insieme in un oggetto coerente.
export const createApiResponse = ({ success, message, data = null, errors = [] }) => ({
  success,
  message,
  data,
  errors,
});

// mi serve per le risposte andate bene.
// lo uso quando voglio mandare un messaggio chiaro e magari anche dei dati utili.
export const createSuccessResponse = (message, data = null) =>
  createApiResponse({
    success: true,
    message,
    data,
  });

// mi serve per gli errori o per le rotte non trovate.
// questo mi evita di inventare un formato diverso ogni volta che qualcosa non va.
export const createErrorResponse = (message, errors = []) =>
  createApiResponse({
    success: false,
    message,
    data: null,
    errors,
  });
