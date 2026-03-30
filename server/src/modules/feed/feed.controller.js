// questo file mi serve per gestire le risposte HTTP del modulo bacheca.
// lo uso per collegare lista, pubblicazione e commenti ai service senza appesantire le rotte.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  addCommentToFeedPostForUser,
  createFeedPostForUser,
  listFeedPosts,
} from "./feed.service.js";

// mi serve per restituire la lista dei post della bacheca.
// la uso quando apro la dashboard o ricarico manualmente la sezione contenuti.
export const listFeedPostsController = async (request, response) => {
  const feedPayload = await listFeedPosts();

  response.status(200).json(createSuccessResponse("Bacheca recuperata correttamente.", feedPayload));
};

// mi serve per pubblicare un post nuovo.
// il service si occupa di validare e creare anche la notifica relativa.
export const createFeedPostController = async (request, response) => {
  const feedPayload = await createFeedPostForUser(request.auth.user, request.body);

  response.status(201).json(createSuccessResponse("Post pubblicato correttamente.", feedPayload));
};

// mi serve per aggiungere un commento a un post esistente.
// questa rotta completa il flusso di interazione base della bacheca.
export const addCommentToFeedPostController = async (request, response) => {
  const feedPayload = await addCommentToFeedPostForUser(
    request.params.postId,
    request.auth.user,
    request.body,
  );

  response.status(201).json(createSuccessResponse("Commento pubblicato correttamente.", feedPayload));
};
