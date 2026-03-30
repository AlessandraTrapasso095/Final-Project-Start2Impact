// questo file mi serve per definire la forma di post e commenti della bacheca.
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
// tengo dentro anche il nome autore, cosi' il frontend non deve inseguire altri dati per mostrarlo.
export const createPostRecord = ({ ownerId, authorName, title, content }) => ({
  ...createRecordMeta(),
  ownerId,
  authorName: String(authorName).trim(),
  title: String(title).trim(),
  content: String(content).trim(),
  comments: [],
});

// mi serve per aggiungere un commento a un post esistente.
// qui aggiorno anche il timestamp del post, cosi' la bacheca puo' riordinare i contenuti recenti.
export const addCommentToPostRecord = (post, commentData) => ({
  ...post,
  comments: [...post.comments, createCommentRecord(commentData)],
  updatedAt: getUpdatedTimestamp(),
});
