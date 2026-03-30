// questo file mi serve per costruire l'area loggata vera dell'app.
// lo uso per sostituire completamente la landing dopo il login e distribuire task, bacheca, profilo e notifiche.

import { useState } from "react";
import FeedPanel from "./FeedPanel.jsx";
import WorkspaceFooter from "./WorkspaceFooter.jsx";
import WorkspaceSidebar from "./WorkspaceSidebar.jsx";
import NotificationsPanel from "./NotificationsPanel.jsx";
import ProfilePanel from "./ProfilePanel.jsx";
import TaskBoardPanel from "../tasks/TaskBoardPanel.jsx";
import Button from "../ui/Button.jsx";

// mi serve per tenere allineato il pannello notifiche quando succede qualcosa in dashboard.
function WorkspaceDashboard({
  user,
  session,
  isLoggingOut,
  onLogout,
  onSessionExpired,
  onUserChange,
}) {
  const [activityVersion, setActivityVersion] = useState(0);

  const handleWorkspaceActivity = () => {
    setActivityVersion((currentVersion) => currentVersion + 1);
  };

  return (
    <div className="workspace-shell">
      <WorkspaceSidebar />

      <div className="workspace-shell__main-column">
        <header className="workspace-topbar">
          <div className="workspace-topbar__status">
            <span className="workspace-topbar__dot" aria-hidden="true" />
            <span>Spazio attivo</span>
          </div>

          <p className="workspace-topbar__title">Area riservata</p>

          <div className="workspace-topbar__actions">
            <div className="workspace-topbar__user">
              <span>{user.name}</span>
            </div>

            <Button
              variant="secondary"
              className="workspace-app__logout"
              onClick={onLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Sto uscendo..." : "Log Out"}
            </Button>
          </div>
        </header>

        <main className="workspace-shell__content">
          <TaskBoardPanel
            user={user}
            session={session}
            onSessionExpired={onSessionExpired}
            onActivity={handleWorkspaceActivity}
            feedPanel={(
              <FeedPanel
                user={user}
                session={session}
                onSessionExpired={onSessionExpired}
                onActivity={handleWorkspaceActivity}
              />
            )}
          />

          <WorkspaceFooter />
        </main>
      </div>

      <aside className="workspace-shell__right-sidebar">
        <NotificationsPanel
          session={session}
          refreshSignal={activityVersion}
          onSessionExpired={onSessionExpired}
        />

        <ProfilePanel
          user={user}
          session={session}
          onUserChange={onUserChange}
          onSessionExpired={onSessionExpired}
          onActivity={handleWorkspaceActivity}
        />
      </aside>
    </div>
  );
}

export default WorkspaceDashboard;
