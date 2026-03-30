// questo file mi serve per mostrare il centro notifiche del workspace.
// lo uso per leggere gli eventi generati da task, profilo e bacheca e per segnare le voci come lette.

import { useEffect, useState } from "react";
import {
  getWorkspaceNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notifications-api.js";
import Button from "../ui/Button.jsx";
import FeedbackPanel from "../ui/FeedbackPanel.jsx";
import LoadingRing from "../ui/LoadingRing.jsx";
import StatusPill from "../ui/StatusPill.jsx";
import SurfaceCard from "../ui/SurfaceCard.jsx";

const createNotificationsFeedback = (message = "", tone = "neutral", details = []) => ({
  tone,
  message,
  details,
});

const notificationToneMap = {
  info: "neutral",
  task: "warning",
  profile: "success",
  feed: "neutral",
};

const notificationLabelMap = {
  info: "Info",
  task: "Task",
  profile: "Profilo",
  feed: "Bacheca",
};

const formatNotificationDate = (value) =>
  new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

// mi serve per gestire il pannello notifiche della sidebar.
// qui rileggo i dati quando cambiano le attivita' del workspace e tengo semplice il flusso di lettura.
function NotificationsPanel({ session, refreshSignal, onSessionExpired }) {
  const [notificationsData, setNotificationsData] = useState({
    notifications: [],
    summary: {
      total: 0,
      unread: 0,
      read: 0,
    },
  });
  const [feedback, setFeedback] = useState(createNotificationsFeedback());
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [pendingNotificationId, setPendingNotificationId] = useState("");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  const loadNotifications = async () => {
    try {
      const nextNotificationsData = await getWorkspaceNotifications(session.token);
      setNotificationsData(nextNotificationsData);

      if (nextNotificationsData.summary.unread > 0) {
        setFeedback(
          createNotificationsFeedback(
            `Hai ${nextNotificationsData.summary.unread} notifiche da leggere.`,
            "neutral",
          ),
        );
      } else {
        setFeedback(createNotificationsFeedback("Tutte le notifiche sono gia' lette.", "success"));
      }
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a caricare le notifiche.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  useEffect(() => {
    setIsLoadingNotifications(true);
    loadNotifications();
  }, [refreshSignal, session.token]);

  const handleMarkAsRead = async (notificationId) => {
    setPendingNotificationId(notificationId);

    try {
      await markNotificationAsRead(session.token, notificationId);
      await loadNotifications();
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita ad aggiornare la notifica.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setPendingNotificationId("");
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);

    try {
      await markAllNotificationsAsRead(session.token);
      await loadNotifications();
    } catch (error) {
      if (error?.statusCode === 401) {
        onSessionExpired(error.message);
        return;
      }

      setFeedback({
        tone: "warning",
        message: error instanceof Error ? error.message : "Non sono riuscita a segnare tutto come letto.",
        details: Array.isArray(error?.details) ? error.details : [],
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <SurfaceCard
      title="Centro notifiche"
      className="workspace-panel workspace-panel--sidebar"
    >
      <div className="notifications-panel" id="notifiche">
        <div className="notifications-panel__summary">
          <div>
            <strong>{notificationsData.summary.unread}</strong>
            <span>Da leggere</span>
          </div>
          <div>
            <strong>{notificationsData.summary.total}</strong>
            <span>Totali</span>
          </div>
        </div>

        <Button
          variant="ghost"
          className="notifications-panel__mark-all"
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAll || notificationsData.summary.unread === 0}
        >
          {isMarkingAll ? "Sto aggiornando..." : "Segna tutte come lette"}
        </Button>

        {feedback.tone === "warning" ? (
          <FeedbackPanel tone={feedback.tone} message={feedback.message} details={feedback.details} />
        ) : null}

        {isLoadingNotifications ? (
          <LoadingRing label="Sto caricando le notifiche..." />
        ) : notificationsData.notifications.length > 0 ? (
          <div className="notifications-panel__list">
            {notificationsData.notifications.map((notification) => (
              <article className="notification-item" key={notification.id}>
                <div className="notification-item__head">
                  <StatusPill tone={notificationToneMap[notification.type] || "neutral"}>
                    {notificationLabelMap[notification.type] || notification.type}
                  </StatusPill>
                  <span>{formatNotificationDate(notification.updatedAt)}</span>
                </div>

                <h3>{notification.title}</h3>
                <p>{notification.message}</p>

                {!notification.isRead ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={pendingNotificationId === notification.id}
                  >
                    {pendingNotificationId === notification.id ? "Attendere..." : "Segna come letta"}
                  </Button>
                ) : (
                  <span className="notification-item__read">Letta</span>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="notification-item__empty">
            <p>Nessuna notifica per ora.</p>
          </div>
        )}
      </div>
    </SurfaceCard>
  );
}

export default NotificationsPanel;
