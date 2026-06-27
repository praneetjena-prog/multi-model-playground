export default function ChatWindow({ history, busy, bottomRef }) {
  return (
    <div className="chat-window">
      {history.map((msg, i) => (
        <div key={i} className={`msg ${msg.role} ${msg.error ? "error" : ""}`}>
          <div className="avatar">
            {msg.role === "user" ? "You" : msg.model?.label?.[0] ?? "AI"}
          </div>
          <div className="bubble-wrap">
            <div className="bubble">{msg.content}</div>
            {msg.role === "assistant" && msg.model && (
              <div className="model-tag">
                {msg.model.label} · {msg.model.publisher}
              </div>
            )}
          </div>
        </div>
      ))}

      {busy && (
        <div className="msg assistant">
          <div className="avatar">AI</div>
          <div className="bubble-wrap">
            <div className="bubble typing">
              <span /><span /><span />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
