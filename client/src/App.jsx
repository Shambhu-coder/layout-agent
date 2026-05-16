import { useState, useRef } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import WireframePreview from "./components/WireframePreview";
import JsonViewer from "./components/JsonViewer";
import { useLayoutAgent } from "./hooks/useLayoutAgent";

function TabBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: active ? 600 : 400,
        background: active ? "rgba(108,99,255,0.15)" : "transparent",
        color: active ? "var(--color-accent-2)" : "var(--color-text-3)",
        border: active
          ? "1px solid rgba(108,99,255,0.3)"
          : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.18s",
        fontFamily: "var(--font-sans)",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--color-text-2)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--color-text-3)";
      }}
    >
      {icon} {label}
    </button>
  );
}

function StatusPill({ count }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(34,197,94,0.1)",
        border: "1px solid rgba(34,197,94,0.25)",
        borderRadius: 99,
        padding: "3px 10px",
        fontSize: 11,
        color: "var(--color-green)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--color-green)",
          display: "inline-block",
        }}
      />
      {count} messages
    </div>
  );
}

// Panel that lets the user directly edit images and text nodes
function EditPanel({ layout, updateLayout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  const fileRefs = useRef({});

  if (!artboard) return null;

  const imageNodes =
    artboard.children
      ?.map((id) => layout.nodes[id])
      .filter((n) => n && n.type === "image") || [];

  const textNodes =
    artboard.children
      ?.map((id) => layout.nodes[id])
      .filter((n) => n && n.type === "text") || [];

  const handleImageFile = (nodeId, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateLayout(nodeId, { data: { src: url, content: file.name } });
  };

  const handleImageUrl = (nodeId, url) => {
    updateLayout(nodeId, { data: { src: url } });
  };

  const handleTextChange = (nodeId, content) => {
    updateLayout(nodeId, { data: { content } });
  };

  return (
    <div
      style={{
        borderTop: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          padding: "8px 14px",
          fontSize: 10,
          fontWeight: 600,
          color: "var(--color-text-3)",
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <svg
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
          />
        </svg>
        Edit Content
      </div>

      <div
        style={{
          padding: "10px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Image nodes */}
        {imageNodes.map((node) => (
          <div key={node.id}>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-3)",
                marginBottom: 5,
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 1,
                  background: "rgba(59,130,246,0.5)",
                  display: "inline-block",
                }}
              />
              {node.name}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {/* Upload button */}
              <button
                onClick={() => fileRefs.current[node.id]?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  padding: "5px 10px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border-2)",
                  borderRadius: 7,
                  color: "var(--color-text-2)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Upload
              </button>
              <input
                ref={(el) => (fileRefs.current[node.id] = el)}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageFile(node.id, e.target.files[0])}
              />
              {/* URL input */}
              <input
                type="text"
                placeholder="or paste image URL…"
                defaultValue={node.data?.src || ""}
                onBlur={(e) => handleImageUrl(node.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleImageUrl(node.id, e.target.value);
                }}
                style={{
                  flex: 1,
                  fontSize: 11,
                  padding: "5px 9px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border-2)",
                  borderRadius: 7,
                  color: "var(--color-text-1)",
                  outline: "none",
                  fontFamily: "var(--font-mono)",
                  minWidth: 0,
                }}
              />
            </div>
          </div>
        ))}

        {/* Text nodes */}
        {textNodes.map((node) => (
          <div key={node.id}>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-3)",
                marginBottom: 5,
                fontFamily: "var(--font-mono)",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 1,
                  background: "rgba(245,158,11,0.5)",
                  display: "inline-block",
                }}
              />
              {node.name}
            </div>
            <textarea
              rows={node.name === "Headline" ? 2 : 1}
              defaultValue={node.data?.content || ""}
              onBlur={(e) => handleTextChange(node.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleTextChange(node.id, e.target.value);
                  e.target.blur();
                }
              }}
              style={{
                width: "100%",
                fontSize: 12,
                padding: "6px 9px",
                background: "var(--color-surface-2)",
                border: "1px solid var(--color-border-2)",
                borderRadius: 7,
                color: "var(--color-text-1)",
                resize: "none",
                outline: "none",
                fontFamily: "var(--font-sans)",
                lineHeight: 1.5,
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { layout, messages, loading, sendMessage, updateLayout, resetLayout } =
    useLayoutAgent();
  const [tab, setTab] = useState("preview");

  const artboard = layout.nodes[layout.rootNodes[0]];
  const msgCount = messages.filter(
    (m) => m.role !== "assistant" || messages.indexOf(m) > 0,
  ).length;

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 56,
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108,99,255,0.4)",
            }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-text-1)",
                lineHeight: 1.2,
              }}
            >
              Layout Agent
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text-3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {artboard?.name} · {artboard?.width}×{artboard?.height}px
            </div>
          </div>
        </div>

        <StatusPill count={msgCount} />

        <button
          onClick={resetLayout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--color-text-3)",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border-2)",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
            transition: "all 0.18s",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-red)";
            e.currentTarget.style.color = "var(--color-red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-2)";
            e.currentTarget.style.color = "var(--color-text-3)";
          }}
        >
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Reset
        </button>
      </header>

      {/* ── Body ── */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* ── Left: Chat + Edit Panel ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 400,
            flexShrink: 0,
            borderRight: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            minHeight: 0,
          }}
        >
          {/* Chat status */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: loading
                  ? "var(--color-yellow)"
                  : "var(--color-green)",
                boxShadow: loading
                  ? "0 0 8px var(--color-yellow)"
                  : "0 0 8px var(--color-green)",
                transition: "all 0.3s",
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-text-2)",
                letterSpacing: "0.04em",
              }}
            >
              {loading ? "Thinking…" : "Ready"}
            </span>
          </div>

          <ChatWindow messages={messages} loading={loading} />

          {/* Edit panel: images + text */}
          <EditPanel layout={layout} updateLayout={updateLayout} />

          <ChatInput onSend={sendMessage} loading={loading} />
        </div>

        {/* ── Right: Preview / JSON ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              flexShrink: 0,
            }}
          >
            <TabBtn
              label="Wireframe"
              icon={
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              }
              active={tab === "preview"}
              onClick={() => setTab("preview")}
            />
            <TabBtn
              label="JSON"
              icon={
                <svg
                  width="13"
                  height="13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                  />
                </svg>
              }
              active={tab === "json"}
              onClick={() => setTab("json")}
            />

            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {[
                ["1:1", 1080, 1080],
                ["9:16", 1080, 1920],
                ["16:9", 1920, 1080],
              ].map(([label, w, h]) => {
                const active = artboard?.width === w && artboard?.height === h;
                return (
                  <div
                    key={label}
                    style={{
                      fontSize: 10,
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontFamily: "var(--font-mono)",
                      background: active
                        ? "rgba(108,99,255,0.2)"
                        : "var(--color-surface-2)",
                      border: active
                        ? "1px solid rgba(108,99,255,0.4)"
                        : "1px solid var(--color-border)",
                      color: active
                        ? "var(--color-accent-2)"
                        : "var(--color-text-3)",
                      transition: "all 0.2s",
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {tab === "preview" ? (
              <WireframePreview layout={layout} />
            ) : (
              <JsonViewer layout={layout} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
