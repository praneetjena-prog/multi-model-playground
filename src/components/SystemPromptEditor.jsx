export default function SystemPromptEditor({ value, onChange, onClose }) {
  return (
    <div className="system-prompt-panel">
      <div className="system-prompt-header">
        <span>System Prompt</span>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {value && (
            <button className="clear-inline-btn" onClick={() => onChange("")}>Clear</button>
          )}
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      <textarea
        className="system-prompt-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="You are a helpful assistant. Give concise answers. Reply in markdown when useful..."
        rows={4}
      />
      <div className="system-prompt-hint">
        This is prepended to every conversation as a system message. Changes take effect on your next message.
      </div>
    </div>
  );
}
