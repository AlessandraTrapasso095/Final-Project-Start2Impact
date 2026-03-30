// questo file mi serve per creare card riutilizzabili con la stessa base visiva.
// lo uso per contenitori di contenuti, pannelli e blocchi informativi senza ripetere sempre lo stesso wrapper.

// mi serve per avere una superficie coerente in tutto il progetto.
// questo componente accetta un titolo opzionale e mi lascia dentro qualsiasi contenuto mi serva.
function SurfaceCard({ eyebrow, title, description, children, className = "" }) {
  const cardClassName = `surface-card ${className}`.trim();

  return (
    <article className={cardClassName}>
      {(eyebrow || title || description) && (
        <header className="surface-card__header">
          {eyebrow ? <p className="surface-card__eyebrow">{eyebrow}</p> : null}
          {title ? <h3 className="surface-card__title">{title}</h3> : null}
          {description ? <p className="surface-card__description">{description}</p> : null}
        </header>
      )}
      {children}
    </article>
  );
}

export default SurfaceCard;
