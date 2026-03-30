// questo file mi serve per avviare il server Node.

import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  // mi serve per vedere subito nel terminale dove si sta avviando il backend.
  console.log(`[server] ${env.appName} in ascolto su http://localhost:${env.port}`);
});

// mi serve per chiudere il server in modo ordinato quando fermo il processo.
const shutdownServer = (signal) => {
  console.log(`[server] ricevuto ${signal}, chiusura in corso...`);

  server.close(() => {
    console.log("[server] server arrestato correttamente.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdownServer("SIGINT"));
process.on("SIGTERM", () => shutdownServer("SIGTERM"));
