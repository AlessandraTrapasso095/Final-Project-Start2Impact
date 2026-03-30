// questo file mi serve per mostrare il riepilogo utente dentro la dashboard loggata

import SurfaceCard from "../ui/SurfaceCard.jsx";

const roleLabelMap = {
  member: "Membro team",
};

const formatSessionDate = (value) => {
  if (!value) {
    return "Non disponibile";
  }

  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

// mi serve per mostrare un riepilogo chiaro dell'utente autenticato
function AuthenticatedPanel({ user, session }) {
  const roleLabel = roleLabelMap[user.role] || user.role;

  return (
    <div className="auth-session">
      <SurfaceCard
        eyebrow="Accesso"
        title="Il tuo account"
        className="auth-session__card"
      >
        <p className="auth-session__role">{roleLabel}</p>

        <dl className="auth-session__details">
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>Accesso</dt>
            <dd>{formatSessionDate(session.createdAt)}</dd>
          </div>
          <div>
            <dt>Ultimo aggiornamento</dt>
            <dd>{formatSessionDate(session.lastUsedAt)}</dd>
          </div>
        </dl>
      </SurfaceCard>
    </div>
  );
}

export default AuthenticatedPanel;
