// questo file mi serve per mostrare un loading ring elegante e riusabile.
// lo uso per comunicare attesa o stato di lavoro senza dover reinventare ogni volta lo stesso elemento.

// mi serve per visualizzare subito che qualcosa e' in corso.
// questo componente rimane piccolo e semplice cosi' posso usarlo sia nelle card sia nei pulsanti piu' avanti.
function LoadingRing({ label = "Caricamento in corso..." }) {
  return (
    <div className="loading-ring-block" aria-live="polite">
      <span className="loading-ring" aria-hidden="true"></span>
      <span className="loading-ring-label">{label}</span>
    </div>
  );
}

export default LoadingRing;
