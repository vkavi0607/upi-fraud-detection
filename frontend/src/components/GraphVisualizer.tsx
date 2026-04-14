import { useState, useEffect, useRef } from 'react';
import { Network, ZoomIn, ZoomOut, RotateCcw, Info, X } from 'lucide-react';

type NodeType = 'mule' | 'suspect' | 'normal' | 'device';
interface GraphNode {
  id: string; label: string; x: number; y: number;
  type: NodeType; score?: number; txCount?: number;
}
interface GraphEdge { from: string; to: string; weight: number; flagged: boolean; }

const INITIAL_NODES: GraphNode[] = [
  { id: 'n1',  label: 'UPI*9876',  x: 50, y: 50, type: 'mule',    score: 98, txCount: 341 },
  { id: 'n2',  label: 'UPI*4421',  x: 22, y: 22, type: 'suspect', score: 88, txCount: 87  },
  { id: 'n3',  label: 'UPI*7710',  x: 72, y: 28, type: 'normal',  score: 12, txCount: 14  },
  { id: 'n4',  label: 'UPI*3318',  x: 40, y: 80, type: 'suspect', score: 83, txCount: 54  },
  { id: 'n5',  label: 'UPI*9990',  x: 75, y: 72, type: 'mule',    score: 95, txCount: 210 },
  { id: 'n6',  label: 'DEV-A1',    x: 18, y: 58, type: 'device',  score: 71, txCount: 28  },
  { id: 'n7',  label: 'UPI*1122',  x: 62, y: 10, type: 'normal',  score: 8,  txCount: 6   },
  { id: 'n8',  label: 'UPI*5544',  x: 85, y: 48, type: 'suspect', score: 79, txCount: 66  },
  { id: 'n9',  label: 'DEV-B3',    x: 30, y: 35, type: 'device',  score: 65, txCount: 33  },
  { id: 'n10', label: 'UPI*8877',  x: 58, y: 60, type: 'normal',  score: 18, txCount: 9   },
];

const INITIAL_EDGES: GraphEdge[] = [
  { from:'n1', to:'n2', weight:3, flagged:true  },
  { from:'n1', to:'n5', weight:4, flagged:true  },
  { from:'n1', to:'n4', weight:2, flagged:true  },
  { from:'n2', to:'n6', weight:2, flagged:false },
  { from:'n2', to:'n9', weight:1, flagged:false },
  { from:'n3', to:'n1', weight:1, flagged:false },
  { from:'n4', to:'n5', weight:3, flagged:true  },
  { from:'n5', to:'n8', weight:2, flagged:true  },
  { from:'n7', to:'n3', weight:1, flagged:false },
  { from:'n8', to:'n1', weight:3, flagged:true  },
  { from:'n9', to:'n1', weight:2, flagged:true  },
  { from:'n10',to:'n3', weight:1, flagged:false },
];

const NODE_COLOR: Record<NodeType, { fill: string; stroke: string; glow: string }> = {
  mule:    { fill:'#fca5a5', stroke:'#ef4444', glow:'rgba(239,68,68,0.6)' },
  suspect: { fill:'#fcd34d', stroke:'#f59e0b', glow:'rgba(245,158,11,0.5)' },
  device:  { fill:'#a5b4fc', stroke:'#6366f1', glow:'rgba(99,102,241,0.5)' },
  normal:  { fill:'#6ee7b7', stroke:'#10b981', glow:'rgba(16,185,129,0.4)' },
};

function pct(v: number, dim: number) { return (v / 100) * dim; }

export const GraphVisualizer = () => {
  const svgRef     = useRef<SVGSVGElement>(null);
  const [nodes, setNodes]   = useState(INITIAL_NODES);
  const [zoom,  setZoom]    = useState(1);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [pulse, setPulse]   = useState<string[]>([]);
  const [dim, setDim]       = useState({ w: 800, h: 500 });

  // Measure container
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(e => {
      const { width, height } = e[0].contentRect;
      setDim({ w: Math.max(400, width), h: Math.max(300, height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animate nodes: slightly jitter positions every 2s
  useEffect(() => {
    const id = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        x: Math.max(8, Math.min(92, n.x + (Math.random() * 2 - 1))),
        y: Math.max(8, Math.min(92, n.y + (Math.random() * 2 - 1))),
        score: Math.max(5, Math.min(99, (n.score ?? 50) + Math.floor(Math.random() * 5 - 2))),
      })));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Pulse random flagged edges
  useEffect(() => {
    const id = setInterval(() => {
      const flaggedEdge = INITIAL_EDGES.filter(e => e.flagged)[Math.floor(Math.random() * INITIAL_EDGES.filter(e=>e.flagged).length)];
      setPulse([flaggedEdge.from, flaggedEdge.to]);
      setTimeout(() => setPulse([]), 800);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
  const W = dim.w, H = dim.h;
  const nodeR = (n: GraphNode) => n.type === 'mule' ? 22 : n.type === 'device' ? 14 : 18;

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl flex flex-col h-full w-full overflow-hidden relative">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex justify-between items-center bg-slate-900/80 backdrop-blur-md z-10 flex-shrink-0">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Network className="text-indigo-400" size={18}/> Neo4j Fraud Topology — Cluster Alpha-7
          <span className="text-xs font-semibold text-slate-500 ml-2">{nodes.length} nodes · {INITIAL_EDGES.length} edges</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="flex items-center gap-3 mr-3 text-[11px] font-semibold">
            {[['Mule','#ef4444'],['Suspect','#f59e0b'],['Device','#6366f1'],['Normal','#10b981']].map(([l,c]) => (
              <span key={l} className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c as string }}/>
                {l}
              </span>
            ))}
          </div>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><ZoomIn size={16}/></button>
          <button onClick={() => setZoom(z => Math.max(0.4, z - 0.2))} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><ZoomOut size={16}/></button>
          <button onClick={() => { setZoom(1); setSelected(null); }} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><RotateCcw size={16}/></button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 0 }}>
        <svg ref={svgRef} width="100%" height="100%" className="absolute inset-0"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.3s ease' }}
        >
          <defs>
            {Object.entries(NODE_COLOR).map(([type, c]) => (
              <filter key={type} id={`glow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            ))}
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#475569"/>
            </marker>
            <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#ef4444"/>
            </marker>
          </defs>

          {/* Background grid */}
          {Array.from({ length: Math.ceil(W/40) }).map((_, i) => (
            <line key={'gx'+i} x1={i*40} y1={0} x2={i*40} y2={H} stroke="#1e293b" strokeWidth="1"/>
          ))}
          {Array.from({ length: Math.ceil(H/40) }).map((_, i) => (
            <line key={'gy'+i} x1={0} y1={i*40} x2={W} y2={i*40} stroke="#1e293b" strokeWidth="1"/>
          ))}

          {/* Edges */}
          {INITIAL_EDGES.map((e, i) => {
            const a = nodeMap[e.from], b = nodeMap[e.to];
            if (!a || !b) return null;
            const isPulsing = pulse.includes(e.from) && pulse.includes(e.to);
            return (
              <line key={i}
                x1={pct(a.x, W)} y1={pct(a.y, H)}
                x2={pct(b.x, W)} y2={pct(b.y, H)}
                stroke={e.flagged ? (isPulsing ? '#ef4444' : '#991b1b') : '#334155'}
                strokeWidth={e.flagged ? e.weight + 1 : e.weight}
                strokeOpacity={e.flagged ? 0.8 : 0.4}
                strokeDasharray={e.flagged ? '0' : '4 3'}
                markerEnd={e.flagged ? 'url(#arrow-red)' : 'url(#arrow)'}
                style={{ transition: 'stroke 0.4s, stroke-opacity 0.4s' }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map(n => {
            const c = NODE_COLOR[n.type];
            const r = nodeR(n);
            const cx = pct(n.x, W), cy = pct(n.y, H);
            const isSelected = selected?.id === n.id;
            const isPulsing  = pulse.includes(n.id);
            return (
              <g key={n.id} onClick={() => setSelected(isSelected ? null : n)} style={{ cursor: 'pointer' }}>
                {/* Glow ring */}
                {(n.type === 'mule' || isPulsing) && (
                  <circle cx={cx} cy={cy} r={r + 8} fill={c.glow} opacity={isPulsing ? 0.7 : 0.3}
                    style={{ animation: 'ping 1.5s ease infinite' }}/>
                )}
                {/* Selection ring */}
                {isSelected && <circle cx={cx} cy={cy} r={r + 5} fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2"/>}
                {/* Node circle */}
                <circle cx={cx} cy={cy} r={r} fill={c.fill} stroke={c.stroke} strokeWidth={isSelected ? 3 : 2}
                  filter={`url(#glow-${n.type})`}
                  style={{ transition: 'cx 1s ease, cy 1s ease' }}
                />
                {/* Label */}
                <text x={cx} y={cy + r + 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="600"
                  style={{ pointerEvents: 'none' }}>{n.label}</text>
                {/* Score badge on mule/suspect */}
                {(n.type === 'mule' || n.type === 'suspect') && (
                  <text x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="900"
                    style={{ pointerEvents: 'none' }}>{n.score}</text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node Detail Panel */}
        {selected && (
          <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 rounded-2xl p-5 w-60 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-right-4 z-20">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-black text-base">{selected.label}</h4>
              <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors"><X size={15}/></button>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Type',       value: selected.type.charAt(0).toUpperCase() + selected.type.slice(1) },
                { label: 'GNN Score',  value: `${selected.score ?? 'N/A'}%` },
                { label: 'Tx Count',   value: `${selected.txCount ?? '?'} transactions` },
                { label: 'In Cluster', value: 'Alpha-7' },
              ].map((f, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">{f.label}</span>
                  <span className={`font-bold ${f.label === 'GNN Score' && (selected.score ?? 0) > 80 ? 'text-red-400' : 'text-slate-200'}`}>{f.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 flex flex-col gap-2">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-red-500 transition-all duration-700"
                  style={{ width: `${selected.score ?? 0}%` }}/>
              </div>
              <div className="flex gap-2 mt-1">
                <button className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors">Investigate</button>
                <button className="flex-1 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg transition-colors border border-red-800">Block Node</button>
              </div>
            </div>
          </div>
        )}

        {/* Watermark */}
        <div className="absolute bottom-4 left-5 text-slate-700 text-xs font-bold select-none pointer-events-none">
          GuardUPI · Neo4j v5.x · GNN v2.4
        </div>
      </div>
    </div>
  );
};
