"use client";

export function PageBackground() {
  const nodes = [
    { cx: 8, cy: 14, r: 2.2 },
    { cx: 18, cy: 26, r: 1.6 },
    { cx: 14, cy: 48, r: 2.0 },
    { cx: 26, cy: 38, r: 1.5 },
    { cx: 34, cy: 18, r: 2.4 },
    { cx: 48, cy: 12, r: 1.5 },
    { cx: 64, cy: 22, r: 2.2 },
    { cx: 78, cy: 15, r: 1.8 },
    { cx: 88, cy: 28, r: 2.5 },
    { cx: 74, cy: 44, r: 1.6 },
    { cx: 92, cy: 56, r: 2.0 },
    { cx: 82, cy: 74, r: 2.4 },
    { cx: 66, cy: 68, r: 1.5 },
    { cx: 52, cy: 82, r: 2.1 },
    { cx: 28, cy: 76, r: 1.8 },
    { cx: 12, cy: 84, r: 2.3 },
  ];

  const links = [
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [6, 9],
    [8, 9],
    [8, 10],
    [9, 12],
    [10, 11],
    [11, 12],
    [12, 13],
    [2, 14],
    [14, 15],
    [13, 14],
  ];

  return (
    <div
      aria-hidden="true"
      className="qtm-page-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Ambient cyan & violet corner glows */}
      <div
        className="absolute -top-[18%] -left-[10%] h-[55%] w-[55%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.13) 0%, rgba(59,130,246,0.05) 45%, transparent 72%)",
        }}
      />
      <div
        className="absolute -bottom-[20%] -right-[10%] h-[65%] w-[65%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(26,20,69,0.12) 50%, transparent 75%)",
        }}
      />
      <div
        className="absolute top-[30%] left-[42%] h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle QTM technical square grid */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,200,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(120,200,255,0.045) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at 50% 35%, black 25%, transparent 85%)",
        }}
      />

      {/* Constellation / Network Nodes & Connecting Lines SVG */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="qtm-network-svg absolute inset-0 h-full w-full opacity-65"
      >
        <g
          stroke="rgba(34, 211, 238, 0.16)"
          strokeWidth="0.12"
          strokeLinecap="round"
        >
          {links.map(([a, b], idx) => (
            <line
              key={idx}
              x1={nodes[a].cx}
              y1={nodes[a].cy}
              x2={nodes[b].cx}
              y2={nodes[b].cy}
            />
          ))}
        </g>
        {nodes.map((n, idx) => (
          <g key={idx} className="qtm-network-node">
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r * 0.35}
              fill={idx % 3 === 0 ? "#8B5CF6" : "#22D3EE"}
              fillOpacity="0.22"
            />
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r * 0.14}
              fill={idx % 3 === 0 ? "#C4B5FD" : "#67E8F9"}
              fillOpacity="0.75"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
