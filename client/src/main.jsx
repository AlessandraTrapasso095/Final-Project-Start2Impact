// questo file mi serve per montare l'app React dentro la pagina.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

const rootElement = document.getElementById("root");

// questo prende il contenitore root dell'html e ci monta sopra tutta l'interfaccia React.
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
