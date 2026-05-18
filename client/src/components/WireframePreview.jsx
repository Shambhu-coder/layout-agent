export default function WireframePreview({ layout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  if (!artboard) return null;

  const ar = artboard.height / artboard.width;

  return (
    <div>
      {/* Canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${ar * 100}%`,
          background: artboard.data?.backgroundColor || "#0c0d14",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--color-border-2)",
          boxShadow:
            "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        {/* Subtle dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle, rgba(124,111,255,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {artboard.children?.map((id) => {
          const node = layout.nodes[id];
          if (!node) return null;
          const vs = node.style?.visual || {};
          const isCircle = node.data?.shape === "circle";
          const pct = (v) => `${v * 100}%`;

          const base = {
            position: "absolute",
            zIndex: 2,
            left: pct(node.nx),
            top: pct(node.ny),
            width: pct(node.nw),
            height: pct(node.nh),
            overflow: "hidden",
            borderRadius: isCircle
              ? "50%"
              : vs.borderRadius
                ? `${vs.borderRadius}px`
                : "6px",
            transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
          };

          if (node.type === "image" && node.data?.src) {
            return (
              <div key={id} style={base}>
                <img
                  src={node.data.src}
                  alt={node.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: vs.opacity ?? 1,
                  }}
                />
              </div>
            );
          }

          if (node.type === "image") {
            return (
              <div
                key={id}
                style={{
                  ...base,
                  background: "rgba(96,165,250,0.12)",
                  border: "1px dashed rgba(96,165,250,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="rgba(96,165,250,0.5)"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
            );
          }

          if (node.type === "text") {
            return (
              <div
                key={id}
                style={{
                  ...base,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    vs.textAlign === "left"
                      ? "flex-start"
                      : vs.textAlign === "right"
                        ? "flex-end"
                        : "center",
                  padding: "2%",
                  backgroundColor: vs.backgroundColor || "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: `clamp(7px, ${node.nw * 5}vw, ${(vs.fontSize || 24) * node.nw * 0.9}px)`,
                    fontWeight: vs.fontWeight || "bold",
                    color: vs.color || "#ffffff",
                    textAlign: vs.textAlign || "center",
                    fontFamily: vs.fontFamily || "inherit",
                    lineHeight: 1.25,
                    wordBreak: "break-word",
                    width: "100%",
                  }}
                >
                  {node.data?.content || node.name}
                </span>
              </div>
            );
          }

          // shape
          return (
            <div
              key={id}
              style={{
                ...base,
                background: vs.backgroundColor || "rgba(248,113,113,0.2)",
                border: vs.backgroundColor
                  ? "none"
                  : "1px dashed rgba(248,113,113,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4%",
              }}
            >
              <span
                style={{
                  fontSize: `clamp(7px, ${node.nw * 4}vw, 14px)`,
                  color: vs.color || "#f87171",
                  fontWeight: vs.fontWeight || 700,
                  textAlign: "center",
                  lineHeight: 1.25,
                  wordBreak: "break-word",
                }}
              >
                {node.data?.content || node.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* info bar */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 10.5,
          color: "var(--color-text-3)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {[
            ["image", "#60a5fa", 2],
            ["text", "#fbbf24", 2],
            ["shape", "#f87171", 99],
          ].map(([t, c, r]) => (
            <span
              key={t}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: r,
                  background: c,
                  opacity: 0.6,
                  display: "inline-block",
                }}
              />
              {t}
            </span>
          ))}
        </div>
        <span>
          {artboard.width} × {artboard.height}px
        </span>
      </div>

      {/* Layers list */}
      <div
        style={{
          marginTop: 14,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "7px 12px",
            borderBottom: "1px solid var(--color-border)",
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text-3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Layers · {artboard.children?.length || 0}
        </div>
        {artboard.children?.map((id) => {
          const node = layout.nodes[id];
          if (!node) return null;
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 12px",
                borderBottom: "1px solid var(--color-border)",
                transition: "background 0.12s",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(124,111,255,0.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className={`badge-${node.type}`}
                style={{
                  fontSize: 9,
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {node.type}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--color-text-1)",
                  flex: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {node.name}
              </span>
              <span
                style={{
                  fontSize: 9.5,
                  color: "var(--color-text-3)",
                  fontFamily: "var(--font-mono)",
                  flexShrink: 0,
                }}
              >
                {Math.round(node.width)}×{Math.round(node.height)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
