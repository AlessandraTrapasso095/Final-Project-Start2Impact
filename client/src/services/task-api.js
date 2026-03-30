// lo uso per lavorare con lista, creazione, modifica e cancellazione dei task 

import { sendApiRequest } from "./api-client.js";

// mi serve per recuperare tutta la board dell'utente autenticato.
export const getTaskBoard = async (sessionToken) =>
  sendApiRequest("/tasks", {
    method: "GET",
    sessionToken,
  });

// mi serve per creare un task nuovo partendo dal form del frontend.
export const createTaskItem = async (sessionToken, taskInput) =>
  sendApiRequest("/tasks", {
    method: "POST",
    sessionToken,
    body: taskInput,
  });

// mi serve per aggiornare un task esistente con patch parziali.
export const updateTaskItem = async (sessionToken, taskId, updates) =>
  sendApiRequest(`/tasks/${taskId}`, {
    method: "PATCH",
    sessionToken,
    body: updates,
  });

// questo lo richiamo quando l'utente decide di rimuovere una card che non gli serve piu'.
export const deleteTaskItem = async (sessionToken, taskId) =>
  sendApiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
    sessionToken,
  });
