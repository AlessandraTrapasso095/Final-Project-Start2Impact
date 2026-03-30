// lo uso per tenere insieme protezione auth, elenco e azioni di lettura 

import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import {
  listNotificationsController,
  markAllNotificationsAsReadController,
  markNotificationAsReadController,
} from "./notifications.controller.js";

const notificationsRouter = Router();

// mi serve per proteggere tutto il modulo notifiche.
notificationsRouter.use(requireAuth);

// mi serve per leggere il pannello notifiche dell'utente autenticato.
notificationsRouter.get("/", listNotificationsController);

// mi serve per segnare una notifica singola come letta.
notificationsRouter.patch("/:notificationId/read", markNotificationAsReadController);

// mi serve per segnare tutte le notifiche come lette.
notificationsRouter.post("/read-all", markAllNotificationsAsReadController);

export default notificationsRouter;
