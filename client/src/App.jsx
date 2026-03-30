// questo file mi serve per comporre il punto di ingresso vero del frontend.
// lo uso per delegare ad AuthWorkspace il cambio completo tra landing guest e dashboard autenticata.

import AuthWorkspace from "./sections/AuthWorkspace.jsx";

// mi serve come punto di ingresso della UI React.
// questo lascia ad AuthWorkspace il compito di decidere se mostrare la landing o l'area loggata.
function App() {
  return <AuthWorkspace />;
}

export default App;
