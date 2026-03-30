// questo file mi serve per leggere e salvare il token di sessione in un punto solo.
// lo uso per restare DRY e non riscrivere la stessa logica di localStorage in tutti i componenti.

const sessionStorageKey = "taskflow-studio-session-token";

const canUseBrowserStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// mi serve per recuperare il token salvato quando riapro o aggiorno la pagina.
// questo mi evita di chiedere il login ogni volta se la sessione e' ancora valida nel backend.
export const getStoredSessionToken = () => {
  if (!canUseBrowserStorage()) {
    return "";
  }

  return window.localStorage.getItem(sessionStorageKey) || "";
};

// mi serve per salvare il token appena registro o faccio login.
// lo uso per poter recuperare la sessione al refresh della pagina.
export const storeSessionToken = (sessionToken) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(sessionStorageKey, sessionToken);
};

// mi serve per cancellare il token quando la sessione non e' piu' valida o quando faccio logout.
// cosi' tengo frontend e backend allineati senza lasciare token vecchi in memoria.
export const clearStoredSessionToken = () => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(sessionStorageKey);
};
