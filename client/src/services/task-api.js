// questo file mi serve per tenere tutte le chiamate della task board in un posto solo.
// lo uso per lavorare con lista, creazione, modifica e cancellazione dei task senza sporcare i componenti.

import { sendApiRequest } from "./api-client.js";

// mi serve per recuperare tutta la board dell'utente autenticato.
// lo uso quando apro la dashboard o quando devo risincronizzare task e riepilogo dopo una modifica.
export const getTaskBoard = async (sessionToken) =>
  sendApiRequest("/tasks", {
    method: "GET",
    sessionToken,
  });

// mi serve per creare un task nuovo partendo dal form del frontend.
// questo manda titolo, descrizione, stato e priorita' al backend che salva il record vero.
export const createTaskItem = async (sessionToken, taskInput) =>
  sendApiRequest("/tasks", {
    method: "POST",
    sessionToken,
    body: taskInput,
  });

// mi serve per aggiornare un task esistente con patch parziali.
// lo uso per cambiare stato o priorita' senza dover rispedire ogni volta tutto il task.
export const updateTaskItem = async (sessionToken, taskId, updates) =>
  sendApiRequest(`/tasks/${taskId}`, {
    method: "PATCH",
    sessionToken,
    body: updates,
  });

// mi serve per eliminare un task dalla board.
// questo lo richiamo quando l'utente decide di rimuovere una card che non gli serve piu'.
export const deleteTaskItem = async (sessionToken, taskId) =>
  sendApiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
    sessionToken,
  });
