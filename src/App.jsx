import { useState, useRef, useEffect } from "react";
import ModelStrip from "./components/ModelStrip";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import CompareMode from "./components/CompareMode";
import SystemPromptEditor from "./components/SystemPromptEditor";
import ExportMenu from "./components/ExportMenu";
import ThemeToggle from "./components/ThemeToggle";
import { MODELS } from "./models";
import { callModel } from "./api";
import "./App.css";

export default function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [history, setHistory] = useState([
    { role: "assistant", content: "Hello! Pick a model above and ask me anything.", model: null },
  ]);
  const [busy, setBusy] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const bottomRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function send(text) {
    if (busy || !selectedModel || !text.trim()) return;
    const userMsg = { role: "user", content: text };
    const next = [...history, userMsg];
    setHistory(next);
    setBusy(true);
    try {
      const apiHistory = next
        .filter((m) => m.role !== "assistant" || m.model)
        .map(({ role, content }) => ({ role, content }));
      const withSystem = systemPrompt
        ? [{ role: "system", content: systemPrompt }, ...apiHistory]
        : apiHistory;
      const reply = await callModel(selectedModel, withSystem);
      setHistory([...next, { role: "assistant", content: reply, model: selectedModel }]);
    } catch (e) {
      setHistory([...next, { role: "assistant", content: `Error: ${e.message}`, model: selectedModel, error: true }]);
    }
    setBusy(false);
  }

  function clearChat() {
    setHistory([{ role: "assistant", content: "Chat cleared. Select a model and ask anything!", model: null }]);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>GitHub Models Playground</h1>
            <p>Chat with open and proprietary models via the GitHub Models catalog</p>
          </div>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === "light" ? "dark" : "light")} />
            <button
              className={`tool-btn ${showSystemPrompt ? "active" : ""}`}
              onClick={() => setShowSystemPrompt(s => !s)}
              title="System prompt"
            >
              ⚙ System
            </button>
            <button
              className={`tool-btn ${compareMode ? "active" : ""}`}
              onClick={() => setCompareMode(m => !m)}
              title="Compare models side by side"
            >
              ⇄ Compare
            </button>
            <ExportMenu history={history} selectedModel={selectedModel} systemPrompt={systemPrompt} />
          </div>
        </div>
      </header>

      {showSystemPrompt && (
        <SystemPromptEditor value={systemPrompt} onChange={setSystemPrompt} onClose={() => setShowSystemPrompt(false)} />
      )}

      {compareMode ? (
        <CompareMode models={MODELS} systemPrompt={systemPrompt} />
      ) : (
        <>
          <ModelStrip models={MODELS} selected={selectedModel} onSelect={setSelectedModel} />
          <ChatWindow history={history} busy={busy} bottomRef={bottomRef} />
          <InputBar onSend={send} busy={busy} disabled={!selectedModel} onClear={clearChat} />
        </>
      )}
    </div>
  );
}
