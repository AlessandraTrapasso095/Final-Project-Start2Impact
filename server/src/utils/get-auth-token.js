// questo file mi serve per leggere il token di sessione dalle richieste 

const bearerPrefix = "Bearer ";

// mi serve per supportare sia authorization header sia x-session-token.
export const getAuthToken = (request) => {
  const authorizationHeader = request.headers?.authorization;
  const customSessionHeader = request.headers?.["x-session-token"];
  const sessionTokenFromBody = request.body?.sessionToken;

  if (
    typeof authorizationHeader === "string" &&
    authorizationHeader.startsWith(bearerPrefix)
  ) {
    return authorizationHeader.slice(bearerPrefix.length).trim();
  }

  if (typeof customSessionHeader === "string" && customSessionHeader.trim()) {
    return customSessionHeader.trim();
  }

  if (typeof sessionTokenFromBody === "string" && sessionTokenFromBody.trim()) {
    return sessionTokenFromBody.trim();
  }

  return "";
};
