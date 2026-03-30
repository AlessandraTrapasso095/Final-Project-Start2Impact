// questo file mi serve per costruire sempre risposte json con la stessa forma.

// mi serve come base unica per tutte le risposte api.
export const createApiResponse = ({ success, message, data = null, errors = [] }) => ({
  success,
  message,
  data,
  errors,
});

// mi serve per le risposte andate bene.
export const createSuccessResponse = (message, data = null) =>
  createApiResponse({
    success: true,
    message,
    data,
  });

// mi serve per gli errori o per le rotte non trovate.
export const createErrorResponse = (message, errors = []) =>
  createApiResponse({
    success: false,
    message,
    data: null,
    errors,
  });
