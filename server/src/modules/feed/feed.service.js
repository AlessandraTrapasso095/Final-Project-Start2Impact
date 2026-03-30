// questo file mi serve per concentrare la logica della bacheca post e commenti.
// lo uso per validare i contenuti, ordinare la feed e generare notifiche quando succede qualcosa.

import { createHttpError } from "../../utils/create-http-error.js";
import { createNotificationForUser } from "../notifications/notifications.service.js";
import { addCommentToPost, createPost, findPostById, getPosts } from "./feed.repository.js";

const minimumPostTitleLength = 3;
const minimumPostContentLength = 8;
const minimumCommentLength = 2;

const sortPostsByRecentActivity = (posts) =>
  [...posts].sort((firstPost, secondPost) => secondPost.updatedAt.localeCompare(firstPost.updatedAt));

const createFeedSummary = (posts) => ({
  posts: posts.length,
  comments: posts.reduce((totalComments, post) => totalComments + post.comments.length, 0),
});

const sanitizePostInput = (payload = {}) => ({
  title: typeof payload.title === "string" ? payload.title.trim() : "",
  content: typeof payload.content === "string" ? payload.content.trim() : "",
});

const sanitizeCommentInput = (payload = {}) => ({
  message: typeof payload.message === "string" ? payload.message.trim() : "",
});

// mi serve per bloccare post troppo vuoti o poco utili da leggere in bacheca.
// cosi' mantengo la sezione contenuti ordinata e con messaggi abbastanza chiari.
const validatePostInput = (postInput) => {
  const validationErrors = [];

  if (postInput.title.length < minimumPostTitleLength) {
    validationErrors.push(
      `Il titolo del post deve contenere almeno ${minimumPostTitleLength} caratteri.`,
    );
  }

  if (postInput.content.length < minimumPostContentLength) {
    validationErrors.push(
      `Il contenuto del post deve contenere almeno ${minimumPostContentLength} caratteri.`,
    );
  }

  if (validationErrors.length > 0) {
    throw createHttpError(
      400,
      "Post non valido.",
      validationErrors,
      "Controlla titolo e contenuto prima di pubblicare.",
    );
  }
};

// mi serve per validare i commenti della bacheca.
// qui tengo una soglia minima cosi' evito messaggi vuoti o rumorosi.
const validateCommentInput = (commentInput) => {
  if (commentInput.message.length < minimumCommentLength) {
    throw createHttpError(
      400,
      "Commento non valido.",
      [`Il commento deve contenere almeno ${minimumCommentLength} caratteri.`],
      "Controlla il commento prima di pubblicarlo.",
    );
  }
};

// mi serve per restituire la bacheca ordinata per attivita' recente.
// il frontend riceve anche un riepilogo con numero di post e commenti gia' pronto da mostrare.
export const listFeedPosts = async () => {
  const posts = await getPosts();
  const sortedPosts = sortPostsByRecentActivity(posts);

  return {
    posts: sortedPosts,
    summary: createFeedSummary(sortedPosts),
  };
};

// mi serve per pubblicare un nuovo post in bacheca.
// dopo il salvataggio creo una notifica personale cosi' il pannello notifiche si aggiorna da solo.
export const createFeedPostForUser = async (user, payload) => {
  const sanitizedPostInput = sanitizePostInput(payload);

  validatePostInput(sanitizedPostInput);

  const post = await createPost({
    ownerId: user.id,
    authorName: user.name,
    title: sanitizedPostInput.title,
    content: sanitizedPostInput.content,
  });

  await createNotificationForUser(user.id, {
    type: "feed",
    title: "Post pubblicato",
    message: `Hai pubblicato "${post.title}" nella bacheca del team.`,
    link: "#bacheca",
  });

  return {
    post,
  };
};

// mi serve per aggiungere un commento a un post esistente.
// se il post appartiene a un'altra persona, mando una notifica anche al proprietario.
export const addCommentToFeedPostForUser = async (postId, user, payload) => {
  const existingPost = await findPostById(postId);

  if (!existingPost) {
    throw createHttpError(
      404,
      "Post non trovato.",
      ["Non esiste nessun post con questo id nella bacheca."],
      "Post non trovato.",
    );
  }

  const sanitizedCommentInput = sanitizeCommentInput(payload);

  validateCommentInput(sanitizedCommentInput);

  const post = await addCommentToPost(postId, {
    authorId: user.id,
    authorName: user.name,
    message: sanitizedCommentInput.message,
  });

  await createNotificationForUser(user.id, {
    type: "feed",
    title: "Commento aggiunto",
    message: `Hai commentato il post "${existingPost.title}".`,
    link: "#bacheca",
  });

  if (existingPost.ownerId !== user.id) {
    await createNotificationForUser(existingPost.ownerId, {
      type: "feed",
      title: "Nuovo commento ricevuto",
      message: `${user.name} ha commentato il tuo post "${existingPost.title}".`,
      link: "#bacheca",
    });
  }

  return {
    post,
  };
};
