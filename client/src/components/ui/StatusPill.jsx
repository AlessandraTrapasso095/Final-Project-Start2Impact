// lo uso per etichette come online, design system, next step e simili

const toneClassMap = {
  success: "status-pill status-pill--success",
  warning: "status-pill status-pill--warning",
  neutral: "status-pill status-pill--neutral",
};

// mi serve per stampare una pillola compatta ma leggibile.
function StatusPill({ children, tone = "neutral" }) {
  const className = toneClassMap[tone] || toneClassMap.neutral;

  return <span className={className}>{children}</span>;
}

export default StatusPill;
