import { useState } from "react";
import { callModel } from "../api";

export default function CompareMode({ models, systemPrompt }) {
  const [modelA, setModelA] = useState(models[0]);
  const [modelB, setModelB] = useState(models[3]);
  const [prompt, setPrompt] = useState("");
  const [responseA, setResponseA] = useState(null);
  const [responseB, setResponseB] = useState(null);
  const [busyA, setBusyA] = useState(false);
  const [busyB, setBusyB] = useState(false);
  const [timingA, setTimingA] = useState(null);
  const [timingB, setTimingB] = useState(null);

  async function runCompare() {
    if (!prompt.trim() || busyA || busyB) return;
    setResponseA(null); setResponseB(null);
    setTimingA(null); setTimingB(null);

    const msgs = systemPrompt
      ? [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }]
      : [{ role: "user", content: prompt }];

    setBusyA(true); setBusyB(true);

    const runA = async () => {
      const t = Date.now();
      try {
        const r = await callModel(modelA, msgs);
        setResponseA(r);
        setTimingA(((Date.now() - t) / 1000).toFixed(1));
      } catch (e) { setResponseA(`Error: ${e.message}`); }
      setBusyA(false);
    };

    const runB = async () => {
      const t = Date.now();
      try {
        const r = await callModel(modelB, msgs);
        setResponseB(r);
        setTimingB(((Date.now() - t) / 1000).toFixed(1));
      } catch (e) { setResponseB(`Error: ${e.message}`); }
      setBusyB(false);
    };

    await Promise.all([runA(), runB()]);
  }

  function handleKey(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) runCompare();
  }

  return (
    <div className="compare-mode">
      <div className="compare-header">
        <h2>Model Comparison</h2>
        <p>Send the same prompt to two models simultaneously and compare their responses.</p>
      </div>
      <div className="compare-selectors">
        <ModelSelector label="Model A" models={models} value={modelA} onChange={setModelA} exclude={modelB} />
        <div className="vs-badge">VS</div>
        <ModelSelector label="Model B" models={models} value={modelB} onChange={setModelB} exclude={modelA} />
      </div>
      <div className="compare-input-wrap">
        <textarea
          className="compare-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter a prompt to send to both models… (Ctrl+Enter to run)"
          rows={3}
        />
        <button className="compare-run-btn" onClick={runCompare} disabled={busyA || busyB || !prompt.trim()}>
          {busyA || busyB ? "Running…" : "Compare →"}
        </button>
      </div>
      <div className="compare-results">
        <ResponsePanel model={modelA} response={responseA} busy={busyA} timing={timingA} label="A" />
        <ResponsePanel model={modelB} response={responseB} busy={busyB} timing={timingB} label="B" />
      </div>
    </div>
  );
}

function ModelSelector({ label, models, value, onChange, exclude }) {
  return (
    <div className="model-selector">
      <label className="selector-label">{label}</label>
      <select value={value.id} onChange={(e) => onChange(models.find((m) => m.id === e.target.value))} className="selector-select">
        {models.filter((m) => m.id !== exclude?.id).map((m) => (
          <option key={m.id} value={m.id}>{m.label} ({m.publisher})</option>
        ))}
      </select>
    </div>
  );
}

function ResponsePanel({ model, response, busy, timing, label }) {
  return (
    <div className={`response-panel panel-${label.toLowerCase()}`}>
      <div className="panel-header">
        <div>
          <span className="panel-badge">{label}</span>
          <span className="panel-model-name">{model.label}</span>
          <span className="panel-publisher">{model.publisher}</span>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {timing && <span className="timing-badge">{timing}s</span>}
          {response && (
            <button className="copy-response-btn" onClick={() => navigator.clipboard.writeText(response)} title="Copy">📋</button>
          )}
        </div>
      </div>
      <div className="panel-body">
        {busy && <div className="typing-compare"><span /><span /><span /></div>}
        {!busy && !response && <span className="panel-empty">Response will appear here…</span>}
        {!busy && response && <div className="panel-text">{response}</div>}
      </div>
    </div>
  );
}
