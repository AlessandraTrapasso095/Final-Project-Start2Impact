// questo file mi serve per definire la forma dei task del progetto.
// lo uso per avere record omogenei e per validare in modo leggero alcuni campi base come stato e priorita'.

import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

export const taskStatuses = ["todo", "in-progress", "done"];
export const taskPriorities = ["low", "medium", "high"];

// mi serve per evitare di salvare stati inventati o scritti male.
// se il valore non e' valido torno su todo, cosi' il task parte sempre in uno stato coerente.
export const normalizeTaskStatus = (status = "todo") =>
  taskStatuses.includes(status) ? status : "todo";

// mi serve per evitare priorita' non previste.
// lo uso per tenere la UI e il backend allineati su un insieme piccolo e chiaro di opzioni.
export const normalizeTaskPriority = (priority = "medium") =>
  taskPriorities.includes(priority) ? priority : "medium";

// mi serve per creare il record task completo da salvare nel file dati.
// questo task e' gia' pronto per essere collegato a un utente proprietario e mostrato in dashboard.
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
// questo torna utile quando piu' avanti useremo patch e update parziali dalla dashboard.
export const updateTaskRecord = (task, updates = {}) => ({
  ...task,
  ...updates,
  status: normalizeTaskStatus(updates.status ?? task.status),
  priority: normalizeTaskPriority(updates.priority ?? task.priority),
  updatedAt: getUpdatedTimestamp(),
});
