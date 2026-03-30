// questo file mi serve per comporre l'app Express senza avviare direttamente il server.

import express from "express";
import { env } from "./config/env.js";
import { corsHandler } from "./middleware/cors.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import apiRouter from "./routes/api.router.js";
import { createSuccessResponse } from "./utils/create-api-response.js";

const app = express();

// mi serve per nascondere un dettaglio tecnico inutile nelle response headers.
app.disable("x-powered-by");

// mi serve per permettere al frontend locale di parlare con il backend durante lo sviluppo.
app.use(corsHandler);

// mi serve per leggere il body json delle richieste future.
app.use(express.json({ limit: "4mb" }));

// mi serve per leggere anche payload semplici inviati da form.
app.use(express.urlencoded({ extended: true, limit: "4mb" }));

// mi serve per avere una rotta base leggibile appena apro il server nel browser.
app.get("/", (request, response) => {
  response.status(200).json(
    createSuccessResponse("Backend TaskFlow Studio pronto.", {
      apiBasePath: env.baseApiPath,
      hint: "Apri /api per vedere la panoramica delle rotte disponibili.",
    }),
  );
});

// mi serve per montare tutte le api sotto un prefisso unico e ordinato.
app.use(env.baseApiPath, apiRouter);

// mi serve per gestire prima le rotte mancanti e poi gli errori generici.
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
