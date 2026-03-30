// questo file mi serve per creare errori HTTP in modo coerente.
// lo uso per dare a controller e servizi un modo semplice per passare status code e dettagli senza ripetere sempre la stessa struttura.

// mi serve per costruire un errore arricchito con tutte le informazioni utili al middleware finale.
// questo mi torna comodo quando voglio distinguere errori di validazione, autenticazione o conflitti.
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
