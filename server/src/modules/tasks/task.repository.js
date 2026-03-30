// questo file mi serve per isolare le operazioni di lettura e scrittura dei task.
// lo uso per mantenere semplice il codice dei controller e lasciare qui la parte di persistenza.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import { createTaskRecord, updateTaskRecord } from "./task.model.js";

// mi serve per recuperare tutti i task salvati nel file dati.
// lo uso come base sia per la dashboard generale sia per i filtri futuri per utente.
export const getTasks = async () => {
  const database = await readDatabase();

  return database.tasks;
};

// mi serve per recuperare solo i task di un utente specifico.
// lo uso per mostrare a ogni persona solo la sua task board invece di tutta la collezione salvata.
export const getTasksByOwnerId = async (ownerId) => {
  const tasks = await getTasks();

  return tasks.filter((task) => task.ownerId === ownerId);
};

// mi serve per cercare un task con il suo id.
// questo ci servira' quando faremo update, delete e cambio stato.
export const findTaskById = async (taskId) => {
  const tasks = await getTasks();

  return tasks.find((task) => task.id === taskId) || null;
};

// mi serve per creare un task nuovo e salvarlo nella collezione corretta.
// questo sfrutta il modello task per produrre sempre un record con la stessa forma.
export const createTask = async (taskData) => {
  const nextTask = createTaskRecord(taskData);

  await updateDatabase((database) => {
    database.tasks.push(nextTask);
    return database;
  });

  return nextTask;
};

// mi serve per aggiornare un task gia' esistente in modo parziale.
// lo uso per centralizzare la logica di merge senza doverla riscrivere ogni volta.
export const updateTask = async (taskId, updates) => {
  let updatedTask = null;

  await updateDatabase((database) => {
    database.tasks = database.tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      updatedTask = updateTaskRecord(task, updates);
      return updatedTask;
    });

    return database;
  });

  return updatedTask;
};

// mi serve per eliminare un task gia' esistente.
// questo torna utile quando chiudo una card dal frontend e voglio pulire davvero il record nel file dati.
export const deleteTask = async (taskId) => {
  let deletedTask = null;

  await updateDatabase((database) => {
    database.tasks = database.tasks.filter((task) => {
      if (task.id !== taskId) {
        return true;
      }

      deletedTask = task;
      return false;
    });

    return database;
  });

  return deletedTask;
};
