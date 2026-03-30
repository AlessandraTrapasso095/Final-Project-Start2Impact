// questo file mi serve per definire la forma delle notifiche del workspace.
// lo uso per creare record coerenti e per gestire lettura e aggiornamento senza ripetere sempre gli stessi campi.

import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

export const notificationTypes = ["info", "task", "profile", "feed"];

const normalizeNotificationType = (type = "info") =>
  notificationTypes.includes(type) ? type : "info";

// mi serve per creare una notifica sempre con la stessa struttura.
// qui mi tengo titolo, messaggio e link utile cosi' il frontend puo' mostrarla senza trasformazioni strane.
export const createNotificationRecord = ({
  userId,
  type = "info",
  title,
  message,
  link = "",
}) => ({
  ...createRecordMeta(),
  userId,
  type: normalizeNotificationType(type),
  title: String(title).trim(),
  message: String(message).trim(),
  link: String(link).trim(),
  isRead: false,
  readAt: null,
});

// mi serve per segnare una notifica come letta senza perdere gli altri dati.
// lo uso sia per il click singolo sia quando piu' avanti voglio segnare tutto come gia' visto.
export const markNotificationAsReadRecord = (notification) => ({
  ...notification,
  isRead: true,
  readAt: notification.readAt || new Date().toISOString(),
  updatedAt: getUpdatedTimestamp(),
});
