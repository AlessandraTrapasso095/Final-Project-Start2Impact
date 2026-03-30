// questo file mi serve per gestire le risposte del modulo system

import { env } from "../../config/env.js";
import { createSuccessResponse } from "../../utils/create-api-response.js";

const availableRoutes = [
  {
    method: "GET",
    path: `${env.baseApiPath}`,
    description: "panoramica generale delle api",
  },
  {
    method: "GET",
    path: `${env.baseApiPath}/health`,
    description: "controllo rapido dello stato del server",
  },
  {
    method: "GET",
    path: `${env.baseApiPath}/auth`,
    description: "panoramica del modulo autenticazione",
  },
  {
    method: "POST",
    path: `${env.baseApiPath}/auth/register`,
    description: "registrazione utente",
  },
  {
    method: "POST",
    path: `${env.baseApiPath}/auth/login`,
    description: "login utente",
  },
  {
    method: "GET",
    path: `${env.baseApiPath}/auth/session`,
    description: "recupero sessione attiva",
  },
  {
    method: "POST",
    path: `${env.baseApiPath}/auth/logout`,
    description: "logout utente",
  },
  {
    method: "GET",
    path: `${env.baseApiPath}/tasks`,
    description: "lista task dell'utente autenticato",
  },
  {
    method: "POST",
    path: `${env.baseApiPath}/tasks`,
    description: "creazione task",
  },
  {
    method: "PATCH",
    path: `${env.baseApiPath}/tasks/:taskId`,
    description: "aggiornamento task",
  },
  {
    method: "DELETE",
    path: `${env.baseApiPath}/tasks/:taskId`,
    description: "eliminazione task",
  },
];

// mi serve per avere una home delle api leggibile anche dal browser.
export const getApiOverview = (request, response) => {
  response.status(200).json(
    createSuccessResponse("API pronta. Struttura backend impostata correttamente.", {
      appName: env.appName,
      currentStep: "Step 9 - API task board",
      routes: availableRoutes,
    }),
  );
};

// mi serve per un check semplice e veloce.
export const getHealthStatus = (request, response) => {
  response.status(200).json(
    createSuccessResponse("Server attivo.", {
      status: "ok",
      checkedAt: new Date().toISOString(),
    }),
  );
};
