import { useRef } from "react";

function SectionLabel({ color, children }) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 2,
          flexShrink: 0,
          background: color,
          display: "inline-block",
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-3)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function ImageField({ node, onFile, onUrl }) {
  const ref = useRef(null);
  const hasSrc = !!node.data?.src;
  const isBlob = node.data?.src?.startsWith("blob:");

  return (
    <div
      style={{
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 14,
      }}
    >
      {/* preview row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          borderBottom: "1px solid var(--color-border)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {/* thumbnail */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid var(--color-border-2)",
            background: "var(--color-surface-3)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasSrc ? (
            <img
              src={node.data.src}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="var(--color-text-3)"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          )}
        </div>
        {/* info + upload btn */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <SectionLabel color="#60a5fa">{node.name}</SectionLabel>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                fontSize: 10.5,
                color: hasSrc ? "var(--color-green)" : "var(--color-text-3)",
                fontFamily: "var(--font-mono)",
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {hasSrc
                ? isBlob
                  ? "📁 Local file"
                  : "🔗 External URL"
                : "No image"}
            </span>
            <button
              onClick={() => ref.current?.click()}
              style={{
                fontSize: 10.5,
                padding: "3px 9px",
                borderRadius: 6,
                background: "rgba(124,111,255,0.12)",
                border: "1px solid rgba(124,111,255,0.3)",
                color: "#a89fff",
                cursor: "pointer",
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(124,111,255,0.22)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(124,111,255,0.12)")
              }
            >
              Upload
            </button>
            <input
              ref={ref}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => onFile(node.id, e.target.files[0])}
            />
          </div>
        </div>
      </div>

      {/* URL row */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 12px" }}>
        <span
          style={{
            fontSize: 10,
            color: "var(--color-text-3)",
            fontFamily: "var(--font-mono)",
            flexShrink: 0,
            marginRight: 8,
          }}
        >
          url
        </span>
        <input
          type="text"
          placeholder="https://example.com/image.jpg"
          defaultValue={isBlob ? "" : node.data?.src || ""}
          onBlur={(e) => onUrl(node.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUrl(node.id, e.target.value);
              e.target.blur();
            }
          }}
          style={{
            flex: 1,
            fontSize: 11.5,
            padding: "8px 0",
            background: "transparent",
            border: "none",
            color: "var(--color-text-1)",
            outline: "none",
            fontFamily: "var(--font-mono)",
          }}
        />
      </div>
    </div>
  );
}

function TextField({ node, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <SectionLabel color="#fbbf24">{node.name}</SectionLabel>
      <textarea
        rows={node.name?.toLowerCase().includes("headline") ? 2 : 1}
        defaultValue={node.data?.content || ""}
        onBlur={(e) => onChange(node.id, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onChange(node.id, e.target.value);
            e.target.blur();
          }
        }}
        style={{
          width: "100%",
          fontSize: 12.5,
          padding: "8px 11px",
          background: "var(--color-surface-3)",
          border: "1px solid var(--color-border-2)",
          borderRadius: 8,
          color: "var(--color-text-1)",
          resize: "none",
          outline: "none",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.5,
          transition: "border-color 0.18s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(124,111,255,0.5)")}
      />
    </div>
  );
}

export default function EditPanel({ layout, updateLayout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  if (!artboard) return null;

  const allNodes =
    artboard.children?.map((id) => layout.nodes[id]).filter(Boolean) || [];
  const imageNodes = allNodes.filter((n) => n.type === "image");
  const textNodes = allNodes.filter((n) => n.type === "text");

  const handleFile = (nodeId, file) => {
    if (!file) return;
    updateLayout(nodeId, {
      data: { src: URL.createObjectURL(file), content: file.name },
    });
  };
  const handleUrl = (nodeId, url) => {
    if (url.trim()) updateLayout(nodeId, { data: { src: url.trim() } });
  };
  const handleText = (nodeId, content) => {
    updateLayout(nodeId, { data: { content } });
  };

  return (
    <div style={{ padding: "14px 14px" }}>
      {/* tip */}
      <div
        style={{
          padding: "9px 12px",
          borderRadius: 9,
          marginBottom: 18,
          background: "rgba(124,111,255,0.07)",
          border: "1px solid rgba(124,111,255,0.18)",
          fontSize: 11.5,
          color: "var(--color-text-2)",
          lineHeight: 1.55,
        }}
      >
        <strong style={{ color: "#a89fff" }}>Tip:</strong> Upload images or
        paste URLs here. Use the chat to move, resize, or restyle elements with
        AI.
      </div>

      {/* Images */}
      {imageNodes.length > 0 && (
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-3)",
              fontFamily: "var(--font-mono)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 16,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
            Images
            <span
              style={{
                flex: 1,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
          </div>
          {imageNodes.map((n) => (
            <ImageField
              key={n.id}
              node={n}
              onFile={handleFile}
              onUrl={handleUrl}
            />
          ))}
        </div>
      )}

      {/* Texts */}
      {textNodes.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-3)",
              fontFamily: "var(--font-mono)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 16,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
            Text
            <span
              style={{
                flex: 1,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
          </div>
          {textNodes.map((n) => (
            <TextField key={n.id} node={n} onChange={handleText} />
          ))}
        </div>
      )}

      {/* Shape nodes info */}
      {allNodes.filter((n) => n.type === "shape").length > 0 && (
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-text-3)",
              fontFamily: "var(--font-mono)",
              marginBottom: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 16,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
            Shapes
            <span
              style={{
                flex: 1,
                height: 1,
                background: "var(--color-border-2)",
                display: "inline-block",
              }}
            />
          </div>
          {allNodes
            .filter((n) => n.type === "shape")
            .map((n) => (
              <TextField key={n.id} node={n} onChange={handleText} />
            ))}
        </div>
      )}
    </div>
  );
}
