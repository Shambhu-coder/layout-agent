import { useEffect, useRef } from "react";

function Avatar({ role }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isUser
          ? "linear-gradient(135deg,#7c6fff,#b49fff)"
          : "var(--color-surface-3)",
        border: isUser ? "none" : "1px solid var(--color-border-2)",
        boxShadow: isUser ? "0 2px 10px rgba(124,111,255,0.35)" : "none",
        fontSize: 11,
        fontWeight: 700,
        color: "#fff",
      }}
    >
      {isUser ? (
        "U"
      ) : (
        <svg
          width="13"
          height="13"
          fill="none"
          stroke="#a89fff"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
        </svg>
      )}
    </div>
  );
}

function Message({ msg, idx }) {
  const isUser = msg.role === "user";
  return (
    <div
      className="fade-up"
      style={{
        display: "flex",
        gap: 9,
        marginBottom: 16,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        animationDelay: `${Math.min(idx * 0.03, 0.3)}s`,
      }}
    >
      <Avatar role={msg.role} />
      <div
        style={{
          maxWidth: "82%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-3)",
            letterSpacing: "0.04em",
          }}
        >
          {isUser ? "You" : "Agent"}
        </span>
        <div
          style={{
            padding: "9px 13px",
            borderRadius: isUser ? "14px 3px 14px 14px" : "3px 14px 14px 14px",
            background: isUser
              ? "linear-gradient(135deg,#6a5eff,#9d91ff)"
              : "var(--color-surface-3)",
            border: isUser ? "none" : "1px solid var(--color-border-2)",
            fontSize: 13,
            lineHeight: 1.65,
            color: isUser ? "#fff" : "var(--color-text-1)",
            whiteSpace: "pre-wrap",
            boxShadow: isUser ? "0 4px 18px rgba(106,94,255,0.3)" : "none",
          }}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}

function Typing() {
  return (
    <div
      style={{
        display: "flex",
        gap: 9,
        marginBottom: 16,
        alignItems: "flex-start",
      }}
    >
      <Avatar role="assistant" />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-3)",
          }}
        >
          Agent
        </span>
        <div
          style={{
            padding: "11px 16px",
            borderRadius: "3px 14px 14px 14px",
            background: "var(--color-surface-3)",
            border: "1px solid var(--color-border-2)",
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`dot-${i + 1}`}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "inline-block",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, loading }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.map((m, i) => (
        <Message key={i} msg={m} idx={i} />
      ))}
      {loading && <Typing />}
      <div ref={ref} />
    </div>
  );
}
