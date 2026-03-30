// questo file mi serve per leggere e scrivere le notifiche nel file dati.
// lo uso per tenere separata la persistenza dalla logica di business del modulo notifiche.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import {
  createNotificationRecord,
  markNotificationAsReadRecord,
} from "./notification.model.js";

// mi serve per recuperare tutte le notifiche salvate.
// lo uso come base sia per i filtri utente sia per gli aggiornamenti di stato.
export const getNotifications = async () => {
  const database = await readDatabase();

  return database.notifications;
};

// mi serve per filtrare le notifiche del solo utente autenticato.
// cosi' ogni persona vede il proprio storico senza incrociare dati altrui.
export const getNotificationsByUserId = async (userId) => {
  const notifications = await getNotifications();

  return notifications.filter((notification) => notification.userId === userId);
};

// mi serve per trovare una notifica specifica.
// lo uso prima di update e controlli di proprieta'.
export const findNotificationById = async (notificationId) => {
  const notifications = await getNotifications();

  return notifications.find((notification) => notification.id === notificationId) || null;
};

// mi serve per creare una notifica nuova.
// questo salva il record gia' pronto e lo restituisce subito al service.
export const createNotification = async (notificationData) => {
  const nextNotification = createNotificationRecord(notificationData);

  await updateDatabase((database) => {
    database.notifications.push(nextNotification);
    return database;
  });

  return nextNotification;
};

// mi serve per segnare una notifica singola come letta.
// lo uso quando nel frontend apro una voce o la segno manualmente come gestita.
export const markNotificationAsRead = async (notificationId) => {
  let updatedNotification = null;

  await updateDatabase((database) => {
    database.notifications = database.notifications.map((notification) => {
      if (notification.id !== notificationId) {
        return notification;
      }

      updatedNotification = notification.isRead
        ? notification
        : markNotificationAsReadRecord(notification);

      return updatedNotification;
    });

    return database;
  });

  return updatedNotification;
};

// mi serve per segnare come lette tutte le notifiche di un utente.
// questo mi aiuta a tenere semplice il pulsante "segna tutte come lette" nel frontend.
export const markAllNotificationsAsRead = async (userId) => {
  let updatedCount = 0;

  await updateDatabase((database) => {
    database.notifications = database.notifications.map((notification) => {
      if (notification.userId !== userId || notification.isRead) {
        return notification;
      }

      updatedCount += 1;
      return markNotificationAsReadRecord(notification);
    });

    return database;
  });

  return updatedCount;
};
