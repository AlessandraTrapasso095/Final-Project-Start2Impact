// questo file mi serve per gestire le risposte HTTP del modulo profilo.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import { getProfileForUser, updateProfileForUser } from "./profile.service.js";

// mi serve per restituire il profilo dell'utente autenticato.
export const getProfileController = async (request, response) => {
  const profilePayload = await getProfileForUser(request.auth.user.id);

  response.status(200).json(createSuccessResponse("Profilo recuperato correttamente.", profilePayload));
};

// mi serve per aggiornare il profilo dell'utente corrente.
export const updateProfileController = async (request, response) => {
  const profilePayload = await updateProfileForUser(request.auth.user.id, request.body);

  response.status(200).json(createSuccessResponse("Profilo aggiornato correttamente.", profilePayload));
};
