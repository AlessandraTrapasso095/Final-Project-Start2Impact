// lo uso per delegare ad AuthWorkspace il cambio completo tra landing guest e dashboard autenticata.

import AuthWorkspace from "./sections/AuthWorkspace.jsx";

// questo lascia ad AuthWorkspace il compito di decidere se mostrare la landing o l'area loggata.
function App() {
  return <AuthWorkspace />;
}

export default App;
