export default function QtyStepper({ value, onChange, min = 1 }) {
  return (
    <div className="stepper" role="group" aria-label="Cantidad">
      <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Quitar uno">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Agregar uno">+</button>
    </div>
  );
}
