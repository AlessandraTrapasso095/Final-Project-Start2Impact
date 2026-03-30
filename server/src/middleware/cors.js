// questo file mi serve per permettere al frontend locale di parlare con le api durante lo sviluppo.
// lo uso per gestire gli header CORS in un punto solo e non dover rincorrere errori del browser piu' avanti.

const allowedOrigins = new Set([
  "http://127.0.0.1:5174",
  "http://127.0.0.1:4174",
  "http://localhost:5174",
  "http://localhost:4174",
]);

const allowedHeaders = "Content-Type, Authorization, X-Session-Token";
const allowedMethods = "GET, POST, PATCH, DELETE, OPTIONS";

// mi serve per rispondere bene alle richieste del browser quando il frontend chiama il backend.
// questo aggiunge gli header utili solo alle origini che conosciamo e chiude subito le preflight OPTIONS.
export const corsHandler = (request, response, next) => {
  const requestOrigin = request.headers.origin;

  if (requestOrigin && allowedOrigins.has(requestOrigin)) {
    response.setHeader("Access-Control-Allow-Origin", requestOrigin);
    response.setHeader("Vary", "Origin");
    response.setHeader("Access-Control-Allow-Headers", allowedHeaders);
    response.setHeader("Access-Control-Allow-Methods", allowedMethods);
  }

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
};
