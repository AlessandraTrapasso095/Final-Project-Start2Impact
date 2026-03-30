// questo file mi serve per costruire solo la hero della landing.
// lo uso per rispettare il layout del riferimento: testo a sinistra e box account separato sulla destra.

// mi serve per dare alla hero un tono piu' pulito e piu' vicino alla reference.
// questo blocco racconta subito il prodotto senza trascinarsi dietro le altre sezioni della landing.
function AuthExperience() {
  return (
    <div className="landing-hero">
      <div className="landing-hero__copy">
        <p className="landing-hero__eyebrow">Workspace operativo per PixelForge Studio</p>
        <h1 className="landing-hero__title">
          Il workspace per
          <br />
          <span>team creativi moderni.</span>
        </h1>
        <p className="landing-hero__description">
          Un&apos;applicazione full stack pensata per dare al team un accesso semplice, una task board chiara e uno
          spazio unico in cui organizzare attivita', priorita' e avanzamento del lavoro.
        </p>

        <div className="landing-hero__proof">
          <div className="landing-hero__avatars" aria-hidden="true">
            <span>PF</span>
            <span>UX</span>
            <span>PM</span>
          </div>
          <p>Progettato per piccoli team creativi che vogliono lavorare con piu' ordine e meno dispersione.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthExperience;
