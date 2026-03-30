// questo file mi serve per definire le rotte del modulo task board.

import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  listTasksController,
  updateTaskController,
} from "./tasks.controller.js";

const tasksRouter = Router();

// mi serve per proteggere tutte le rotte task con la stessa regola auth.
tasksRouter.use(requireAuth);

// mi serve per leggere tutta la board dell'utente autenticato.
tasksRouter.get("/", listTasksController);

// mi serve per creare un task nuovo.
tasksRouter.post("/", createTaskController);

// mi serve per leggere il dettaglio di un task singolo.
tasksRouter.get("/:taskId", getTaskController);

// mi serve per aggiornare un task esistente.
tasksRouter.patch("/:taskId", updateTaskController);

// mi serve per eliminare un task.
tasksRouter.delete("/:taskId", deleteTaskController);

export default tasksRouter;
