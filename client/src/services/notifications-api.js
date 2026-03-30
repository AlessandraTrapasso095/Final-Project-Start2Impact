// lo uso per leggere la lista, segnare una voce come letta e pulire l'intero pannello.

import { sendApiRequest } from "./api-client.js";

// mi serve per caricare le notifiche dell'utente autenticato.
export const getWorkspaceNotifications = async (sessionToken) =>
  sendApiRequest("/notifications", {
    method: "GET",
    sessionToken,
  });

// mi serve per segnare una notifica singola come letta.
export const markNotificationAsRead = async (sessionToken, notificationId) =>
  sendApiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    sessionToken,
  });

// mi serve per segnare tutte le notifiche come lette 
export const markAllNotificationsAsRead = async (sessionToken) =>
  sendApiRequest("/notifications/read-all", {
    method: "POST",
    sessionToken,
  });
