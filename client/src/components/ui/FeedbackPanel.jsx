// questo file mi serve per mostrare feedback in tutta l'app

import LoadingRing from "./LoadingRing.jsx";

// mi serve per visualizzare messaggi di stato sempre con la stessa struttura.
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
