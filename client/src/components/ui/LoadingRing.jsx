// questo file mi serve per mostrare un loading ring 

// mi serve per visualizzare subito che qualcosa e' in corso.
function LoadingRing({ label = "Caricamento in corso..." }) {
  return (
    <div className="loading-ring-block" aria-live="polite">
      <span className="loading-ring" aria-hidden="true"></span>
      <span className="loading-ring-label">{label}</span>
    </div>
  );
}

export default LoadingRing;
