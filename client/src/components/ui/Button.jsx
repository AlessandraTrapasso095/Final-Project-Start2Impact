// lo uso per cambiare variante e dimensione 

const variantClassMap = {
  primary: "button button--primary",
  secondary: "button button--secondary",
  ghost: "button button--ghost",
  danger: "button button--danger",
};

const sizeClassMap = {
  medium: "button--medium",
  large: "button--large",
};

// mi serve per centralizzare la resa dei pulsanti principali del progetto.
function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}) {
  const variantClassName = variantClassMap[variant] || variantClassMap.primary;
  const sizeClassName = sizeClassMap[size] || sizeClassMap.medium;
  const buttonClassName = `${variantClassName} ${sizeClassName} ${className}`.trim();

  return (
    <button className={buttonClassName} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;
