import { useState, useRef, useEffect } from "react";
import ModelStrip from "./components/ModelStrip";
import ChatWindow from "./components/ChatWindow";
import InputBar from "./components/InputBar";
import { MODELS } from "./models";
import { callModel } from "./api";
import "./App.css";

export default function App() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [history, setHistory] = useState([
    { role: "assistant", content: "Hello! Pick a model above and ask me anything.", model: null },
  ]);
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef(null);

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
      const reply = await callModel(selectedModel, next.filter((m) => m.role !== "assistant" || m.model));
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
        <h1>GitHub Models Playground</h1>
        <p>Chat with open and proprietary models via the GitHub Models catalog</p>
      </header>
      <ModelStrip models={MODELS} selected={selectedModel} onSelect={setSelectedModel} />
      <ChatWindow history={history} busy={busy} bottomRef={bottomRef} />
      <InputBar onSend={send} busy={busy} disabled={!selectedModel} onClear={clearChat} />
    </div>
  );
}
