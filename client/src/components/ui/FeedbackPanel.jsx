// questo file mi serve per mostrare feedback coerenti in tutta l'app.
// lo uso per restare DRY tra auth e task board, con messaggi, dettagli errore e loading nello stesso componente.

import LoadingRing from "./LoadingRing.jsx";

// mi serve per visualizzare messaggi di stato sempre con la stessa struttura.
// questo componente gestisce sia il semplice testo sia un piccolo elenco di dettagli utili quando qualcosa non va.
function FeedbackPanel({
  tone = "neutral",
  message,
  details = [],
  isLoading = false,
  loadingLabel = "Caricamento in corso...",
}) {
  return (
    <div className={`feedback-panel feedback-panel--${tone}`.trim()}>
      {isLoading ? <LoadingRing label={loadingLabel} /> : <p>{message}</p>}

      {!isLoading && details.length > 0 ? (
        <ul className="feedback-panel__details">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default FeedbackPanel;
