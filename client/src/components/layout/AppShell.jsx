// questo file mi serve per definire il layout principale della schermata iniziale.

// mi serve per organizzare hero e pannello di preview in una griglia pulita.
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
