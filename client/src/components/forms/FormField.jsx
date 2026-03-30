// questo file mi serve per avere un campo form riusabile con label, hint ed errore.

// prende le informazioni base del campo e decide da solo come mostrare messaggi di aiuto o di errore.
function FormField({
  label,
  name,
  as = "input",
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  hint,
  options = [],
  rows = 4,
}) {
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined;
  const fieldClassName = `form-field__input ${error ? "form-field__input--error" : ""}`.trim();

  const commonFieldProps = {
    className: fieldClassName,
    name,
    value,
    onChange,
    placeholder,
    autoComplete,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
  };

  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {as === "textarea" ? (
        <textarea {...commonFieldProps} rows={rows} />
      ) : as === "select" ? (
        <select {...commonFieldProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...commonFieldProps} type={type} />
      )}
      {error ? (
        <span className="form-field__error" id={`${name}-error`}>
          {error}
        </span>
      ) : hint ? (
        <span className="form-field__hint" id={`${name}-hint`}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export default FormField;
