// questo file mi serve per mostrare piccoli stati visivi in modo coerente.
// lo uso per etichette come online, design system, next step e simili senza duplicare classi o struttura.

const toneClassMap = {
  success: "status-pill status-pill--success",
  warning: "status-pill status-pill--warning",
  neutral: "status-pill status-pill--neutral",
};

// mi serve per stampare una pillola compatta ma leggibile.
// questo prende il tono giusto e lo trasforma in una classe coerente con il resto dell'interfaccia.
function StatusPill({ children, tone = "neutral" }) {
  const className = toneClassMap[tone] || toneClassMap.neutral;

  return <span className={className}>{children}</span>;
}

export default StatusPill;
