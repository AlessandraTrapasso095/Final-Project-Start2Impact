// questo file mi serve per raccogliere tutte le sezioni che stanno sotto la hero.
// lo uso per tenere workflow, benefici e struttura della landing a tutta larghezza come nel layout di riferimento.

import { footerDialogItems } from "../data/footer-dialog-items.js";

const workflowCards = [
  {
    id: "accesso",
    title: "Entra nel workspace",
    description:
      "Ogni persona del team accede al proprio spazio e ritrova subito attivita', priorita' e stato del lavoro.",
  },
  {
    id: "task",
    title: "Apri nuove attivita'",
    description:
      "Brief, task e priorita' vengono inseriti in modo chiaro, cosi' la giornata parte con indicazioni operative precise.",
  },
  {
    id: "flusso",
    title: "Muovi e chiudi il lavoro",
    description:
      "La board accompagna il flusso dal primo inserimento alla chiusura finale, senza perdere il contesto del team.",
  },
];

const featurePanels = [
  {
    id: "clarity",
    title: "Chiarezza operativa per task, priorita' e avanzamento.",
    description:
      "PixelForge Studio ha uno spazio unico per coordinare il team creativo e ridurre il rumore operativo della giornata.",
  },
  {
    id: "reviews",
    title: "Revisioni piu' ordinate",
    description:
      "Ogni attivita' parte con stato e priorita', cosi' il team capisce subito cosa va fatto per primo.",
  },
  {
    id: "access",
    title: "Accessi semplici per il team",
    description:
      "Nuovi account, rientro rapido e una board pronta da usare appena si entra nel workspace.",
  },
];

const showcaseImageUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuARQino_OUaOqoIxxmweMpIGvFdnCR62S2f5IkPwvdz0_c9v6dgTnhi-3yNWZWfwkTD3GMzsOYzk2x0JYFUNIKrHFWjpXNisM9AiTD4frm_ZzMGw66U5oTF2is7Mkc3CcBW0Grg-erl_iB9mJaC_Kz9y7cPYr0l-5e6y8_CUbHSIMg_6yidLINwA8nWeDXhAusXM9FKypFxX9bDIX5HIZxb_DOFvzT1NAI6CUawCzI9UCrHZakhFd2JEXBQCk4yh6TzYZoQbRe0W10";

// mi serve per costruire il resto della landing sotto la hero.
// questo blocco adatta workflow e sezione benefici al progetto PixelForge senza copiare il testo della reference.
function LandingSections() {
  return (
    <div className="landing-sections">
      <section className="landing-section landing-section--muted" id="workflow">
        <div className="landing-section__inner">
          <div className="landing-section__head landing-section__head--wide">
            <p className="landing-section__eyebrow">Workflow</p>
            <h2 className="landing-section__title landing-section__title--wide">
              Un workflow costruito per lavorare con piu' chiarezza.
            </h2>
          </div>

          <div className="landing-workflow">
            {workflowCards.map((item, index) => (
              <article className="landing-workflow__card" key={item.id}>
                <span className="landing-workflow__index">{`0${index + 1}`}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section" id="funzionalita">
        <div className="landing-section__inner">
          <div className="landing-feature-grid">
            <article className="landing-feature-grid__large">
              <img alt="Workspace creativo moderno e ordinato" src={showcaseImageUrl} />

              <div className="landing-feature-grid__large-overlay">
                <p className="landing-feature-grid__eyebrow">Chiarezza del workspace</p>
                <h3>{featurePanels[0].title}</h3>
                <p>{featurePanels[0].description}</p>
              </div>
            </article>

            <div className="landing-feature-grid__stack">
              <article className="landing-feature-grid__card landing-feature-grid__card--accent">
                <p className="landing-feature-grid__eyebrow">Revisione</p>
                <h3>{featurePanels[1].title}</h3>
                <p>{featurePanels[1].description}</p>
              </article>

              <article className="landing-feature-grid__card landing-feature-grid__card--dark">
                <p className="landing-feature-grid__eyebrow">Accesso</p>
                <h3>{featurePanels[2].title}</h3>
                <p>{featurePanels[2].description}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--support">
        <div className="landing-section__inner">
          <div className="landing-section__head landing-section__head--wide">
            <p className="landing-section__eyebrow">Informazioni utili</p>
            <h2 className="landing-section__title landing-section__title--wide">
              Link di footer reali e contenuti consultabili.
            </h2>
          </div>

          <div className="landing-support">
            {footerDialogItems.map((panel) => (
              <article className="landing-support__card" id={panel.id} key={panel.id}>
                <p className="landing-support__eyebrow">{panel.eyebrow}</p>
                <h3>{panel.title}</h3>
                <p>{panel.description}</p>

                {panel.id === "contatti" ? (
                  <div className="landing-support__actions">
                    <a href="#accesso">Vai all'accesso</a>
                    <a href="#workflow">Rivedi il workflow</a>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingSections;
