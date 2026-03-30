// questo file mi serve per raccogliere in un solo punto tutti i moduli api.

import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import feedRouter from "../modules/feed/feed.routes.js";
import notificationsRouter from "../modules/notifications/notifications.routes.js";
import profileRouter from "../modules/profile/profile.routes.js";
import systemRouter from "../modules/system/system.routes.js";
import tasksRouter from "../modules/tasks/tasks.routes.js";

const apiRouter = Router();

// mi serve per esporre la panoramica generale e la health route.
apiRouter.use("/", systemRouter);

// mi serve per tenere il modulo autenticazione separato e facile da estendere.
apiRouter.use("/auth", authRouter);

// mi serve per esporre la task board protetta dell'utente autenticato.
apiRouter.use("/tasks", tasksRouter);

// mi serve per esporre il profilo utente aggiornabile.
apiRouter.use("/profile", profileRouter);

// mi serve per esporre la bacheca post e commenti del team.
apiRouter.use("/feed", feedRouter);

// mi serve per esporre il centro notifiche del workspace.
apiRouter.use("/notifications", notificationsRouter);

export default apiRouter;
