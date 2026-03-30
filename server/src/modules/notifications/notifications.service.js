// questo file mi serve per raccogliere la logica del sistema notifiche.
// lo uso per creare eventi leggibili, filtrare per utente e gestire la lettura senza appesantire controller e altri moduli.

import { createHttpError } from "../../utils/create-http-error.js";
import {
  createNotification,
  findNotificationById,
  getNotificationsByUserId,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "./notification.repository.js";

const sortNotifications = (notifications) =>
  [...notifications].sort((firstNotification, secondNotification) => {
    if (firstNotification.isRead !== secondNotification.isRead) {
      return Number(firstNotification.isRead) - Number(secondNotification.isRead);
    }

    return secondNotification.updatedAt.localeCompare(firstNotification.updatedAt);
  });

const createNotificationSummary = (notifications) => ({
  total: notifications.length,
  unread: notifications.filter((notification) => !notification.isRead).length,
  read: notifications.filter((notification) => notification.isRead).length,
});

// mi serve per creare una notifica riusabile da qualunque modulo del backend.
// cosi' task, profilo e bacheca possono inviare eventi senza duplicare validazioni e struttura.
export const createNotificationForUser = async (userId, notificationInput = {}) => {
  if (!userId) {
    throw createHttpError(
      400,
      "Utente notifica mancante.",
      ["Mi serve l'id utente per creare una notifica."],
      "Notifica non valida.",
    );
  }

  if (!notificationInput.title || !notificationInput.message) {
    throw createHttpError(
      400,
      "Notifica non valida.",
      ["Titolo e messaggio sono obbligatori per creare una notifica."],
      "Notifica non valida.",
    );
  }

  return createNotification({
    userId,
    type: notificationInput.type || "info",
    title: notificationInput.title,
    message: notificationInput.message,
    link: notificationInput.link || "",
  });
};

// mi serve per restituire l'elenco ordinato delle notifiche del workspace.
// lo uso per dare al frontend sia la lista sia un piccolo riepilogo pronto da mostrare.
export const listNotificationsForUser = async (userId) => {
  const notifications = await getNotificationsByUserId(userId);
  const sortedNotifications = sortNotifications(notifications);

  return {
    notifications: sortedNotifications,
    summary: createNotificationSummary(sortedNotifications),
  };
};

const getOwnedNotificationOrThrow = async (notificationId, userId) => {
  const notification = await findNotificationById(notificationId);

  if (!notification || notification.userId !== userId) {
    throw createHttpError(
      404,
      "Notifica non trovata.",
      ["Non esiste nessuna notifica con questo id per l'utente corrente."],
      "Notifica non trovata.",
    );
  }

  return notification;
};

// mi serve per segnare una notifica singola come letta controllando prima la proprieta'.
// cosi' il frontend non puo' aggiornare notifiche di altri utenti solo cambiando id nella richiesta.
export const markNotificationAsReadForUser = async (notificationId, userId) => {
  await getOwnedNotificationOrThrow(notificationId, userId);

  return markNotificationAsRead(notificationId);
};

// mi serve per segnare come lette tutte le notifiche dell'utente.
// restituisco anche quante ne ho aggiornate cosi' il frontend puo' dare un feedback utile.
export const markAllNotificationsAsReadForUser = async (userId) => {
  const updatedCount = await markAllNotificationsAsRead(userId);

  return {
    updatedCount,
    allRead: true,
  };
};
