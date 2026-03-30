// questo file mi serve per costruire il pannello hero della homepage iniziale.

import Button from "../components/ui/Button.jsx";
import StatusPill from "../components/ui/StatusPill.jsx";
import SurfaceCard from "../components/ui/SurfaceCard.jsx";
import { appConfig } from "../config/app-config.js";
import { workflowHighlights } from "../data/dashboard-highlights.js";

// mi serve per dare alla pagina una parte introduttiva 
function HeroPanel() {
  return (
    <div className="hero-panel">
      <div className="hero-panel__intro">
        <StatusPill tone="success">Backend online</StatusPill>
        <StatusPill tone="warning">{appConfig.currentStepLabel}</StatusPill>
      </div>

      <div className="hero-panel__copy">
        <p className="hero-panel__eyebrow">TaskFlow Studio</p>
        <h1 className="hero-panel__title">
          Una base front-end moderna, pronta per trasformarsi nella web app finale del Master.
        </h1>
        <p className="hero-panel__description">{appConfig.appTagline}</p>
      </div>

      <div className="hero-panel__actions">
        <Button size="large">Step 7: schermate auth</Button>
        <Button size="large" variant="secondary">
          API base: /api/auth
        </Button>
      </div>

      <div className="hero-panel__grid">
        {workflowHighlights.map((item) => (
          <SurfaceCard
            key={item.id}
            eyebrow={item.eyebrow}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroPanel;
