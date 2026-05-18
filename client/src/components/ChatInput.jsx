import { useState } from "react";

const PROMPTS = [
  { label: "→ 9:16", text: "Convert this design to 9:16" },
  { label: "→ 16:9", text: "Convert this design to 16:9" },
  { label: "→ 1:1", text: "Convert this design to 1:1" },
  { label: "Headline top", text: "Move the headline to the top" },
  { label: "Center product", text: "Center the product image" },
  { label: "Badge bigger", text: "Make the discount badge bigger" },
  { label: "Headline red", text: "Change the headline color to red" },
];

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setText("");
  };

  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        padding: "10px 12px 12px",
      }}
    >
      {/* Quick chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          marginBottom: 10,
        }}
      >
        {PROMPTS.map(({ label, text: t }) => (
          <button
            key={label}
            onClick={() => onSend(t)}
            disabled={loading}
            style={{
              fontSize: 10.5,
              padding: "3px 9px",
              borderRadius: 99,
              background: "var(--color-surface-3)",
              border: "1px solid var(--color-border-2)",
              color: "var(--color-text-2)",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.45 : 1,
              fontFamily: "var(--font-mono)",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "rgba(124,111,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(124,111,255,0.4)";
                e.currentTarget.style.color = "#a89fff";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--color-surface-3)";
              e.currentTarget.style.borderColor = "var(--color-border-2)";
              e.currentTarget.style.color = "var(--color-text-2)";
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Textarea + send */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border-2)",
          borderRadius: 12,
          padding: "8px 8px 8px 13px",
          transition: "border-color 0.2s",
        }}
        onFocusCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(124,111,255,0.5)")
        }
        onBlurCapture={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border-2)")
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Describe what to change…"
          disabled={loading}
          rows={2}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: 0,
            fontSize: 13,
            color: "var(--color-text-1)",
            resize: "none",
            outline: "none",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.55,
          }}
        />
        <button
          onClick={submit}
          disabled={loading || !text.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            flexShrink: 0,
            background:
              !loading && text.trim()
                ? "linear-gradient(135deg,#7c6fff,#b49fff)"
                : "var(--color-surface-2)",
            border: "none",
            cursor: !loading && text.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            boxShadow:
              !loading && text.trim()
                ? "0 3px 12px rgba(124,111,255,0.4)"
                : "none",
          }}
        >
          {loading ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2.5"
              className="spin"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={text.trim() ? "#fff" : "rgba(255,255,255,0.2)"}
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
        </button>
      </div>
      <p
        style={{
          fontSize: 10,
          color: "var(--color-text-3)",
          marginTop: 6,
          fontFamily: "var(--font-mono)",
        }}
      >
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
