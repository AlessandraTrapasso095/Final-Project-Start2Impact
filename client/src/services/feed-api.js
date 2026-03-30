// questo file mi serve per centralizzare le chiamate della bacheca post e commenti.
// lo uso per restare DRY tra caricamento feed, creazione post e invio commenti.

import { sendApiRequest } from "./api-client.js";

// mi serve per recuperare tutta la bacheca del team.
// lo uso quando apro la dashboard o quando voglio risincronizzare i contenuti recenti.
export const getWorkspaceFeed = async (sessionToken) =>
  sendApiRequest("/feed", {
    method: "GET",
    sessionToken,
  });

// mi serve per pubblicare un post nuovo.
// mando titolo e contenuto cosi' il backend crea il record e genera anche la notifica.
export const createFeedPost = async (sessionToken, postInput) =>
  sendApiRequest("/feed/posts", {
    method: "POST",
    sessionToken,
    body: postInput,
  });

// mi serve per aggiungere un commento a un post gia' esistente.
// lo uso per completare il flusso bacheca direttamente dal frontend.
export const addCommentToFeedPost = async (sessionToken, postId, commentInput) =>
  sendApiRequest(`/feed/posts/${postId}/comments`, {
    method: "POST",
    sessionToken,
    body: commentInput,
  });
