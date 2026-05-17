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
      {icon}
      {label}
    </button>
  );
}

function EditPanel({ layout, updateLayout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  const fileRefs = useRef({});
  const [expanded, setExpanded] = useState(true);

  if (!artboard) return null;

  const imageNodes =
    artboard.children
      ?.map((id) => layout.nodes[id])
      .filter((n) => n?.type === "image") || [];
  const textNodes =
    artboard.children
      ?.map((id) => layout.nodes[id])
      .filter((n) => n?.type === "text") || [];

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
    <div
      style={{
        borderTop: "1px solid var(--color-border)",
        flexShrink: 0,
        background: "#0e1017",
      }}
    >
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded((p) => !p)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          borderBottom: expanded ? "1px solid var(--color-border)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              background: "rgba(108,99,255,0.15)",
              border: "1px solid rgba(108,99,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="10"
              height="10"
              fill="none"
              stroke="#8b83ff"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-text-2)",
              letterSpacing: "0.02em",
            }}
          >
            Edit Content
          </span>
          <span
            style={{
              fontSize: 10,
              color: "var(--color-text-3)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: 99,
              padding: "1px 7px",
              fontFamily: "var(--font-mono)",
            }}
          >
            {imageNodes.length + textNodes.length} fields
          </span>
        </div>
        <svg
          width="12"
          height="12"
          fill="none"
          stroke="var(--color-text-3)"
          strokeWidth="2.2"
          viewBox="0 0 24 24"
          style={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {expanded && (
        <div
          style={{
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {/* Images */}
          {imageNodes.map((node) => (
            <div key={node.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    background: "#3b82f6",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "var(--color-text-3)",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {node.name}
                </span>
              </div>
              <div
                style={{
                  border: "1px solid var(--color-border-2)",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--color-surface-2)",
                }}
              >
                {/* Preview strip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 12px",
                    borderBottom: "1px solid var(--color-border)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 7,
                      overflow: "hidden",
                      border: "1px solid var(--color-border)",
                      flexShrink: 0,
                      background: "var(--color-surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {node.data?.src ? (
                      <img
                        src={node.data.src}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <svg
                        width="14"
                        height="14"
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
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-2)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 3,
                      }}
                    >
                      {node.data?.src
                        ? node.data.src.startsWith("blob:")
                          ? "📁 Local file"
                          : "🔗 URL"
                        : "No image set"}
                    </div>
                    <button
                      onClick={() => fileRefs.current[node.id]?.click()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        padding: "3px 9px",
                        background: "rgba(108,99,255,0.12)",
                        border: "1px solid rgba(108,99,255,0.3)",
                        borderRadius: 5,
                        color: "var(--color-accent-2)",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontFamily: "var(--font-sans)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(108,99,255,0.22)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(108,99,255,0.12)")
                      }
                    >
                      <svg
                        width="10"
                        height="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      Upload file
                    </button>
                  </div>
                  <input
                    ref={(el) => (fileRefs.current[node.id] = el)}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(node.id, e.target.files[0])}
                  />
                </div>
                {/* URL input */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0,
                    padding: "0",
                  }}
                >
                  <span
                    style={{
                      padding: "0 10px",
                      fontSize: 11,
                      color: "var(--color-text-3)",
                      flexShrink: 0,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    url
                  </span>
                  <input
                    type="text"
                    placeholder="https://..."
                    defaultValue={
                      node.data?.src?.startsWith("blob:")
                        ? ""
                        : node.data?.src || ""
                    }
                    onBlur={(e) => handleUrl(node.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUrl(node.id, e.target.value);
                        e.target.blur();
                      }
                    }}
                    style={{
                      flex: 1,
                      fontSize: 11.5,
                      padding: "9px 10px 9px 0",
                      background: "transparent",
                      border: "none",
                      color: "var(--color-text-1)",
                      outline: "none",
                      fontFamily: "var(--font-mono)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Text nodes */}
          {textNodes.map((node) => (
            <div key={node.id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 7,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 1,
                    background: "#f59e0b",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "var(--color-text-3)",
                    fontFamily: "var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {node.name}
                </span>
              </div>
              <textarea
                rows={node.name === "Headline" ? 2 : 1}
                defaultValue={node.data?.content || ""}
                onBlur={(e) => handleText(node.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleText(node.id, e.target.value);
                    e.target.blur();
                  }
                }}
                style={{
                  width: "100%",
                  fontSize: 12.5,
                  padding: "9px 12px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border-2)",
                  borderRadius: 8,
                  color: "var(--color-text-1)",
                  resize: "none",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.5,
                  boxSizing: "border-box",
                  transition: "border-color 0.18s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border-2)";
                  handleText(node.id, e.target.value);
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { layout, messages, loading, sendMessage, updateLayout, resetLayout } =
    useLayoutAgent();
  const [tab, setTab] = useState("preview");
  const artboard = layout.nodes[layout.rootNodes[0]];
  const msgCount = messages.filter(
    (m, i) => m.role === "user" || (m.role === "assistant" && i > 0),
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
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          height: 54,
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-surface)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108,99,255,0.35)",
            }}
          >
            <svg
              width="15"
              height="15"
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
                fontSize: 13.5,
                fontWeight: 700,
                color: "var(--color-text-1)",
                lineHeight: 1.2,
              }}
            >
              Layout Agent
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: "var(--color-text-3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {artboard?.name} · {artboard?.width}×{artboard?.height}px
            </div>
          </div>
        </div>

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
          {msgCount} messages
        </div>

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

      {/* Body */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* Left panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 380,
            flexShrink: 0,
            borderRight: "1px solid var(--color-border)",
            background: "var(--color-surface)",
            minHeight: 0,
          }}
        >
          {/* Status */}
          <div
            style={{
              padding: "9px 16px",
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
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--color-text-2)",
                letterSpacing: "0.03em",
              }}
            >
              {loading ? "Thinking…" : "Ready"}
            </span>
          </div>

          {/* Chat (scrollable) */}
          <ChatWindow messages={messages} loading={loading} />

          {/* Edit content panel */}
          <EditPanel layout={layout} updateLayout={updateLayout} />

          {/* Chat input (pinned bottom) */}
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>

        {/* Right panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
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
                  style={{ marginRight: 2 }}
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
                  style={{ marginRight: 2 }}
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
