// questo file mi serve per leggere e scrivere le notifiche nel file dati.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import {
  createNotificationRecord,
  markNotificationAsReadRecord,
} from "./notification.model.js";

// mi serve per recuperare tutte le notifiche salvate.
export const getNotifications = async () => {
  const database = await readDatabase();

  return database.notifications;
};

// mi serve per filtrare le notifiche del solo utente autenticato.
export const getNotificationsByUserId = async (userId) => {
  const notifications = await getNotifications();

  return notifications.filter((notification) => notification.userId === userId);
};

// mi serve per trovare una notifica specifica.
export const findNotificationById = async (notificationId) => {
  const notifications = await getNotifications();

  return notifications.find((notification) => notification.id === notificationId) || null;
};

// mi serve per creare una notifica nuova.
export const createNotification = async (notificationData) => {
  const nextNotification = createNotificationRecord(notificationData);

  await updateDatabase((database) => {
    database.notifications.push(nextNotification);
    return database;
  });

  return nextNotification;
};

// mi serve per segnare una notifica singola come letta.
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
