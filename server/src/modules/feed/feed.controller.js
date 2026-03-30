// questo file mi serve per gestire le risposte HTTP del modulo bacheca.

import { createSuccessResponse } from "../../utils/create-api-response.js";
import {
  addCommentToFeedPostForUser,
  createFeedPostForUser,
  listFeedPosts,
} from "./feed.service.js";

// mi serve per restituire la lista dei post della bacheca.
export const listFeedPostsController = async (request, response) => {
  const feedPayload = await listFeedPosts();

  response.status(200).json(createSuccessResponse("Bacheca recuperata correttamente.", feedPayload));
};

// mi serve per pubblicare un post nuovo.
export const createFeedPostController = async (request, response) => {
  const feedPayload = await createFeedPostForUser(request.auth.user, request.body);

  response.status(201).json(createSuccessResponse("Post pubblicato correttamente.", feedPayload));
};

// mi serve per aggiungere un commento a un post esistente.
export const addCommentToFeedPostController = async (request, response) => {
  const feedPayload = await addCommentToFeedPostForUser(
    request.params.postId,
    request.auth.user,
    request.body,
  );

  response.status(201).json(createSuccessResponse("Commento pubblicato correttamente.", feedPayload));
};
