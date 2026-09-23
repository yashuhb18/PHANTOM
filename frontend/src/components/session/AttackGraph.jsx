import React from 'react';

export function AttackGraph({ graph, activeFrame }) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-12 text-center text-xs text-neutral-500">
        No attack graph generated for this session.
      </div>
    );
  }

  // Filter nodes up to activeFrame if time-travel is scrubbing
  const maxStep = activeFrame !== undefined ? activeFrame + 1 : 999;
  const visibleNodes = graph.nodes.filter((n) => n.step <= maxStep);
  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = (graph.edges || []).filter(
    (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
  );

  const nodeMap = new Map(visibleNodes.map((n) => [n.id, n]));

  return (
    <div className="bg-[#141414] border border-white/[0.06] rounded-[28px] p-6 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Causal Attack Graph</h3>
          <p className="text-[11px] text-neutral-400 mt-0.5">NetworkX Directed Acyclic Graph (DAG) linking causal progression</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FDE047]/10 text-[#FDE047] border border-[#FDE047]/30">
          NETWORKX ENGINE
        </span>
      </div>

      <div className="w-full overflow-x-auto border border-white/[0.06] rounded-2xl bg-[#0A0A0A] p-6 min-h-[300px] flex items-center justify-center">
        <svg width="1000" height="260" className="overflow-visible select-none">
          <defs>
            <marker
              id="arrowhead-yellow"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#FDE047" />
            </marker>
          </defs>

          {/* Edges */}
          {visibleEdges.map((edge, idx) => {
            const u = nodeMap.get(edge.source);
            const v = nodeMap.get(edge.target);
            if (!u || !v) return null;
            return (
              <g key={idx}>
                <line
                  x1={u.x + 60}
                  y1={u.y}
                  x2={v.x - 60}
                  y2={v.y}
                  stroke="#FDE047"
                  strokeWidth="1.5"
                  opacity="0.6"
                  markerEnd="url(#arrowhead-yellow)"
                />
                <text
                  x={(u.x + v.x) / 2}
                  y={(u.y + v.y) / 2 - 8}
                  fill="#A3A3A3"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.relation}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((node) => {
            const isCritical = node.severity === 'CRITICAL';
            const isHigh = node.severity === 'HIGH';
            const strokeColor = isCritical ? '#EF4444' : isHigh ? '#F59E0B' : '#FDE047';
            const fillColor = isCritical ? '#260B0E' : isHigh ? '#261C08' : '#171717';

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  x="-55"
                  y="-26"
                  width="110"
                  height="52"
                  rx="14"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  className="filter drop-shadow-lg"
                />
                <text
                  x="0"
                  y="-6"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {node.label.length > 14 ? node.label.slice(0, 12) + '..' : node.label}
                </text>
                <text
                  x="0"
                  y="10"
                  fill="#A3A3A3"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {node.source}
                </text>
                {node.risk_delta > 0 && (
                  <text
                    x="0"
                    y="21"
                    fill={strokeColor}
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    +{node.risk_delta} RISK
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
