import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import WireframePreview from "./components/WireframePreview";
import JsonViewer from "./components/JsonViewer";
import EditPanel from "./components/EditPanel";
import { useLayoutAgent } from "./hooks/useLayoutAgent";

/* ── tiny reusable pieces ─────────────────────────────── */
function Logo() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        flexShrink: 0,
        background: "linear-gradient(135deg,#7c6fff 0%,#b49fff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          "0 0 0 1px rgba(124,111,255,0.3), 0 4px 16px rgba(124,111,255,0.35)",
      }}
    >
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    </div>
  );
}

function PanelHeader({ children, style }) {
  return (
    <div
      style={{
        padding: "0 16px",
        height: 44,
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderBottom: "1px solid var(--color-border)",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TabBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: active ? 600 : 400,
        background: active ? "rgba(124,111,255,0.14)" : "transparent",
        color: active ? "#a89fff" : "var(--color-text-3)",
        border: active
          ? "1px solid rgba(124,111,255,0.28)"
          : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.15s",
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

function StatusDot({ active }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: active ? "var(--color-yellow)" : "var(--color-green)",
        boxShadow: active
          ? "0 0 0 2px rgba(251,191,36,0.2)"
          : "0 0 0 2px rgba(52,211,153,0.2)",
        transition: "all 0.4s",
      }}
    />
  );
}

/* ── main app ─────────────────────────────────────────── */
export default function App() {
  const { layout, messages, loading, sendMessage, updateLayout, resetLayout } =
    useLayoutAgent();
  const [rightTab, setRightTab] = useState("preview");

  const artboard = layout.nodes[layout.rootNodes[0]];
  const ratio = artboard ? `${artboard.width}×${artboard.height}` : "";
  const aspectLabel =
    artboard?.width === 1080 && artboard?.height === 1080
      ? "1:1"
      : artboard?.width === 1080 && artboard?.height === 1920
        ? "9:16"
        : artboard?.width === 1920 && artboard?.height === 1080
          ? "16:9"
          : artboard?.width === 1080 && artboard?.height === 1350
            ? "4:5"
            : "Custom";

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
      {/* ══ HEADER ══════════════════════════════════════ */}
      <header
        style={{
          height: 54,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* left: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <Logo />
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
                fontSize: 10.5,
                color: "var(--color-text-3)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {artboard?.name} · {ratio}px
            </div>
          </div>
        </div>

        {/* center: aspect badges */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {["1:1", "9:16", "16:9", "4:5"].map((lbl) => (
            <div
              key={lbl}
              style={{
                fontSize: 10.5,
                padding: "3px 9px",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                background:
                  aspectLabel === lbl
                    ? "rgba(124,111,255,0.18)"
                    : "var(--color-surface-2)",
                border:
                  aspectLabel === lbl
                    ? "1px solid rgba(124,111,255,0.4)"
                    : "1px solid var(--color-border)",
                color: aspectLabel === lbl ? "#a89fff" : "var(--color-text-3)",
                transition: "all 0.2s",
              }}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* right: status + reset */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 11.5,
              color: loading ? "var(--color-yellow)" : "var(--color-green)",
              fontFamily: "var(--font-mono)",
              transition: "color 0.3s",
            }}
          >
            <StatusDot active={loading} />
            {loading ? "Thinking…" : "Ready"}
          </div>
          <button
            onClick={resetLayout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 500,
              padding: "6px 13px",
              borderRadius: 8,
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border-2)",
              color: "var(--color-text-2)",
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(248,113,113,0.5)";
              e.currentTarget.style.color = "var(--color-red)";
              e.currentTarget.style.background = "rgba(248,113,113,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border-2)";
              e.currentTarget.style.color = "var(--color-text-2)";
              e.currentTarget.style.background = "var(--color-surface-2)";
            }}
          >
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
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
        </div>
      </header>

      {/* ══ BODY (3-column) ══════════════════════════════ */}
      <div
        style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
      >
        {/* ── COL 1: CHAT ─────────────────────────── */}
        <div
          style={{
            width: 360,
            flexShrink: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-surface)",
            borderRight: "1px solid var(--color-border)",
          }}
        >
          <PanelHeader>
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="var(--color-text-3)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-text-2)",
              }}
            >
              Chat
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                color: "var(--color-text-3)",
                background: "var(--color-surface-3)",
                border: "1px solid var(--color-border)",
                borderRadius: 5,
                padding: "1px 7px",
              }}
            >
              {messages.length} msgs
            </span>
          </PanelHeader>

          {/* messages — takes all remaining space */}
          <ChatWindow messages={messages} loading={loading} />

          {/* input — pinned to bottom, never overlaps messages */}
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>

        {/* ── COL 2: PREVIEW / JSON ───────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-bg)",
            borderRight: "1px solid var(--color-border)",
          }}
        >
          <PanelHeader>
            <TabBtn
              label="Preview"
              active={rightTab === "preview"}
              onClick={() => setRightTab("preview")}
              icon={
                <svg
                  width="12"
                  height="12"
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
            />
            <TabBtn
              label="JSON"
              active={rightTab === "json"}
              onClick={() => setRightTab("json")}
              icon={
                <svg
                  width="12"
                  height="12"
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
            />
          </PanelHeader>

          <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
            {rightTab === "preview" ? (
              <WireframePreview layout={layout} />
            ) : (
              <JsonViewer layout={layout} />
            )}
          </div>
        </div>

        {/* ── COL 3: EDIT PANEL ───────────────────── */}
        <div
          style={{
            width: 300,
            flexShrink: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-surface)",
          }}
        >
          <PanelHeader>
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="var(--color-text-3)"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
              />
            </svg>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--color-text-2)",
              }}
            >
              Edit Content
            </span>
          </PanelHeader>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <EditPanel layout={layout} updateLayout={updateLayout} />
          </div>
        </div>
      </div>
    </div>
  );
}
