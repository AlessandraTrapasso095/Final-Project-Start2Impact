// questo file mi serve per raccogliere le rotte tecniche e di controllo del server.
// lo uso per separare bene la definizione delle url dalla logica che risponde davvero.

import { Router } from "express";
import { getApiOverview, getHealthStatus } from "./system.controller.js";

const systemRouter = Router();

// mi serve per mostrare una panoramica veloce delle api disponibili.
systemRouter.get("/", getApiOverview);

// mi serve per avere un endpoint di health check semplice.
systemRouter.get("/health", getHealthStatus);

export default systemRouter;
