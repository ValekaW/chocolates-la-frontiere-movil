export default function TopBar({ title, onBack }) {
  return (
    <header className="topbar">
      <button className="topbar__back" onClick={onBack} aria-label="Volver">‹</button>
      <h1>{title}</h1>
    </header>
  );
}
