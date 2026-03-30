// questo file mi serve per isolare le operazioni di lettura e scrittura dei task.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import { createTaskRecord, updateTaskRecord } from "./task.model.js";

// mi serve per recuperare tutti i task salvati nel file dati.
export const getTasks = async () => {
  const database = await readDatabase();

  return database.tasks;
};

// mi serve per recuperare solo i task di un utente specifico.
export const getTasksByOwnerId = async (ownerId) => {
  const tasks = await getTasks();

  return tasks.filter((task) => task.ownerId === ownerId);
};

// mi serve per cercare un task con il suo id.
export const findTaskById = async (taskId) => {
  const tasks = await getTasks();

  return tasks.find((task) => task.id === taskId) || null;
};

// mi serve per creare un task nuovo e salvarlo nella collezione corretta.
export const createTask = async (taskData) => {
  const nextTask = createTaskRecord(taskData);

  await updateDatabase((database) => {
    database.tasks.push(nextTask);
    return database;
  });

  return nextTask;
};

// mi serve per aggiornare un task gia' esistente in modo parziale.
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
