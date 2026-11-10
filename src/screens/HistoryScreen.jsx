import { useNav } from '../nav.jsx';
import { useData } from '../state/DataContext.jsx';
import { assetUrl } from '../config.js';

export default function HistoryScreen() {
  const { db } = useData();
  const nav = useNav();
  const history = db.history;

  if (!history) return <p className="status">Pronto contaremos nuestra historia.</p>;

  return (
    <div className="page">
      <p className="kicker">Desde {history.since}</p>
      <h1 className="page-title">{history.title}</h1>
      {history.image && <img className="history-img" src={assetUrl(history.image)} alt="" />}
      <p>{history.intro}</p>

      <ol className="timeline">
        {history.milestones.map((m) => (
          <li key={m.year}>
            <span className="timeline__year">{m.year}</span>
            <div>
              <h2>{m.title}</h2>
              <p>{m.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <ul className="values">
        {history.values.map((v) => <li key={v}>{v}</li>)}
      </ul>

      <section className="box">
        <p className="hint">🇲🇽 {history.badge}</p>
        <h2>{history.closing}</h2>
        <button className="btn btn--gold btn--block" onClick={() => nav.switchTab('catalog')}>Ver catálogo</button>
      </section>
    </div>
  );
}
