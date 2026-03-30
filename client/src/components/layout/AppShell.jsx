// questo file mi serve per definire il layout principale della schermata iniziale.
// lo uso per separare la composizione generale della pagina dai singoli contenuti delle sezioni.

// mi serve per organizzare hero e pannello di preview in una griglia pulita.
// questo tiene insieme la struttura principale cosi' nei prossimi step posso cambiare contenuti senza rifare il layout.
function AppShell({ header, hero, preview, content, footer }) {
  return (
    <div className="app-shell-layout">
      <header className="app-shell-layout__header">{header}</header>

      <main className="app-shell-main">
        <section className="app-shell app-shell--hero" id="panoramica">
          <section className="app-shell__hero">{hero}</section>
          <aside className="app-shell__preview" id="accesso">
            {preview}
          </aside>
        </section>

        <section className="app-shell__content">{content}</section>
      </main>

      <footer className="app-shell-layout__footer">{footer}</footer>
    </div>
  );
}

export default AppShell;
