// questo file mi serve per costruire il pannello laterale con status e preview della UI.
// lo uso per mostrare subito loading, stato del sistema e checklist visiva del design system.

import LoadingRing from "../components/ui/LoadingRing.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import SurfaceCard from "../components/ui/SurfaceCard.jsx";
import { appConfig } from "../config/app-config.js";
import { previewChecklist, statusHighlights } from "../data/dashboard-highlights.js";

// mi serve per avere un pannello di controllo sintetico ma ricco.
// questo mostra informazioni utili al progetto e mi prepara gia' lo spazio dove metteremo l'auth vera nello step dopo.
function SystemPreview() {
  return (
    <div className="system-preview">
      <SurfaceCard
        eyebrow="System Preview"
        title="Pannello di base del frontend"
        description="Qui stiamo impostando i mattoni visivi che useremo nelle vere schermate di registrazione e login."
      >
        <div className="system-preview__status-list">
          {statusHighlights.map((item) => (
            <div className="system-preview__status-row" key={item.id}>
              <span className="system-preview__status-label">{item.label}</span>
              <StatusPill tone={item.tone}>{item.value}</StatusPill>
            </div>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        eyebrow="Loading State"
        title="Feedback visivo gia' pronto"
        description="Il cerchio animato e' gia' riusabile per submit, login e salvataggi futuri."
      >
        <LoadingRing label="Sto preparando i componenti della UI auth..." />
      </SurfaceCard>

      <SurfaceCard
        eyebrow="Frontend Setup"
        title="Dettagli rapidi"
        description="Configurazione attuale del client prima di passare allo step successivo."
      >
        <dl className="system-preview__details">
          <div>
            <dt>Nome app</dt>
            <dd>{appConfig.appName}</dd>
          </div>
          <div>
            <dt>Backend</dt>
            <dd>{appConfig.backendBaseUrl}</dd>
          </div>
          <div>
            <dt>Frontend</dt>
            <dd>{`http://localhost:${appConfig.frontendPort}`}</dd>
          </div>
        </dl>
      </SurfaceCard>

      <SurfaceCard
        eyebrow="Checklist"
        title="Cose gia' impostate bene"
        description="Questa base ci serve per non ripartire da zero quando costruiremo la UI vera."
      >
        <ul className="system-preview__checklist">
          {previewChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </SurfaceCard>
    </div>
  );
}

export default SystemPreview;
