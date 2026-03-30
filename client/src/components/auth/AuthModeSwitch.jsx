// questo file mi serve per cambiare velocemente tra login e registrazione.
// lo uso per tenere separata la logica di switch dal resto del form 

const authModes = [
  { id: "register", label: "Crea account" },
  { id: "login", label: "Accedi" },
];

// mi serve per rendere lo switch dei form chiaro e riusabile.
// questo riceve la modalita' attiva e avvisa il componente padre quando l'utente cambia tab.
function AuthModeSwitch({ activeMode, onModeChange }) {
  return (
    <div className="auth-mode-switch" role="tablist" aria-label="Selezione form autenticazione">
      {authModes.map((mode) => (
        <button
          key={mode.id}
          className={`auth-mode-switch__button ${
            activeMode === mode.id ? "auth-mode-switch__button--active" : ""
          }`.trim()}
          type="button"
          role="tab"
          aria-selected={activeMode === mode.id}
          onClick={() => onModeChange(mode.id)}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

export default AuthModeSwitch;
