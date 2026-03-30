// questo file mi serve per raccogliere le rotte tecniche e di controllo del server.

import { Router } from "express";
import { getApiOverview, getHealthStatus } from "./system.controller.js";

const systemRouter = Router();

// mi serve per mostrare una panoramica delle api disponibili.
systemRouter.get("/", getApiOverview);

// mi serve per avere un endpoint di health check semplice.
systemRouter.get("/health", getHealthStatus);

export default systemRouter;
