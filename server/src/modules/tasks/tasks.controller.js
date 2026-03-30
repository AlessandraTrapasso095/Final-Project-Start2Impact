// questo file mi serve per gestire le risposte HTTP del modulo tasks.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  createTaskForUser,
  deleteTaskForUser,
  getTaskForUser,
  listTasksForUser,
  updateTaskForUser,
} from "./tasks.service.js";

// mi serve per restituire la lista task dell'utente autenticato.
export const listTasksController = async (request, response) => {
  const tasksPayload = await listTasksForUser(request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task recuperati correttamente.", tasksPayload));
};

// mi serve per creare un task nuovo per l'utente attuale.
export const createTaskController = async (request, response) => {
  const task = await createTaskForUser(request.auth.user.id, request.body);

  response.status(201).json(createSuccessResponse("Task creato correttamente.", { task }));
};

// mi serve per leggere il dettaglio di un task specifico.
export const getTaskController = async (request, response) => {
  const task = await getTaskForUser(request.params.taskId, request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task recuperato correttamente.", { task }));
};

// mi serve per aggiornare un task esistente con patch parziali.
export const updateTaskController = async (request, response) => {
  const task = await updateTaskForUser(request.params.taskId, request.auth.user.id, request.body);

  response.status(200).json(createSuccessResponse("Task aggiornato correttamente.", { task }));
};

// mi serve per eliminare un task della board corrente.
export const deleteTaskController = async (request, response) => {
  const deletionPayload = await deleteTaskForUser(request.params.taskId, request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task eliminato correttamente.", deletionPayload));
};
