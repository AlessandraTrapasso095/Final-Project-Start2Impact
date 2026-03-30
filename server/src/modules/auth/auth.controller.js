// lo uso per tenere le rotte leggere e spostare qui la logica che decide cosa mandare al client.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import { getAuthToken } from "../../utils/get-auth-token.js";
import {
  getAuthModuleInfo,
  getCurrentSession,
  loginUser,
  logoutUser,
  registerUser,
} from "./auth.service.js";

// questo torna utile quando apro l'api nel browser o devo ricordarmi come passare il token.
export const getAuthModuleOverview = (request, response) => {
  response
    .status(200)
    .json(createSuccessResponse("Modulo autenticazione disponibile.", getAuthModuleInfo()));
};

// lo uso cosi' il client riceve gia' user e token in una sola risposta.
export const registerUserController = async (request, response) => {
  const authPayload = await registerUser(request.body);

  response.status(201).json(createSuccessResponse("Registrazione completata.", authPayload));
};

// questo controlla le credenziali e restituisce una nuova sessione attiva.
export const loginUserController = async (request, response) => {
  const authPayload = await loginUser(request.body);

  response.status(200).json(createSuccessResponse("Login completato.", authPayload));
};

// mi serve per recuperare la sessione corrente a partire dal token della richiesta.
export const getCurrentSessionController = async (request, response) => {
  const sessionToken = getAuthToken(request);
  const authPayload = await getCurrentSession(sessionToken);

  response.status(200).json(createSuccessResponse("Sessione recuperata.", authPayload));
};

// mi serve per chiudere la sessione attuale.
export const logoutUserController = async (request, response) => {
  const sessionToken = getAuthToken(request);
  const logoutPayload = await logoutUser(sessionToken);

  response.status(200).json(createSuccessResponse("Logout completato.", logoutPayload));
};
