// questo file mi serve per montare le rotte del profilo utente.

import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import { getProfileController, updateProfileController } from "./profile.controller.js";

const profileRouter = Router();

// mi serve per proteggere tutte le rotte profilo con la sessione attiva.
profileRouter.use(requireAuth);

// mi serve per leggere il profilo dell'utente loggato.
profileRouter.get("/", getProfileController);

// mi serve per aggiornare i dati del profilo.
profileRouter.patch("/", updateProfileController);

export default profileRouter;
