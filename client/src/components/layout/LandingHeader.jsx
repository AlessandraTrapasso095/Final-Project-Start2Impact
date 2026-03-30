// questo file mi serve per mostrare la testata principale della landing.

// questo tiene insieme logo testuale, link di sezione e bottone che porta alla box di accesso.
function LandingHeader() {
  return (
    <div className="landing-header">
      <div className="landing-header__brand">
        <span className="landing-header__logo">PF</span>
        <div className="landing-header__brand-copy">
          <strong>PixelForge Studio</strong>
          <span>Workspace creativo</span>
        </div>
      </div>

      <nav className="landing-header__nav" aria-label="Navigazione principale">
        <a href="#panoramica">Panoramica</a>
        <a href="#workflow">Workflow</a>
        <a href="#funzionalita">Funzionalita'</a>
      </nav>

      <div className="landing-header__actions">
        <a className="landing-header__cta" href="#accesso">
          Accedi
        </a>
      </div>
    </div>
  );
}

export default LandingHeader;
