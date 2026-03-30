// questo file mi serve per gestire le risposte HTTP del modulo profilo.
// lo uso per lasciare ai service la logica vera e restituire al frontend payload semplici da leggere.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import { getProfileForUser, updateProfileForUser } from "./profile.service.js";

// mi serve per restituire il profilo dell'utente autenticato.
// cosi' la dashboard puo' caricare nome e dati personali senza query duplicate.
export const getProfileController = async (request, response) => {
  const profilePayload = await getProfileForUser(request.auth.user.id);

  response.status(200).json(createSuccessResponse("Profilo recuperato correttamente.", profilePayload));
};

// mi serve per aggiornare il profilo dell'utente corrente.
// lo uso quando il frontend salva il form profilo nella sidebar della dashboard.
export const updateProfileController = async (request, response) => {
  const profilePayload = await updateProfileForUser(request.auth.user.id, request.body);

  response.status(200).json(createSuccessResponse("Profilo aggiornato correttamente.", profilePayload));
};
