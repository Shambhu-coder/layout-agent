import { useState } from "react";

function hl(json) {
  return JSON.stringify(json, null, 2).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      if (/^"/.test(m))
        return /:$/.test(m)
          ? `<span class="json-key">${m}</span>`
          : `<span class="json-string">${m}</span>`;
      if (/true|false/.test(m)) return `<span class="json-bool">${m}</span>`;
      if (/null/.test(m)) return `<span class="json-null">${m}</span>`;
      return `<span class="json-number">${m}</span>`;
    },
  );
}

export default function JsonViewer({ layout }) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: 10,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-3)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 6,
            padding: "3px 9px",
          }}
        >
          {Object.keys(layout.nodes || {}).length} nodes
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button
            onClick={() => setCollapsed((c) => !c)}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border-2)",
              color: "var(--color-text-2)",
              fontFamily: "var(--font-mono)",
              transition: "all 0.15s",
            }}
          >
            {collapsed ? "Expand" : "Collapse"}
          </button>
          <button
            onClick={copy}
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
              background: copied
                ? "rgba(52,211,153,0.1)"
                : "var(--color-surface)",
              border: `1px solid ${copied ? "rgba(52,211,153,0.35)" : "var(--color-border-2)"}`,
              color: copied ? "var(--color-green)" : "var(--color-text-2)",
              fontFamily: "var(--font-mono)",
              transition: "all 0.2s",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          padding: 14,
        }}
      >
        {collapsed ? (
          <pre
            style={{
              fontSize: 11.5,
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-3)",
              margin: 0,
            }}
          >
            {"// Collapsed — click Expand"}
          </pre>
        ) : (
          <pre
            style={{
              fontSize: 11.5,
              fontFamily: "var(--font-mono)",
              margin: 0,
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: hl(layout) }}
          />
        )}
      </div>
    </div>
  );
}
