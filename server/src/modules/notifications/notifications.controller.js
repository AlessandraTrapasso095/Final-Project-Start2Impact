// questo file mi serve per gestire le risposte HTTP del modulo notifiche.
// lo uso per lasciare le rotte leggere e passare al client payload gia' chiari e coerenti.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  listNotificationsForUser,
  markAllNotificationsAsReadForUser,
  markNotificationAsReadForUser,
} from "./notifications.service.js";

// mi serve per restituire tutte le notifiche dell'utente autenticato.
// lo uso per popolare il pannello notifiche della dashboard con lista e riepilogo.
export const listNotificationsController = async (request, response) => {
  const notificationsPayload = await listNotificationsForUser(request.auth.user.id);

  response
    .status(200)
    .json(createSuccessResponse("Notifiche recuperate correttamente.", notificationsPayload));
};

// mi serve per segnare una notifica singola come letta.
// questo aggiorna solo la voce scelta e restituisce la notifica aggiornata.
export const markNotificationAsReadController = async (request, response) => {
  const notification = await markNotificationAsReadForUser(
    request.params.notificationId,
    request.auth.user.id,
  );

  response
    .status(200)
    .json(createSuccessResponse("Notifica aggiornata correttamente.", { notification }));
};

// mi serve per segnare come lette tutte le notifiche attive dell'utente.
// torna utile quando voglio pulire il pannello con un solo click.
export const markAllNotificationsAsReadController = async (request, response) => {
  const notificationsPayload = await markAllNotificationsAsReadForUser(request.auth.user.id);

  response
    .status(200)
    .json(createSuccessResponse("Notifiche segnate come lette.", notificationsPayload));
};
