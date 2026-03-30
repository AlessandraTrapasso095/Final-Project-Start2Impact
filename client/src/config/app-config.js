// questo file mi serve per tenere insieme le costanti principali del frontend.
// lo uso per evitare di ripetere nome progetto, url backend e informazioni di contesto in componenti diversi.

export const appConfig = Object.freeze({
  appName: "PixelForge Studio Workspace",
  appTagline: "Accessi, task e priorita' in uno spazio unico per il team creativo.",
  backendBaseUrl: "http://127.0.0.1:4321/api",
  currentStepLabel: "Area riservata team",
  frontendPort: 5174,
});
