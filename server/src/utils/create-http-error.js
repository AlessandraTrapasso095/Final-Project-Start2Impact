// questo file mi serve per creare errori HTTP in modo coerente.

// mi serve per costruire un errore arricchito con tutte le informazioni utili al middleware finale.
export const createHttpError = (
  statusCode,
  message,
  errors = [],
  publicMessage = message,
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.publicMessage = publicMessage;
  error.errors = Array.isArray(errors) ? errors : [String(errors)];

  return error;
};
