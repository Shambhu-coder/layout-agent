import { useEffect, useRef } from "react";

function Avatar({ role }) {
  if (role === "user") {
    return (
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          flexShrink: 0,
          background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#fff",
          boxShadow: "0 2px 8px rgba(108,99,255,0.4)",
        }}
      >
        U
      </div>
    );
  }
  return (
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        flexShrink: 0,
        background: "linear-gradient(135deg,#1a1d2e,#242840)",
        border: "1px solid rgba(108,99,255,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width="14"
        height="14"
        fill="none"
        stroke="#8b83ff"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
        />
      </svg>
    </div>
  );
}

function Message({ message }) {
  const isUser = message.role === "user";
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        marginBottom: 14,
        animation: "fadeUp 0.25s ease both",
      }}
    >
      <Avatar role={message.role} />
      <div
        style={{
          maxWidth: "80%",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
            color: isUser ? "rgba(139,131,255,0.7)" : "var(--color-text-3)",
          }}
        >
          {isUser ? "You" : "Layout Agent"}
        </span>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
            background: isUser
              ? "linear-gradient(135deg,#5b52e8,#7b73f5)"
              : "rgba(255,255,255,0.04)",
            border: isUser ? "none" : "1px solid rgba(255,255,255,0.07)",
            fontSize: 13,
            lineHeight: 1.65,
            color: isUser ? "#fff" : "var(--color-text-1)",
            whiteSpace: "pre-wrap",
            boxShadow: isUser ? "0 4px 16px rgba(91,82,232,0.35)" : "none",
            backdropFilter: isUser ? "none" : "blur(4px)",
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        marginBottom: 14,
      }}
    >
      <Avatar role="assistant" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span
          style={{
            fontSize: 10,
            color: "var(--color-text-3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Layout Agent
        </span>
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "4px 16px 16px 16px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {[0, 0.18, 0.36].map((d) => (
            <span
              key={d}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "inline-block",
                animation: `dotPulse 1.2s ease-in-out ${d}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "18px 16px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.15)} }
      `}</style>
      {messages.map((msg, i) => (
        <Message key={i} message={msg} />
      ))}
      {loading && <TypingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}
