// lo uso per costruire card e pillole senza scrivere dati hardcoded dentro i componenti.

export const workflowHighlights = [
  {
    id: "auth",
    eyebrow: "Autenticazione",
    title: "Register, login e logout gia' pronti",
    description:
      "Le API backend espongono gia' il flusso completo di autenticazione con sessioni persistenti.",
  },
  {
    id: "ui",
    eyebrow: "Interfaccia",
    title: "Design system di base impostato",
    description:
      "Palette, card, bottoni, pillole di stato e loading ring sono pronti da riusare nei prossimi step.",
  },
  {
    id: "next",
    eyebrow: "Prossimo focus",
    title: "Schermate auth vere",
    description:
      "Nel prossimo step trasformiamo questa base visiva in pagine di registrazione e login complete.",
  },
];

export const statusHighlights = [
  { id: "backend", label: "Backend API", value: "Online su :4321", tone: "success" },
  { id: "frontend", label: "Frontend", value: "React + Vite", tone: "neutral" },
  { id: "phase", label: "Fase attuale", value: "Design system", tone: "warning" },
];

export const previewChecklist = [
  "Palette moderna con superfici, gradienti e contrasto leggibile.",
  "Bottoni con hover e movimento leggero per un look piu' curato.",
  "Loading con cerchio animato gia' pronto da riutilizzare.",
  "Struttura a componenti semplici per non duplicare markup nei prossimi step.",
];
