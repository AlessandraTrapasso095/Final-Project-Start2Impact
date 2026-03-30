// questo file mi serve per definire le rotte del modulo auth

import { Router } from "express";
import {
  getAuthModuleOverview,
  getCurrentSessionController,
  loginUserController,
  logoutUserController,
  registerUserController,
} from "./auth.controller.js";

const authRouter = Router();

// mi serve per avere una panoramica generale del modulo auth.
authRouter.get("/", getAuthModuleOverview);

// mi serve per creare un account nuovo e restituire subito la sessione attiva.
authRouter.post("/register", registerUserController);

// mi serve per fare login con email e password.
authRouter.post("/login", loginUserController);

// mi serve per recuperare la sessione corrente partendo dal token inviato.
authRouter.get("/session", getCurrentSessionController);

// mi serve per chiudere la sessione dell'utente corrente.
authRouter.post("/logout", logoutUserController);

export default authRouter;
