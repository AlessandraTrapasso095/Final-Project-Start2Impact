// questo file mi serve per gestire la persistenza della bacheca post e commenti.
// lo uso per tenere la logica di file system fuori dal service della feed area.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import { addCommentToPostRecord, createPostRecord } from "./feed.model.js";

// mi serve per leggere tutti i post della bacheca.
// lo uso come base sia per la lista sia per i commenti.
export const getPosts = async () => {
  const database = await readDatabase();

  return database.posts;
};

// mi serve per trovare un post dal suo id.
// torna utile quando commento oppure controllo se il contenuto esiste davvero.
export const findPostById = async (postId) => {
  const posts = await getPosts();

  return posts.find((post) => post.id === postId) || null;
};

// mi serve per creare un post nuovo.
// il record viene costruito dal model e poi salvato nella collezione posts.
export const createPost = async (postData) => {
  const nextPost = createPostRecord(postData);

  await updateDatabase((database) => {
    database.posts.push(nextPost);
    return database;
  });

  return nextPost;
};

// mi serve per aggiungere un commento a un post esistente.
// restituisco il post aggiornato cosi' il service lo puo' usare subito nel payload finale.
export const addCommentToPost = async (postId, commentData) => {
  let updatedPost = null;

  await updateDatabase((database) => {
    database.posts = database.posts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      updatedPost = addCommentToPostRecord(post, commentData);
      return updatedPost;
    });

    return database;
  });

  return updatedPost;
};
