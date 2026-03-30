// questo file mi serve per definire la forma delle notifiche del workspace.

import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

export const notificationTypes = ["info", "task", "profile", "feed"];

const normalizeNotificationType = (type = "info") =>
  notificationTypes.includes(type) ? type : "info";

// qui mi tengo titolo, messaggio e link utile cosi' il frontend puo' mostrarla
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
export const markNotificationAsReadRecord = (notification) => ({
  ...notification,
  isRead: true,
  readAt: notification.readAt || new Date().toISOString(),
  updatedAt: getUpdatedTimestamp(),
});
