// questo file mi serve per gestire le risposte del modulo auth.
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

// mi serve per dare una panoramica leggibile del modulo auth e dei suoi endpoint.
// questo torna utile quando apro l'api nel browser o devo ricordarmi come passare il token.
export const getAuthModuleOverview = (request, response) => {
  response
    .status(200)
    .json(createSuccessResponse("Modulo autenticazione disponibile.", getAuthModuleInfo()));
};

// mi serve per registrare un utente nuovo e aprire subito la sua sessione.
// lo uso cosi' il client riceve gia' user e token in una sola risposta.
export const registerUserController = async (request, response) => {
  const authPayload = await registerUser(request.body);

  response.status(201).json(createSuccessResponse("Registrazione completata.", authPayload));
};

// mi serve per autenticare un utente gia' esistente.
// questo controlla le credenziali e restituisce una nuova sessione attiva.
export const loginUserController = async (request, response) => {
  const authPayload = await loginUser(request.body);

  response.status(200).json(createSuccessResponse("Login completato.", authPayload));
};

// mi serve per recuperare la sessione corrente a partire dal token della richiesta.
// questo ci tornera' utile quando il frontend dovra' capire se l'utente e' gia' loggato.
export const getCurrentSessionController = async (request, response) => {
  const sessionToken = getAuthToken(request);
  const authPayload = await getCurrentSession(sessionToken);

  response.status(200).json(createSuccessResponse("Sessione recuperata.", authPayload));
};

// mi serve per chiudere la sessione attuale.
// questo invalida il token e conferma al client che il logout e' andato a buon fine.
export const logoutUserController = async (request, response) => {
  const sessionToken = getAuthToken(request);
  const logoutPayload = await logoutUser(sessionToken);

  response.status(200).json(createSuccessResponse("Logout completato.", logoutPayload));
};
