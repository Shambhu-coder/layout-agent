export default function WireframePreview({ layout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  if (!artboard) return null;

  const ar = artboard.height / artboard.width;

  const colors = {
    image: {
      bg: "rgba(59,130,246,0.15)",
      border: "rgba(59,130,246,0.4)",
      text: "#7eb3ff",
    },
    text: {
      bg: "rgba(245,158,11,0.12)",
      border: "rgba(245,158,11,0.4)",
      text: "#fbbf24",
    },
    shape: {
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.4)",
      text: "#f87171",
    },
  };

  return (
    <div>
      {/* Canvas */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${ar * 100}%`,
          background: artboard.data?.backgroundColor || "#0d0d1a",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--color-border-2)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(108,99,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(108,99,255,0.04) 1px,transparent 1px)",
            backgroundSize: "10% 10%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {artboard.children?.map((id) => {
          const node = layout.nodes[id];
          if (!node) return null;
          const c = colors[node.type] || colors.shape;
          const isCircle = node.data?.shape === "circle";
          const pct = (v) => `${v * 100}%`;
          const vs = node.style?.visual || {};

          const baseStyle = {
            position: "absolute",
            left: pct(node.nx),
            top: pct(node.ny),
            width: pct(node.nw),
            height: pct(node.nh),
            borderRadius: isCircle ? "50%" : vs.borderRadius || 6,
            overflow: "hidden",
            transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 2,
          };

          // ── IMAGE node ──
          if (node.type === "image" && node.data?.src) {
            return (
              <div key={id} style={{ ...baseStyle }}>
                <img
                  src={node.data.src}
                  alt={node.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: vs.opacity ?? 1,
                    display: "block",
                  }}
                />
              </div>
            );
          }

          // ── TEXT node ──
          if (node.type === "text") {
            return (
              <div
                key={id}
                style={{
                  ...baseStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    vs.textAlign === "left"
                      ? "flex-start"
                      : vs.textAlign === "right"
                        ? "flex-end"
                        : "center",
                  padding: "1%",
                  backgroundColor: vs.backgroundColor || "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: `clamp(8px, ${node.nw * 4}vw, ${vs.fontSize ? vs.fontSize * (node.nw / 0.8) + "px" : "14px"})`,
                    fontWeight: vs.fontWeight || "normal",
                    color: vs.color || "#ffffff",
                    textAlign: vs.textAlign || "center",
                    fontFamily: vs.fontFamily || "inherit",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                    width: "100%",
                    padding: vs.padding || "0",
                  }}
                >
                  {node.data?.content || node.name}
                </span>
              </div>
            );
          }

          // ── SHAPE node ──
          return (
            <div
              key={id}
              style={{
                ...baseStyle,
                background: vs.backgroundColor || c.bg,
                border: vs.backgroundColor ? "none" : `1px solid ${c.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2%",
              }}
            >
              <span
                style={{
                  fontSize: `clamp(7px, ${node.nw * 3}vw, 13px)`,
                  color: vs.color || c.text,
                  fontWeight: vs.fontWeight || 600,
                  textAlign: "center",
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {node.data?.content || node.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Canvas info bar */}
      <div
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--color-text-3)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "rgba(59,130,246,0.5)",
                display: "inline-block",
              }}
            />
            image
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "rgba(245,158,11,0.5)",
                display: "inline-block",
              }}
            />
            text
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 99,
                background: "rgba(239,68,68,0.5)",
                display: "inline-block",
              }}
            />
            shape
          </span>
        </div>
        <span>
          {artboard.width} × {artboard.height}px
        </span>
      </div>

      {/* Node list */}
      <div
        style={{
          marginTop: 12,
          background: "var(--color-surface-2)",
          border: "1px solid var(--color-border)",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid var(--color-border)",
            fontSize: 10,
            color: "var(--color-text-3)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Layers
        </div>
        {artboard.children?.map((id) => {
          const node = layout.nodes[id];
          if (!node) return null;
          const badgeCls = `badge-${node.type}`;
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderBottom: "1px solid var(--color-border)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(108,99,255,0.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className={badgeCls}
                style={{
                  fontSize: 9,
                  padding: "2px 6px",
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
                  fontSize: 12.5,
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
                  fontSize: 10,
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
