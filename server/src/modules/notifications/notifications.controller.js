// lo uso per lasciare le rotte leggere e passare al client payload 

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  listNotificationsForUser,
  markAllNotificationsAsReadForUser,
  markNotificationAsReadForUser,
} from "./notifications.service.js";

// lo uso per popolare il pannello notifiche della dashboard con lista e riepilogo.
export const listNotificationsController = async (request, response) => {
  const notificationsPayload = await listNotificationsForUser(request.auth.user.id);

  response
    .status(200)
    .json(createSuccessResponse("Notifiche recuperate correttamente.", notificationsPayload));
};

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

// torna utile quando voglio pulire il pannello con un solo click.
export const markAllNotificationsAsReadController = async (request, response) => {
  const notificationsPayload = await markAllNotificationsAsReadForUser(request.auth.user.id);

  response
    .status(200)
    .json(createSuccessResponse("Notifiche segnate come lette.", notificationsPayload));
};
