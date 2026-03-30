// questo file mi serve per centralizzare le chiamate della bacheca post e commenti.

import { sendApiRequest } from "./api-client.js";

// lo uso quando apro la dashboard o quando voglio risincronizzare i contenuti recenti.
export const getWorkspaceFeed = async (sessionToken) =>
  sendApiRequest("/feed", {
    method: "GET",
    sessionToken,
  });

// mi serve per pubblicare un post nuovo.
export const createFeedPost = async (sessionToken, postInput) =>
  sendApiRequest("/feed/posts", {
    method: "POST",
    sessionToken,
    body: postInput,
  });

// mi serve per aggiungere un commento a un post gia' esistente.
export const addCommentToFeedPost = async (sessionToken, postId, commentInput) =>
  sendApiRequest(`/feed/posts/${postId}/comments`, {
    method: "POST",
    sessionToken,
    body: commentInput,
  });
