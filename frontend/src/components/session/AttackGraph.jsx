import React from 'react';

export function AttackGraph({ graph, activeFrame }) {
  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-12 text-center text-xs text-[#78716C]">
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
    <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-semibold text-[#1C1917]">Causal Attack Graph</h3>
          <p className="text-[11px] text-[#78716C]">NetworkX Directed Acyclic Graph (DAG) linking causal progression</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
          NETWORKX ENGINE
        </span>
      </div>

      <div className="w-full overflow-x-auto border border-[#E7E5E4] rounded-lg bg-[#FAFAF9] p-4 min-h-[300px] flex items-center justify-center">
        <svg width="1000" height="260" className="overflow-visible select-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#A8A29E" />
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
                  stroke="#A8A29E"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <text
                  x={(u.x + v.x) / 2}
                  y={(u.y + v.y) / 2 - 8}
                  fill="#78716C"
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
            const strokeColor = isCritical ? '#DC2626' : isHigh ? '#D97706' : '#4F46E5';
            const fillColor = isCritical ? '#FEF2F2' : isHigh ? '#FFFBEB' : '#FFFFFF';

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  x="-55"
                  y="-26"
                  width="110"
                  height="52"
                  rx="8"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  className="filter drop-shadow-xs"
                />
                <text
                  x="0"
                  y="-6"
                  fill="#1C1917"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {node.label.length > 14 ? node.label.slice(0, 12) + '..' : node.label}
                </text>
                <text
                  x="0"
                  y="10"
                  fill="#78716C"
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
