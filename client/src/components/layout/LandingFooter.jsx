// questo file mi serve per chiudere la landing con un footer pulito e coerente.
// lo uso per dare un'uscita ordinata alla pagina con nome studio e link finali adattati al progetto.

import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button.jsx";
import { footerDialogItems } from "../../data/footer-dialog-items.js";

const initialContactFormValues = {
  name: "",
  email: "",
  topic: "demo",
  message: "",
};

// mi serve per avere un footer semplice, professionale e allineato al tono della landing.
// questo tiene insieme nome studio, copyright e link utili senza trasformare la chiusura della pagina in un blocco pesante.
function LandingFooter() {
  const [activeDialogId, setActiveDialogId] = useState("");
  const [contactFormValues, setContactFormValues] = useState(initialContactFormValues);
  const [hasSubmittedFakeContactForm, setHasSubmittedFakeContactForm] = useState(false);

  const activeDialog = useMemo(
    () => footerDialogItems.find((item) => item.id === activeDialogId) || null,
    [activeDialogId],
  );

  useEffect(() => {
    if (!activeDialog) {
      return undefined;
    }

    const originalBodyOverflow = document.body.style.overflow;
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setActiveDialogId("");
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [activeDialog]);

  const handleOpenDialog = (dialogId) => {
    setHasSubmittedFakeContactForm(false);
    setActiveDialogId(dialogId);
  };

  const handleCloseDialog = () => {
    setActiveDialogId("");
  };

  const handleContactFieldChange = (event) => {
    const { name, value } = event.target;

    setContactFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  };

  const handleFakeContactSubmit = (event) => {
    event.preventDefault();
    setHasSubmittedFakeContactForm(true);
  };

  return (
    <>
      <div className="landing-footer">
        <div className="landing-footer__brand">
          <strong>PixelForge Studio</strong>
          <span>© 2026 PixelForge Studio. Tutti i diritti riservati.</span>
        </div>

        <div className="landing-footer__links">
          {footerDialogItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="landing-footer__link-button"
              onClick={() => handleOpenDialog(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeDialog ? (
        <div
          className="landing-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`landing-dialog-title-${activeDialog.id}`}
          onClick={handleCloseDialog}
        >
          <div className="landing-dialog__panel" onClick={(event) => event.stopPropagation()}>
            <div className="landing-dialog__header">
              <div className="landing-dialog__copy">
                <p className="landing-dialog__eyebrow">{activeDialog.eyebrow}</p>
                <h2 className="landing-dialog__title" id={`landing-dialog-title-${activeDialog.id}`}>
                  {activeDialog.title}
                </h2>
              </div>

              <button
                type="button"
                className="landing-dialog__close"
                onClick={handleCloseDialog}
                aria-label="Chiudi popup"
              >
                ×
              </button>
            </div>

            <div className="landing-dialog__body">
              <p className="landing-dialog__description">{activeDialog.description}</p>

              {activeDialog.id === "contatti" ? (
                <form className="landing-dialog__form" onSubmit={handleFakeContactSubmit}>
                  <label className="landing-dialog__field">
                    <span>Nome completo</span>
                    <input
                      className="form-field__input"
                      name="name"
                      value={contactFormValues.name}
                      onChange={handleContactFieldChange}
                      placeholder="Mario Rossi"
                    />
                  </label>

                  <label className="landing-dialog__field">
                    <span>Email</span>
                    <input
                      className="form-field__input"
                      type="email"
                      name="email"
                      value={contactFormValues.email}
                      onChange={handleContactFieldChange}
                      placeholder="mario@pixelforge.it"
                    />
                  </label>

                  <label className="landing-dialog__field">
                    <span>Tipo richiesta</span>
                    <select
                      className="form-field__input"
                      name="topic"
                      value={contactFormValues.topic}
                      onChange={handleContactFieldChange}
                    >
                      <option value="demo">Richiesta demo</option>
                      <option value="support">Supporto interno</option>
                      <option value="collaboration">Collaborazione</option>
                    </select>
                  </label>

                  <label className="landing-dialog__field">
                    <span>Messaggio</span>
                    <textarea
                      className="form-field__input"
                      name="message"
                      value={contactFormValues.message}
                      onChange={handleContactFieldChange}
                      rows="5"
                      placeholder="Scrivo qui una richiesta dimostrativa..."
                    />
                  </label>

                  <div className="landing-dialog__form-actions">
                    <Button type="submit" size="large">
                      Invia richiesta
                    </Button>
                    <p>Form dimostrativo: non invia davvero messaggi.</p>
                  </div>

                  {hasSubmittedFakeContactForm ? (
                    <div className="landing-dialog__success">
                      <p>Richiesta dimostrativa registrata. In una versione reale qui partirebbe l'invio.</p>
                    </div>
                  ) : null}
                </form>
              ) : (
                <div className="landing-dialog__details">
                  {activeDialog.details.map((detail) => (
                    <p key={detail}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default LandingFooter;
