// questo file mi serve per gestire le risposte HTTP del modulo tasks.
// lo uso per tenere leggere le rotte e delegare al service la logica vera dei task.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  createTaskForUser,
  deleteTaskForUser,
  getTaskForUser,
  listTasksForUser,
  updateTaskForUser,
} from "./tasks.service.js";

// mi serve per restituire la lista task dell'utente autenticato.
// questo usa request.auth popolato dal middleware requireAuth e manda al client anche il riepilogo.
export const listTasksController = async (request, response) => {
  const tasksPayload = await listTasksForUser(request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task recuperati correttamente.", tasksPayload));
};

// mi serve per creare un task nuovo per l'utente attuale.
// questo mi permette di collegare subito il task al proprietario senza fidarmi di un ownerId arrivato dal client.
export const createTaskController = async (request, response) => {
  const task = await createTaskForUser(request.auth.user.id, request.body);

  response.status(201).json(createSuccessResponse("Task creato correttamente.", { task }));
};

// mi serve per leggere il dettaglio di un task specifico.
// lo uso quando il frontend ha bisogno di aprire una card o controllare un task singolo.
export const getTaskController = async (request, response) => {
  const task = await getTaskForUser(request.params.taskId, request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task recuperato correttamente.", { task }));
};

// mi serve per aggiornare un task esistente con patch parziali.
// questo e' il punto dove il frontend potra' cambiare titolo, descrizione, stato o priorita'.
export const updateTaskController = async (request, response) => {
  const task = await updateTaskForUser(request.params.taskId, request.auth.user.id, request.body);

  response.status(200).json(createSuccessResponse("Task aggiornato correttamente.", { task }));
};

// mi serve per eliminare un task della board corrente.
// questo restituisce anche un piccolo payload di conferma utile al frontend.
export const deleteTaskController = async (request, response) => {
  const deletionPayload = await deleteTaskForUser(request.params.taskId, request.auth.user.id);

  response.status(200).json(createSuccessResponse("Task eliminato correttamente.", deletionPayload));
};
