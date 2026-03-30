// questo file mi serve per leggere e scrivere il file dati locale in modo centralizzato.
// lo uso per restare DRY e non spargere logica di file system dentro i moduli users e tasks.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { storageDirectoryPath, storageFilePath } from "../config/data-paths.js";

const storageFileHeader = [
  "// questo file mi serve per salvare i dati locali del progetto senza usare ancora un database esterno.",
  "// lo uso per tenere utenti, task, sessioni, post e notifiche in un solo posto semplice da leggere mentre costruiamo l'app.",
].join("\n");

// mi serve per creare sempre una struttura iniziale coerente se il file e' vuoto o manca.
// questo ci da' subito le tre collezioni principali che useremo nei prossimi step.
export const createEmptyDatabase = () => ({
  meta: {
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  users: [],
  tasks: [],
  sessions: [],
  posts: [],
  notifications: [],
});

const removeJsoncComments = (fileContent) =>
  fileContent
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n")
    .trim();

const serializeDatabase = (database) =>
  `${storageFileHeader}\n${JSON.stringify(database, null, 2)}\n`;

// mi serve per essere sicuro che la cartella e il file dati esistano sempre.
// lo uso come primo passaggio di sicurezza prima di qualsiasi lettura o scrittura.
export const ensureDatabaseFile = async () => {
  await mkdir(storageDirectoryPath, { recursive: true });

  try {
    await readFile(storageFilePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(storageFilePath, serializeDatabase(createEmptyDatabase()), "utf8");
  }
};

// mi serve per leggere i dati dal file e trasformarli in un oggetto JavaScript pronto da usare.
// questo pulisce i commenti del file jsonc e si occupa anche di completare eventuali chiavi mancanti.
export const readDatabase = async () => {
  await ensureDatabaseFile();

  const fileContent = await readFile(storageFilePath, "utf8");
  const sanitizedContent = removeJsoncComments(fileContent);
  const parsedDatabase = sanitizedContent ? JSON.parse(sanitizedContent) : createEmptyDatabase();

  return {
    meta: {
      version: parsedDatabase.meta?.version ?? 1,
      createdAt: parsedDatabase.meta?.createdAt ?? new Date().toISOString(),
      updatedAt: parsedDatabase.meta?.updatedAt ?? new Date().toISOString(),
    },
    users: Array.isArray(parsedDatabase.users) ? parsedDatabase.users : [],
    tasks: Array.isArray(parsedDatabase.tasks) ? parsedDatabase.tasks : [],
    sessions: Array.isArray(parsedDatabase.sessions) ? parsedDatabase.sessions : [],
    posts: Array.isArray(parsedDatabase.posts) ? parsedDatabase.posts : [],
    notifications: Array.isArray(parsedDatabase.notifications) ? parsedDatabase.notifications : [],
  };
};

// mi serve per salvare tutto il database in un colpo solo.
// lo uso quando ho gia' il nuovo stato completo e voglio scriverlo in modo pulito nel file.
export const writeDatabase = async (database) => {
  const nextDatabase = {
    ...database,
    meta: {
      ...database.meta,
      version: database.meta?.version ?? 1,
      updatedAt: new Date().toISOString(),
      createdAt: database.meta?.createdAt ?? new Date().toISOString(),
    },
  };

  await ensureDatabaseFile();
  await writeFile(storageFilePath, serializeDatabase(nextDatabase), "utf8");

  return nextDatabase;
};

// mi serve per aggiornare il database partendo sempre dall'ultima versione salvata.
// questo riceve una funzione updater cosi' i repository possono cambiare solo quello che serve.
export const updateDatabase = async (updater) => {
  const currentDatabase = await readDatabase();
  const nextDatabase = await updater(structuredClone(currentDatabase));

  return writeDatabase(nextDatabase);
};

// mi serve per avere un riepilogo veloce dello storage durante i test manuali.
// lo uso per controllare numero di utenti, task e sessioni senza aprire il file a mano ogni volta.
export const getDatabaseSummary = async () => {
  const database = await readDatabase();

  return {
    storageFilePath,
    usersCount: database.users.length,
    tasksCount: database.tasks.length,
    sessionsCount: database.sessions.length,
    postsCount: database.posts.length,
    notificationsCount: database.notifications.length,
    version: database.meta.version,
    updatedAt: database.meta.updatedAt,
  };
};
