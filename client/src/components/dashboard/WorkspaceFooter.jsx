// questo file mi serve per chiudere l'area riservata con un footer coerente.
// lo uso per dare una base ordinata alla dashboard interna senza riusare il footer della landing.

const footerLinks = [
  { id: "dashboard", label: "Panoramica" },
  { id: "task-board", label: "Attivita'" },
  { id: "bacheca", label: "Bacheca" },
  { id: "profilo", label: "Profilo" },
];

// mi serve per chiudere la dashboard con riferimenti utili e interni all'app.
// questo tiene insieme brand e scorciatoie senza creare un blocco pesante in fondo alla pagina.
function WorkspaceFooter() {
  return (
    <footer className="workspace-footer" id="workspace-footer">
      <div className="workspace-footer__brand">
        <strong>PixelForge Studio</strong>
        <span>Workspace interno del team creativo.</span>
      </div>

      <div className="workspace-footer__links">
        {footerLinks.map((link) => (
          <a key={link.id} href={`#${link.id}`}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}

export default WorkspaceFooter;
