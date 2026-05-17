import { useState } from "react";

const QUICK_PROMPTS = [
  { label: "9:16 Story", prompt: "Convert this design to 9:16" },
  { label: "16:9 YouTube", prompt: "Convert this design to 16:9" },
  { label: "Headline → Top", prompt: "Move the headline to the top" },
  { label: "Center Product", prompt: "Center the product image" },
  { label: "Badge Bigger", prompt: "Make the discount badge bigger" },
  { label: "Red Headline", prompt: "Change the headline color to red" },
];

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setText("");
  };

  return (
    <div
      style={{
        borderTop: "1px solid var(--color-border)",
        padding: "12px 14px 14px",
        background: "var(--color-surface)",
        flexShrink: 0,
      }}
    >
      {/* Quick prompt chips */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}
      >
        {QUICK_PROMPTS.map(({ label, prompt }) => (
          <button
            key={label}
            onClick={() => onSend(prompt)}
            disabled={loading}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--color-text-3)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "rgba(108,99,255,0.12)";
                e.currentTarget.style.borderColor = "rgba(108,99,255,0.35)";
                e.currentTarget.style.color = "var(--color-accent-2)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "var(--color-text-3)";
            }}
          >
            ⚡ {label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "flex-end",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14,
          padding: "6px 6px 6px 14px",
          transition: "border-color 0.2s",
        }}
        onFocusCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(108,99,255,0.5)")
        }
        onBlurCapture={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
        }
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Describe what to change…"
          disabled={loading}
          rows={2}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            padding: "4px 0",
            fontSize: 13,
            color: "var(--color-text-1)",
            resize: "none",
            outline: "none",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.55,
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            flexShrink: 0,
            background:
              !loading && text.trim()
                ? "linear-gradient(135deg,#6c63ff,#8b83ff)"
                : "rgba(255,255,255,0.05)",
            border: "none",
            cursor: !loading && text.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            boxShadow:
              !loading && text.trim()
                ? "0 4px 12px rgba(108,99,255,0.4)"
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
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke={text.trim() ? "#fff" : "rgba(255,255,255,0.25)"}
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
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
