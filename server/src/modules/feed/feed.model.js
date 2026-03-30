// lo uso per salvare record ordinati e per aggiungere commenti senza rifare ogni volta la stessa struttura.

import { randomUUID } from "node:crypto";
import { createRecordMeta, getUpdatedTimestamp } from "../../utils/create-record-meta.js";

const createCommentRecord = ({ authorId, authorName, message }) => {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    authorId,
    authorName: String(authorName).trim(),
    message: String(message).trim(),
  };
};

// mi serve per creare un post nuovo nella bacheca del workspace.
export const createPostRecord = ({ ownerId, authorName, title, content }) => ({
  ...createRecordMeta(),
  ownerId,
  authorName: String(authorName).trim(),
  title: String(title).trim(),
  content: String(content).trim(),
  comments: [],
});

// mi serve per aggiungere un commento a un post esistente.
export const addCommentToPostRecord = (post, commentData) => ({
  ...post,
  comments: [...post.comments, createCommentRecord(commentData)],
  updatedAt: getUpdatedTimestamp(),
});
