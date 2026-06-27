export default function ModelStrip({ models, selected, onSelect }) {
  return (
    <div className="model-strip">
      {models.map((m) => (
        <button
          key={m.id}
          className={`model-btn ${selected?.id === m.id ? "active" : ""}`}
          onClick={() => onSelect(m)}
          title={`${m.publisher} · ${m.tags.join(", ")}`}
        >
          <span className="model-label">{m.label}</span>
          <span className="model-pub">{m.publisher}</span>
        </button>
      ))}
    </div>
  );
}
