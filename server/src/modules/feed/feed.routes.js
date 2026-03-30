// questo file mi serve per montare le rotte della bacheca post e commenti.
// lo uso per tenere insieme feed, pubblicazione e commenti sotto la stessa protezione auth.

import { Router } from "express";
import { requireAuth } from "../../middleware/require-auth.js";
import {
  addCommentToFeedPostController,
  createFeedPostController,
  listFeedPostsController,
} from "./feed.controller.js";

const feedRouter = Router();

// mi serve per proteggere tutta la bacheca con la sessione utente.
feedRouter.use(requireAuth);

// mi serve per leggere la lista dei post.
feedRouter.get("/", listFeedPostsController);

// mi serve per creare un nuovo post.
feedRouter.post("/posts", createFeedPostController);

// mi serve per commentare un post esistente.
feedRouter.post("/posts/:postId/comments", addCommentToFeedPostController);

export default feedRouter;
