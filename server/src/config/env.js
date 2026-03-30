// questo file mi serve per tenere le impostazioni base del server in un punto solo.

const defaultPort = 4321;

// mi serve per avere dei valori centrali e facili da cambiare.
export const env = Object.freeze({
  appName: "TaskFlow Studio API",
  port: Number(process.env.PORT) || defaultPort,
  baseApiPath: "/api",
});
