// questo file mi serve per costruire la navigazione laterale dell'area riservata.
// lo uso per dare alla dashboard una struttura chiara con collegamenti rapidi alle sezioni principali.

import { useEffect, useState } from "react";

const navItems = [
  { id: "dashboard", label: "Panoramica" },
  { id: "task-board", label: "Attivita'" },
  { id: "bacheca", label: "Bacheca" },
  { id: "notifiche", label: "Notifiche" },
  { id: "profilo", label: "Profilo" },
];

const getActiveNavItemId = (hashValue = "") => {
  const normalizedHash = String(hashValue || "").replace(/^#/, "");

  return navItems.some((item) => item.id === normalizedHash) ? normalizedHash : "dashboard";
};

// mi serve per tenere la sidebar leggibile e coerente col layout editoriale che sto seguendo.
// qui porto rapidamente l'utente nelle parti importanti della dashboard senza appesantire l'header centrale.
function WorkspaceSidebar() {
  const [activeItemId, setActiveItemId] = useState(() =>
    typeof window === "undefined" ? "dashboard" : getActiveNavItemId(window.location.hash),
  );

  useEffect(() => {
    const syncActiveItem = () => {
      setActiveItemId(getActiveNavItemId(window.location.hash));
    };

    syncActiveItem();
    window.addEventListener("hashchange", syncActiveItem);

    return () => {
      window.removeEventListener("hashchange", syncActiveItem);
    };
  }, []);

  return (
    <aside className="workspace-sidebar">
      <div className="workspace-sidebar__brand">
        <span className="workspace-sidebar__logo">PF</span>
        <div>
          <strong>PixelForge Studio</strong>
          <span>Area riservata</span>
        </div>
      </div>

      <nav className="workspace-sidebar__nav" aria-label="Navigazione area riservata">
        {navItems.map((item) => (
          <a
            key={item.id}
            className={`workspace-sidebar__link ${
              activeItemId === item.id ? "workspace-sidebar__link--active" : ""
            }`.trim()}
            href={`#${item.id}`}
            aria-current={activeItemId === item.id ? "page" : undefined}
            onClick={() => setActiveItemId(item.id)}
          >
            <span className="workspace-sidebar__link-mark" aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="workspace-sidebar__footer">
        <a className="workspace-sidebar__cta" href="#nuovo-task">
          Crea task
        </a>
        <div className="workspace-sidebar__meta">
          <a href="#workspace-footer">Supporto</a>
          <a href="#notifiche">Notifiche</a>
        </div>
      </div>
    </aside>
  );
}

export default WorkspaceSidebar;
