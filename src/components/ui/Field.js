/** Label + control + inline error. Pass the control as children. */
export default function Field({ label, htmlFor, error, hint, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
        </label>
      )}
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}
