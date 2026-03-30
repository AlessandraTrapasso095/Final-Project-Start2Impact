// questo file mi serve per mostrare la bacheca con post e commenti del team.
// lo uso per caricare i contenuti, pubblicare nuovi messaggi e commentare senza mescolare tutto nella task board.

import { startTransition, useEffect, useState } from "react";
import {
  addCommentToFeedPost,
  createFeedPost,
  getWorkspaceFeed,
} from "../../services/feed-api.js";
import FormField from "../forms/FormField.jsx";
import Button from "../ui/Button.jsx";
import FeedbackPanel from "../ui/FeedbackPanel.jsx";
import LoadingRing from "../ui/LoadingRing.jsx";
import SurfaceCard from "../ui/SurfaceCard.jsx";

const initialPostDraft = {
  title: "",
  content: "",
};

const emptyFeedData = {
  posts: [],
  summary: {
    posts: 0,
    comments: 0,
  },
};

const createFeedFeedback = (message = "", tone = "neutral", details = []) => ({
  tone,
  message,
  details,
});

const formatFeedDate = (value) =>
  new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

// mi serve per gestire la bacheca del workspace.
// qui tengo insieme caricamento iniziale, pubblicazione di post e commenti ai contenuti esistenti.
function FeedPanel({ user, session, onSessionExpired, onActivity }) {
  const [feedData, setFeedData] = useState(emptyFeedData);
  const [postDraft, setPostDraft] = useState(initialPostDraft);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [feedback, setFeedback] = useState(createFeedFeedback("Sto caricando la bacheca...", "neutral"));
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [isPublishingPost, setIsPublishingPost] = useState(false);
  const [pendingPostId, setPendingPostId] = useState("");
  const shouldShowFeedFeedback = isLoadingFeed || feedback.tone === "warning";

  const loadFeed = async (successMessage = "") => {
    try {
      const nextFeedData = await getWorkspaceFeed(session.token);

      startTransition(() => {
        setFeedData(nextFeedData);
      });

      setFeedback(
        createFeedFeedback(
          successMessage ||
            (nextFeedData.posts.length > 0
              ? "Bacheca sincronizzata. Vedo gli ultimi contenuti pubblicati dal team."
              : "Bacheca pronta. Posso iniziare pubblicando il primo aggiornamento."),
          successMessage ? "success" : "neutral",
        ),
      );

      return nextFeedData;
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return null;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a caricare la bacheca.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
      return null;
    } finally {
      setIsLoadingFeed(false);
    }
  };

  useEffect(() => {
    setIsLoadingFeed(true);
    loadFeed();
  }, [session.token]);

  const handlePostFieldChange = (event) => {
    const { name, value } = event.target;

    setPostDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  };

  const handleCommentDraftChange = (postId, value) => {
    setCommentDrafts((currentDrafts) => ({
      ...currentDrafts,
      [postId]: value,
    }));
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();

    if (postDraft.title.trim().length < 3 || postDraft.content.trim().length < 8) {
      setFeedback(
        createFeedFeedback(
          "Per pubblicare un post mi servono un titolo chiaro e un contenuto di almeno 8 caratteri.",
          "warning",
        ),
      );
      return;
    }

    setIsPublishingPost(true);
    setFeedback(createFeedFeedback("Sto pubblicando il post...", "neutral"));

    try {
      await createFeedPost(session.token, postDraft);
      await loadFeed("Post pubblicato. La bacheca e' stata aggiornata.");
      setPostDraft(initialPostDraft);
      onActivity();
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a pubblicare il post.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setIsPublishingPost(false);
    }
  };

  const handleCreateComment = async (postId) => {
    const commentMessage = commentDrafts[postId]?.trim() || "";

    if (commentMessage.length < 2) {
      setFeedback(createFeedFeedback("Per commentare mi servono almeno 2 caratteri.", "warning"));
      return;
    }

    setPendingPostId(postId);
    setFeedback(createFeedFeedback("Sto pubblicando il commento...", "neutral"));

    try {
      await addCommentToFeedPost(session.token, postId, { message: commentMessage });
      await loadFeed("Commento pubblicato. La bacheca e' stata aggiornata.");
      setCommentDrafts((currentDrafts) => ({
        ...currentDrafts,
        [postId]: "",
      }));
      onActivity();
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a pubblicare il commento.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setPendingPostId("");
    }
  };

  return (
    <SurfaceCard
      eyebrow="Bacheca"
      title="Bacheca"
      className="workspace-panel"
    >
      <div className="feed-panel" id="bacheca">
        <div className="feed-panel__summary">
          <div>
            <strong>{feedData.summary.posts}</strong>
            <span>Post</span>
          </div>
          <div>
            <strong>{feedData.summary.comments}</strong>
            <span>Commenti</span>
          </div>
        </div>

        <form className="workspace-form feed-panel__composer" onSubmit={handleCreatePost}>
          <div className="workspace-form__grid">
            <FormField
              label="Titolo"
              name="title"
              value={postDraft.title}
              onChange={handlePostFieldChange}
              placeholder="Per esempio: Aggiornamento presentazione finale"
            />

            <FormField
              as="textarea"
              label="Messaggio"
              name="content"
              value={postDraft.content}
              onChange={handlePostFieldChange}
              placeholder={`Scrivo qui un aggiornamento per ${user.name} e per il resto del team...`}
              rows={4}
            />
          </div>

          <Button type="submit" size="large" disabled={isPublishingPost}>
            {isPublishingPost ? "Sto pubblicando..." : "Pubblica post"}
          </Button>
        </form>

        {shouldShowFeedFeedback ? (
          <FeedbackPanel
            tone={feedback.tone}
            message={feedback.message}
            details={feedback.details}
            isLoading={isLoadingFeed}
            loadingLabel="Sto caricando la bacheca..."
          />
        ) : null}

        {isLoadingFeed ? (
          <LoadingRing label="Sto preparando i post del team..." />
        ) : feedData.posts.length > 0 ? (
          <div className="feed-panel__list">
            {feedData.posts.map((post) => (
              <article className="feed-post" key={post.id}>
                <div className="feed-post__head">
                  <div>
                    <h3>{post.title}</h3>
                    <p>
                      {post.authorName} · {formatFeedDate(post.updatedAt)}
                    </p>
                  </div>
                </div>

                <p className="feed-post__content">{post.content}</p>

                <div className="feed-post__comments">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div className="feed-post__comment" key={comment.id}>
                        <strong>{comment.authorName}</strong>
                        <span>{formatFeedDate(comment.createdAt)}</span>
                        <p>{comment.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="feed-post__empty">
                      <p>Nessun commento per ora.</p>
                    </div>
                  )}
                </div>

                <div className="feed-post__composer">
                  <FormField
                    label="Commento"
                    name={`comment-${post.id}`}
                    value={commentDrafts[post.id] || ""}
                    onChange={(event) => handleCommentDraftChange(post.id, event.target.value)}
                    placeholder="Scrivo un commento veloce..."
                  />

                  <Button
                    variant="secondary"
                    onClick={() => handleCreateComment(post.id)}
                    disabled={pendingPostId === post.id}
                  >
                    {pendingPostId === post.id ? "Sto pubblicando..." : "Commenta"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="feed-post__empty">
            <p>Non ci sono ancora post pubblicati.</p>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}

export default FeedPanel;
