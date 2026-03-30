// questo file mi serve per definire la forma dei task del progetto.

import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

export const taskStatuses = ["todo", "in-progress", "done"];
export const taskPriorities = ["low", "medium", "high"];

// se il valore non e' valido torno su todo, cosi' il task parte sempre 
export const normalizeTaskStatus = (status = "todo") =>
  taskStatuses.includes(status) ? status : "todo";

// lo uso per tenere la UI e il backend allineati su un insieme di opzioni.
export const normalizeTaskPriority = (priority = "medium") =>
  taskPriorities.includes(priority) ? priority : "medium";

// mi serve per creare il record task completo da salvare nel file dati.
export const createTaskRecord = ({
  title,
  description = "",
  ownerId,
  status = "todo",
  priority = "medium",
}) => ({
  ...createRecordMeta(),
  title: String(title).trim(),
  description: String(description).trim(),
  ownerId,
  status: normalizeTaskStatus(status),
  priority: normalizeTaskPriority(priority),
});

// mi serve per aggiornare un task lasciando intatti i campi non toccati.
export const updateTaskRecord = (task, updates = {}) => ({
  ...task,
  ...updates,
  status: normalizeTaskStatus(updates.status ?? task.status),
  priority: normalizeTaskPriority(updates.priority ?? task.priority),
  updatedAt: getUpdatedTimestamp(),
});
