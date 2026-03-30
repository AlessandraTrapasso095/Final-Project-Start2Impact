// questo file mi serve per gestire la persistenza della bacheca post e commenti.

import { readDatabase, updateDatabase } from "../../services/file-database.service.js";
import { addCommentToPostRecord, createPostRecord } from "./feed.model.js";

// mi serve per leggere tutti i post della bacheca.
export const getPosts = async () => {
  const database = await readDatabase();

  return database.posts;
};

// mi serve per trovare un post dal suo id.
export const findPostById = async (postId) => {
  const posts = await getPosts();

  return posts.find((post) => post.id === postId) || null;
};

// mi serve per creare un post nuovo.
export const createPost = async (postData) => {
  const nextPost = createPostRecord(postData);

  await updateDatabase((database) => {
    database.posts.push(nextPost);
    return database;
  });

  return nextPost;
};

// mi serve per aggiungere un commento a un post esistente.
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
