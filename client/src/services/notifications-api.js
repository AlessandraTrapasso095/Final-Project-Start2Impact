// questo file mi serve per tenere insieme tutte le chiamate del centro notifiche.
// lo uso per leggere la lista, segnare una voce come letta e pulire l'intero pannello.

import { sendApiRequest } from "./api-client.js";

// mi serve per caricare le notifiche dell'utente autenticato.
// lo uso ogni volta che apro la dashboard o succede un'azione importante nel workspace.
export const getWorkspaceNotifications = async (sessionToken) =>
  sendApiRequest("/notifications", {
    method: "GET",
    sessionToken,
  });

// mi serve per segnare una notifica singola come letta.
// questo mi aiuta a mantenere il pannello ordinato senza ricaricare tutto a mano.
export const markNotificationAsRead = async (sessionToken, notificationId) =>
  sendApiRequest(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    sessionToken,
  });

// mi serve per segnare tutte le notifiche come lette in un colpo solo.
// lo uso per il pulsante rapido del pannello notifiche.
export const markAllNotificationsAsRead = async (sessionToken) =>
  sendApiRequest("/notifications/read-all", {
    method: "POST",
    sessionToken,
  });
