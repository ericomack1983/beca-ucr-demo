/**
 * "Demo Only" corner ribbon — a fixed, non-interactive watermark pinned to the
 * top-right corner of every page. pointer-events: none so it never blocks the UI.
 */
export function DemoRibbon() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 144,
        height: 144,
        overflow: "hidden",
        zIndex: 2147483600,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 30,
          right: -44,
          width: 200,
          transform: "rotate(45deg)",
          textAlign: "center",
          background: "linear-gradient(135deg, #1a3de8 0%, #1434CB 50%, #0a1f7a 100%)",
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          padding: "6px 0",
          boxShadow: "0 6px 18px rgba(10,20,80,.35)",
          borderTop: "1px solid rgba(255,255,255,.3)",
          borderBottom: "1px solid rgba(0,0,0,.18)",
          fontFamily: "'Inter', system-ui, sans-serif",
        }}
      >
        Demo&nbsp;Only
      </div>
    </div>
  );
}
