// lo uso per recuperare utente e sessione una sola volta e passarli poi ai controller dentro request.auth.

import { getAuthenticatedContext } from "../modules/auth/auth.service.js";
import { getAuthToken } from "../utils/get-auth-token.js";

// mi serve per bloccare subito le richieste senza token valido.
export const requireAuth = async (request, response, next) => {
  try {
    const sessionToken = getAuthToken(request);
    const authenticatedContext = await getAuthenticatedContext(sessionToken);

    request.auth = authenticatedContext;
    next();
  } catch (error) {
    next(error);
  }
};
