// lo uso per validare input, filtrare i task per utente e tenere i controller leggeri e facili da leggere.

import { createHttpError } from "../../utils/create-http-error.js";
import { createNotificationForUser } from "../notifications/notifications.service.js";
import {
  createTask,
  deleteTask,
  findTaskById,
  getTasksByOwnerId,
  updateTask,
} from "./task.repository.js";
import { taskPriorities, taskStatuses } from "./task.model.js";

const minimumTitleLength = 3;

const sortTasksByMostRecentUpdate = (tasks) =>
  [...tasks].sort((firstTask, secondTask) =>
    secondTask.updatedAt.localeCompare(firstTask.updatedAt),
  );

const createTaskSummary = (tasks) =>
  tasks.reduce(
    (summary, task) => {
      summary.total += 1;

      if (task.status === "todo") {
        summary.todo += 1;
      }

      if (task.status === "in-progress") {
        summary.inProgress += 1;
      }

      if (task.status === "done") {
        summary.done += 1;
      }

      return summary;
    },
    {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
    },
  );

const sanitizeTaskInput = (payload = {}) => ({
  title: typeof payload.title === "string" ? payload.title.trim() : "",
  description: typeof payload.description === "string" ? payload.description.trim() : "",
  status: payload.status,
  priority: payload.priority,
});

const validateCreateTaskInput = (taskInput) => {
  const validationErrors = [];

  // mi serve per non creare task vuoti o con valori non previsti.
  if (taskInput.title.length < minimumTitleLength) {
    validationErrors.push(
      `Il titolo del task deve contenere almeno ${minimumTitleLength} caratteri.`,
    );
  }

  if (taskInput.status && !taskStatuses.includes(taskInput.status)) {
    validationErrors.push("Lo stato del task non e' valido.");
  }

  if (taskInput.priority && !taskPriorities.includes(taskInput.priority)) {
    validationErrors.push("La priorita' del task non e' valida.");
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Dati task non validi.",
      validationErrors,
      "Controlla i dati del task prima di salvare.",
    );
  }
};

const validateUpdateTaskInput = (taskInput) => {
  const validationErrors = [];
  const hasKnownField =
    typeof taskInput.title === "string" ||
    typeof taskInput.description === "string" ||
    typeof taskInput.status !== "undefined" ||
    typeof taskInput.priority !== "undefined";

  // mi serve per evitare patch vuote o incoerenti.
  if (!hasKnownField) {
    validationErrors.push("Mi serve almeno un campo da aggiornare.");
  }

  if (typeof taskInput.title === "string" && taskInput.title.trim().length < minimumTitleLength) {
    validationErrors.push(
      `Se aggiorno il titolo, deve contenere almeno ${minimumTitleLength} caratteri.`,
    );
  }

  if (typeof taskInput.status !== "undefined" && !taskStatuses.includes(taskInput.status)) {
    validationErrors.push("Lo stato del task non e' valido.");
  }

  if (typeof taskInput.priority !== "undefined" && !taskPriorities.includes(taskInput.priority)) {
    validationErrors.push("La priorita' del task non e' valida.");
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Aggiornamento task non valido.",
      validationErrors,
      "Controlla i campi che stai aggiornando.",
    );
  }
};

const getOwnedTaskOrThrow = async (taskId, ownerId) => {
  const task = await findTaskById(taskId);

  if (!task || task.ownerId !== ownerId) {
    throw createHttpError(
      404,
      "Task non trovato.",
      ["Non esiste nessun task con questo id per l'utente corrente."],
      "Task non trovato.",
    );
  }

  return task;
};

// mi serve per elencare i task dell'utente autenticato in ordine utile per la dashboard.
export const listTasksForUser = async (ownerId) => {
  const ownedTasks = await getTasksByOwnerId(ownerId);
  const sortedTasks = sortTasksByMostRecentUpdate(ownedTasks);

  return {
    tasks: sortedTasks,
    summary: createTaskSummary(sortedTasks),
  };
};

// mi serve per creare un task nuovo collegandolo subito all'utente loggato.
export const createTaskForUser = async (ownerId, payload) => {
  const sanitizedTaskInput = sanitizeTaskInput(payload);

  validateCreateTaskInput(sanitizedTaskInput);

  const task = await createTask({
    ...sanitizedTaskInput,
    ownerId,
  });

  await createNotificationForUser(ownerId, {
    type: "task",
    title: "Nuovo task creato",
    message: `Il task "${task.title}" e' stato aggiunto alla board.`,
    link: "#task-board",
  });

  return task;
};

// mi serve per recuperare il dettaglio di un task singolo del proprietario corrente.
export const getTaskForUser = async (taskId, ownerId) => getOwnedTaskOrThrow(taskId, ownerId);

// mi serve per aggiornare un task esistente dopo aver verificato proprieta' e dati.
export const updateTaskForUser = async (taskId, ownerId, payload) => {
  const existingTask = await getOwnedTaskOrThrow(taskId, ownerId);

  const sanitizedTaskInput = sanitizeTaskInput(payload);
  validateUpdateTaskInput(payload);

  const task = await updateTask(taskId, sanitizedTaskInput);

  await createNotificationForUser(ownerId, {
    type: "task",
    title: "Task aggiornato",
    message: `Le informazioni del task "${task?.title || existingTask.title}" sono state aggiornate.`,
    link: "#task-board",
  });

  return task;
};

// mi serve per eliminare un task dell'utente corrente in modo sicuro.
export const deleteTaskForUser = async (taskId, ownerId) => {
  const existingTask = await getOwnedTaskOrThrow(taskId, ownerId);
  const deletedTask = await deleteTask(taskId);

  await createNotificationForUser(ownerId, {
    type: "task",
    title: "Task eliminato",
    message: `Il task "${existingTask.title}" e' stato rimosso dalla board.`,
    link: "#task-board",
  });

  return {
    deleted: Boolean(deletedTask),
    taskId,
  };
};
