// questo file mi serve per leggere e salvare il token di sessione in un punto solo.

const sessionStorageKey = "taskflow-studio-session-token";

const canUseBrowserStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// mi serve per recuperare il token salvato quando riapro o aggiorno la pagina.
export const getStoredSessionToken = () => {
  if (!canUseBrowserStorage()) {
    return "";
  }

  return window.localStorage.getItem(sessionStorageKey) || "";
};

// lo uso per poter recuperare la sessione al refresh della pagina.
export const storeSessionToken = (sessionToken) => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(sessionStorageKey, sessionToken);
};

// mi serve per cancellare il token quando la sessione non e' piu' valida o quando faccio logout.
export const clearStoredSessionToken = () => {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.removeItem(sessionStorageKey);
};
