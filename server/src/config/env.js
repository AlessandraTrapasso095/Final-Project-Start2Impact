// questo file mi serve per tenere le impostazioni base del server in un punto solo.
// lo uso per evitare di ripetere valori come porta, nome progetto e prefisso delle api in piu' file.

const defaultPort = 4321;

// mi serve per avere dei valori centrali e facili da cambiare.
// cosi' se piu' avanti cambiamo porta o percorso api, tocchiamo un solo file.
export const env = Object.freeze({
  appName: "TaskFlow Studio API",
  port: Number(process.env.PORT) || defaultPort,
  baseApiPath: "/api",
});
