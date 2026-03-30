// questo file mi serve per concentrare la logica dell'autenticazione in un solo punto.
// lo uso per validare input, gestire password hashate e creare o invalidare sessioni senza gonfiare i controller.

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getPublicUser,
} from "../users/user.repository.js";
import { createHttpError } from "../../utils/create-http-error.js";
import {
  createSession,
  deleteSessionByToken,
  findSessionByToken,
  touchSessionByToken,
} from "./session.repository.js";

const scrypt = promisify(scryptCallback);
const minimumPasswordLength = 8;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hashKeyLength = 64;
const passwordSaltSize = 16;

const plannedAuthRoutes = [
  {
    method: "GET",
    path: "/api/auth",
    description: "panoramica del modulo autenticazione",
  },
  {
    method: "POST",
    path: "/api/auth/register",
    description: "registrazione di un nuovo utente",
  },
  {
    method: "POST",
    path: "/api/auth/login",
    description: "login con email e password",
  },
  {
    method: "POST",
    path: "/api/auth/logout",
    description: "chiusura della sessione utente",
  },
  {
    method: "GET",
    path: "/api/auth/session",
    description: "recupero della sessione corrente",
  },
];

const buildAuthPayload = (user, session) => ({
  user: getPublicUser(user),
  session: {
    token: session.token,
    createdAt: session.createdAt,
    lastUsedAt: session.lastUsedAt,
  },
});

const validateRegisterInput = ({ name, email, password }) => {
  const validationErrors = [];

  // mi serve per fermare subito richieste con campi vuoti o troppo deboli.
  // questo aiuta sia noi sia il frontend a dare feedback chiari prima di salvare dati sporchi.
  if (typeof name !== "string" || name.trim().length < 2) {
    validationErrors.push("Il nome deve contenere almeno 2 caratteri.");
  }

  if (typeof email !== "string" || !emailPattern.test(email.trim().toLowerCase())) {
    validationErrors.push("Inserisci un'email valida.");
  }

  if (typeof password !== "string" || password.length < minimumPasswordLength) {
    validationErrors.push(
      `La password deve contenere almeno ${minimumPasswordLength} caratteri.`,
    );
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Dati registrazione non validi.",
      validationErrors,
      "Controlla i dati inseriti per la registrazione.",
    );
  }
};

const validateLoginInput = ({ email, password }) => {
  const validationErrors = [];

  // mi serve per bloccare richieste login chiaramente incomplete.
  // cosi' evitiamo query inutili e teniamo il flusso auth piu' ordinato.
  if (typeof email !== "string" || !email.trim()) {
    validationErrors.push("L'email e' obbligatoria.");
  }

  if (typeof password !== "string" || !password.trim()) {
    validationErrors.push("La password e' obbligatoria.");
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Dati login non validi.",
      validationErrors,
      "Controlla email e password prima di riprovare.",
    );
  }
};

const hashPassword = async (password) => {
  const salt = randomBytes(passwordSaltSize).toString("hex");
  const derivedKey = await scrypt(password, salt, hashKeyLength);

  // mi serve per salvare insieme sale e hash in una singola stringa facile da rileggere.
  // questo formato ci basta per una persistenza locale semplice ma gia' sicura per il progetto.
  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
};

const verifyPassword = async (password, storedPasswordHash) => {
  const [salt, storedDerivedKey] = String(storedPasswordHash).split(":");

  if (!salt || !storedDerivedKey) {
    return false;
  }

  const currentDerivedKey = await scrypt(password, salt, hashKeyLength);
  const currentBuffer = Buffer.from(currentDerivedKey);
  const storedBuffer = Buffer.from(storedDerivedKey, "hex");

  if (currentBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(currentBuffer, storedBuffer);
};

const getActiveSessionContext = async (sessionToken) => {
  if (!sessionToken) {
    throw createHttpError(
      401,
      "Token di sessione mancante.",
      [
        "Invia il token con Authorization: Bearer <token> oppure con l'header x-session-token.",
      ],
      "Sessione non trovata.",
    );
  }

  const existingSession = await findSessionByToken(sessionToken);

  if (!existingSession) {
    throw createHttpError(
      401,
      "Sessione non valida.",
      ["Il token inviato non corrisponde a nessuna sessione attiva."],
      "Sessione non valida o scaduta.",
    );
  }

  const user = await findUserById(existingSession.userId);

  if (!user) {
    await deleteSessionByToken(sessionToken);

    throw createHttpError(
      401,
      "Utente della sessione non trovato.",
      ["La sessione puntava a un utente non piu' presente nel database locale."],
      "Sessione non valida o scaduta.",
    );
  }

  const touchedSession = await touchSessionByToken(sessionToken);

  return {
    user,
    session: touchedSession || existingSession,
  };
};

// mi serve per restituire un piccolo riepilogo del modulo auth.
// qui adesso mostro anche come passare il token di sessione alle rotte protette.
export const getAuthModuleInfo = () => ({
  moduleName: "auth",
  status: "ready",
  tokenTransport: ["Authorization: Bearer <token>", "x-session-token: <token>"],
  plannedRoutes: plannedAuthRoutes,
});

// mi serve per registrare un utente nuovo e loggarlo subito nella prima sessione.
// questo evita un passaggio inutile dopo la registrazione e semplifica molto l'esperienza utente.
export const registerUser = async ({ name, email, password }) => {
  validateRegisterInput({ name, email, password });

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw createHttpError(
      409,
      "Email gia' registrata.",
      ["Esiste gia' un account con questa email."],
      "Questa email e' gia' in uso.",
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name, email, passwordHash });
  const session = await createSession(user.id);

  return buildAuthPayload(user, session);
};

// mi serve per verificare le credenziali in ingresso e aprire una nuova sessione.
// questo crea un nuovo token ogni volta che il login va a buon fine.
export const loginUser = async ({ email, password }) => {
  validateLoginInput({ email, password });

  const user = await findUserByEmail(email);

  if (!user) {
    throw createHttpError(
      401,
      "Credenziali non valide.",
      ["Email o password non corrette."],
      "Email o password non corrette.",
    );
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw createHttpError(
      401,
      "Credenziali non valide.",
      ["Email o password non corrette."],
      "Email o password non corrette.",
    );
  }

  const session = await createSession(user.id);

  return buildAuthPayload(user, session);
};

// mi serve per recuperare l'utente loggato partendo dal token ricevuto nella richiesta.
// lo uso per la rotta session e piu' avanti anche per proteggere dashboard e task.
export const getCurrentSession = async (sessionToken) => {
  const activeSessionContext = await getActiveSessionContext(sessionToken);

  return buildAuthPayload(activeSessionContext.user, activeSessionContext.session);
};

// mi serve per riusare la stessa verifica auth anche fuori dal controller del modulo auth.
// lo uso nel middleware delle rotte protette cosi' tasks e moduli futuri non duplicano la logica di sessione.
export const getAuthenticatedContext = async (sessionToken) =>
  getActiveSessionContext(sessionToken);

// mi serve per invalidare la sessione corrente quando l'utente fa logout.
// questo cancella il token dal file dati e conferma al client che la sessione non e' piu' attiva.
export const logoutUser = async (sessionToken) => {
  if (!sessionToken) {
    throw createHttpError(
      401,
      "Token di sessione mancante.",
      [
        "Per fare logout invia il token con Authorization: Bearer <token>, x-session-token o nel body come sessionToken.",
      ],
      "Sessione non trovata.",
    );
  }

  const deletedSession = await deleteSessionByToken(sessionToken);

  if (!deletedSession) {
    throw createHttpError(
      401,
      "Sessione non valida.",
      ["Il token inviato non corrisponde a nessuna sessione attiva."],
      "Sessione non valida o gia' chiusa.",
    );
  }

  return {
    loggedOut: true,
    tokenRevoked: true,
  };
};
