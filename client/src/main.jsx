// questo file mi serve per montare l'app React dentro la pagina.
// lo uso per caricare una volta sola gli stili globali e agganciare App al div root.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");

// mi serve per inizializzare davvero l'app lato browser.
// questo prende il contenitore root dell'html e ci monta sopra tutta l'interfaccia React.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
