import { useState, useRef, useEffect } from "react";

export default function ExportMenu({ history, selectedModel, systemPrompt }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const messages = history.filter((m) => m.role !== "assistant" || m.model);

  function exportMarkdown() {
    const lines = [];
    if (systemPrompt) lines.push(`> **System:** ${systemPrompt}\n`);
    messages.forEach((m) => {
      const label = m.role === "user" ? "**You**" : `**${m.model?.label ?? "AI"}**`;
      lines.push(`${label}\n\n${m.content}\n`);
    });
    download("conversation.md", lines.join("\n---\n\n"), "text/markdown");
    setOpen(false);
  }

  function exportJSON() {
    const data = {
      exported_at: new Date().toISOString(),
      model: selectedModel?.label ?? null,
      system_prompt: systemPrompt || null,
      messages: messages.map(({ role, content, model }) => ({
        role,
        content,
        model: model?.label ?? null,
      })),
    };
    download("conversation.json", JSON.stringify(data, null, 2), "application/json");
    setOpen(false);
  }

  function exportText() {
    const lines = [];
    if (systemPrompt) lines.push(`[System]: ${systemPrompt}\n`);
    messages.forEach((m) => {
      const label = m.role === "user" ? "You" : (m.model?.label ?? "AI");
      lines.push(`[${label}]: ${m.content}`);
    });
    download("conversation.txt", lines.join("\n\n"), "text/plain");
    setOpen(false);
  }

  function copyToClipboard() {
    const lines = [];
    if (systemPrompt) lines.push(`[System]: ${systemPrompt}\n`);
    messages.forEach((m) => {
      const label = m.role === "user" ? "You" : (m.model?.label ?? "AI");
      lines.push(`[${label}]: ${m.content}`);
    });
    navigator.clipboard.writeText(lines.join("\n\n"));
    setOpen(false);
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="export-menu-wrap" ref={ref}>
      <button
        className="tool-btn"
        onClick={() => setOpen((o) => !o)}
        title="Export conversation"
        disabled={!hasMessages}
      >
        ↓ Export
      </button>
      {open && (
        <div className="export-dropdown">
          <button onClick={exportMarkdown}>📄 Markdown (.md)</button>
          <button onClick={exportJSON}>🗂 JSON (.json)</button>
          <button onClick={exportText}>📝 Plain text (.txt)</button>
          <div className="export-divider" />
          <button onClick={copyToClipboard}>📋 Copy to clipboard</button>
        </div>
      )}
    </div>
  );
}
