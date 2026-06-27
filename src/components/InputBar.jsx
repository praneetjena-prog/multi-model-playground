import { useState, useRef } from "react";

export default function InputBar({ onSend, busy, disabled, onClear }) {
  const [text, setText] = useState("");
  const ref = useRef(null);

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!text.trim() || busy || disabled) return;
    onSend(text.trim());
    setText("");
    ref.current.style.height = "auto";
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <div className="input-bar">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => { setText(e.target.value); autoResize(e); }}
        onKeyDown={handleKey}
        placeholder={disabled ? "Select a model above to start chatting…" : "Type a message… (Enter to send, Shift+Enter for newline)"}
        disabled={busy || disabled}
      />
      <div className="input-actions">
        <button className="clear-btn" onClick={onClear} title="Clear chat">
          Clear
        </button>
        <button className="send-btn" onClick={submit} disabled={busy || disabled || !text.trim()}>
          {busy ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}
