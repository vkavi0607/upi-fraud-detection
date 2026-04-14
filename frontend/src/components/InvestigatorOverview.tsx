import { useState, useEffect } from 'react';
import { FileText, Clock, AlertTriangle, CheckCircle2, ChevronRight, Shield, User, Calendar, GitBranch, Link2, ArrowRight, Zap, Eye, MapPin } from 'lucide-react';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const SAR_CASES = [
  { id: 'SAR-1041', account: 'UPI*9876', risk: 98, cluster: 'Alpha-7', analyst: 'Kavitha R.',  daysOpen: 3,  stage: 'Pending RBI Sign-off',   amount: '₹12.4L', progress: 75 },
  { id: 'SAR-1039', account: 'UPI*4423', risk: 92, cluster: 'Beta-2',  analyst: 'Rajan S.',    daysOpen: 5,  stage: 'Evidence Collection',      amount: '₹8.7L',  progress: 45 },
  { id: 'SAR-1037', account: 'UPI*7781', risk: 88, cluster: 'Gamma-1', analyst: 'Meena V.',    daysOpen: 8,  stage: 'Legal Review',             amount: '₹22.1L', progress: 60 },
  { id: 'SAR-1033', account: 'UPI*3311', risk: 95, cluster: 'Alpha-7', analyst: 'Kavitha R.',  daysOpen: 12, stage: 'Awaiting Court Subpoena',   amount: '₹4.2L',  progress: 30 },
];

const TIMELINE = [
  { time: '09:12',  action: 'Graph traversal matched TXN998 to Cluster Alpha-7',        type: 'alert' },
  { time: '09:45',  action: 'SAR-1041 escalated to Level-3 review queue',               type: 'escalate' },
  { time: '10:30',  action: 'Geospatial hop confirmed: Mumbai → Hyderabad → Dubai',     type: 'info' },
  { time: '11:00',  action: 'Bank freeze applied on HDFC Acc #XXXX-4421 via NPCI API',  type: 'action' },
  { time: '14:20',  action: 'RBI CPIO notified via encrypted email (AES-256)',          type: 'info' },
  { time: '15:05',  action: 'New mule node discovered — Sigma-3 cluster updated',       type: 'alert' },
];

// Evidence chain data
const EVIDENCE_CHAIN = [
  { id: 'E1', type: 'transaction', label: 'TXN49816329', amount: '₹4.2L', time: '09:12', flagged: true },
  { id: 'E2', type: 'account',     label: 'UPI*9876',    detail: 'Mule account',  time: '09:14', flagged: true },
  { id: 'E3', type: 'device',      label: 'DEV-A1',      detail: 'Cloned IMEI',   time: '09:18', flagged: true },
  { id: 'E4', type: 'transaction', label: 'TXN49816342', amount: '₹2.8L', time: '09:22', flagged: false },
  { id: 'E5', type: 'ip',          label: '45.33.32.156', detail: 'TOR Exit',     time: '09:25', flagged: true },
  { id: 'E6', type: 'account',     label: 'UPI*4421',    detail: 'Beneficiary',   time: '09:30', flagged: false },
];

// Link analysis nodes
const LINK_NODES = [
  { id: 'L1', label: 'UPI*9876', x: 50, y: 30, type: 'mule', score: 98 },
  { id: 'L2', label: 'UPI*4421', x: 20, y: 60, type: 'suspect', score: 85 },
  { id: 'L3', label: 'DEV-A1',   x: 80, y: 55, type: 'device', score: 71 },
  { id: 'L4', label: 'IP-TOR',   x: 40, y: 85, type: 'ip', score: 94 },
  { id: 'L5', label: 'UPI*3311', x: 70, y: 85, type: 'suspect', score: 79 },
];
const LINK_EDGES = [
  { from: 'L1', to: 'L2', flagged: true },
  { from: 'L1', to: 'L3', flagged: true },
  { from: 'L2', to: 'L4', flagged: true },
  { from: 'L3', to: 'L5', flagged: false },
  { from: 'L4', to: 'L5', flagged: true },
  { from: 'L1', to: 'L5', flagged: true },
];

const NODE_COLORS: Record<string, { fill: string; stroke: string }> = {
  mule: { fill: '#fca5a5', stroke: '#ef4444' },
  suspect: { fill: '#fcd34d', stroke: '#f59e0b' },
  device: { fill: '#a5b4fc', stroke: '#6366f1' },
  ip: { fill: '#c4b5fd', stroke: '#8b5cf6' },
};

export const InvestigatorOverview = () => {
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [progress, setProgress] = useState({ sar: 4, freeze: 7, rbi: 2 });
  const [sarCases, setSarCases] = useState(SAR_CASES);
  const [linkNodes, setLinkNodes] = useState(LINK_NODES);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => ({
        sar:   Math.max(1, Math.min(10, p.sar   + (Math.random() < 0.3 ? 1 : 0))),
        freeze:Math.max(1, Math.min(20, p.freeze + (Math.random() < 0.2 ? 1 : 0))),
        rbi:   Math.max(0, Math.min(8,  p.rbi   + (Math.random() < 0.15 ? 1 : 0))),
      }));
      setSarCases(prev => prev.map(c => ({
        ...c,
        risk: Math.max(70, Math.min(99, c.risk + rand(-1, 1))),
        progress: Math.min(100, c.progress + rand(0, 2)),
      })));
      setLinkNodes(prev => prev.map(n => ({
        ...n,
        x: Math.max(10, Math.min(90, n.x + (Math.random() * 2 - 1))),
        y: Math.max(15, Math.min(90, n.y + (Math.random() * 2 - 1))),
        score: Math.max(60, Math.min(99, n.score + rand(-1, 1))),
      })));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const stageColors: Record<string, string> = {
    'Pending RBI Sign-off': 'bg-amber-50 text-amber-700 border-amber-100',
    'Evidence Collection': 'bg-blue-50 text-blue-700 border-blue-100',
    'Legal Review': 'bg-purple-50 text-purple-700 border-purple-100',
    'Awaiting Court Subpoena': 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-7">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Investigator Workspace</h2>
        <p className="text-slate-500 font-medium">Deep-graph investigations, SAR compliance, evidence chain, and link analysis.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'SARs Pending RBI', value: progress.sar,    icon: FileText,     color: 'text-rose-600',    bg: 'bg-rose-50',    badge: 'Critical' },
          { label: 'Accounts Frozen',  value: progress.freeze, icon: Shield,       color: 'text-indigo-600',  bg: 'bg-indigo-50',  badge: 'Active Enforcement' },
          { label: 'RBI Notifications',value: progress.rbi,    icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'Sent Today' },
        ].map((k, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${k.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <k.icon className={k.color} size={26}/>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">{k.label}</p>
              <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{k.badge}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Chain Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <GitBranch size={17} className="text-indigo-500" /> Evidence Chain — SAR-1041
        </h3>
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {EVIDENCE_CHAIN.map((e, i) => (
            <div key={e.id} className="flex items-center shrink-0">
              <div className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md min-w-[130px] ${
                e.flagged ? 'border-red-200 bg-red-50/50 hover:border-red-400' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white ${
                    e.type === 'transaction' ? 'bg-indigo-500' : e.type === 'account' ? 'bg-amber-500' : e.type === 'device' ? 'bg-purple-500' : 'bg-red-500'
                  }`}>
                    {e.type === 'transaction' ? 'TX' : e.type === 'account' ? 'AC' : e.type === 'device' ? 'DV' : 'IP'}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{e.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{e.amount || e.detail}</p>
                <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={8} /> {e.time}</p>
                {e.flagged && <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}
              </div>
              {i < EVIDENCE_CHAIN.length - 1 && (
                <div className="flex items-center px-1">
                  <div className={`w-8 h-0.5 ${EVIDENCE_CHAIN[i + 1].flagged ? 'bg-red-300' : 'bg-slate-200'}`} />
                  <ArrowRight size={12} className={EVIDENCE_CHAIN[i + 1].flagged ? 'text-red-400' : 'text-slate-300'} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* SAR Case Queue with Progress */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><AlertTriangle size={17} className="text-rose-500"/> Priority SAR Queue</h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Open All →</button>
          </div>
          <div className="divide-y divide-slate-100">
            {sarCases.map(c => (
              <div key={c.id}
                onClick={() => setOpenCase(openCase === c.id ? null : c.id)}
                className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white ${c.risk > 94 ? 'bg-red-500' : c.risk > 88 ? 'bg-orange-500' : 'bg-amber-500'}`}>
                      {c.risk}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{c.id}</span>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{c.cluster}</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <User size={10}/> {c.analyst} · <Calendar size={10}/> {c.daysOpen}d open · {c.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stageColors[c.stage] || 'bg-slate-100 text-slate-500'}`}>{c.stage}</span>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform ${openCase === c.id ? 'rotate-90' : ''}`}/>
                  </div>
                </div>

                {/* SAR Progress Tracker */}
                <div className="mt-2 ml-14">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{c.progress}%</span>
                  </div>
                </div>

                {openCase === c.id && (
                  <div className="mt-3 ml-14 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                    <div className="flex gap-2">
                      <button className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">File SAR to RBI</button>
                      <button className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 px-4 py-2 rounded-lg transition-colors">Request Account Freeze</button>
                      <button className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg transition-colors">View Graph</button>
                      <button className="text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                        <Eye size={11} /> Evidence Chain
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Link Analysis + Timeline */}
        <div className="flex flex-col gap-6">
          {/* Link Analysis Mini-Map */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl p-4 relative overflow-hidden">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Link2 size={14} className="text-indigo-400" /> Link Analysis — Alpha-7
            </h3>
            <svg viewBox="0 0 100 100" className="w-full" style={{ height: 160 }}>
              {/* Grid */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line key={`g${i}`} x1={0} y1={i * 25} x2={100} y2={i * 25} stroke="#1e293b" strokeWidth="0.3" />
              ))}
              {/* Edges */}
              {LINK_EDGES.map((e, i) => {
                const from = linkNodes.find(n => n.id === e.from)!;
                const to = linkNodes.find(n => n.id === e.to)!;
                return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                  stroke={e.flagged ? '#ef4444' : '#334155'} strokeWidth={e.flagged ? 1.2 : 0.6} strokeOpacity={e.flagged ? 0.7 : 0.4}
                  style={{ transition: 'all 1s ease' }} />;
              })}
              {/* Nodes */}
              {linkNodes.map(n => {
                const c = NODE_COLORS[n.type] || NODE_COLORS.suspect;
                return (
                  <g key={n.id}>
                    {n.type === 'mule' && <circle cx={n.x} cy={n.y} r="7" fill={c.stroke} opacity="0.15">
                      <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
                    </circle>}
                    <circle cx={n.x} cy={n.y} r="4" fill={c.fill} stroke={c.stroke} strokeWidth="1.2"
                      style={{ transition: 'cx 1s ease, cy 1s ease', cursor: 'pointer' }} />
                    <text x={n.x} y={n.y + 9} textAnchor="middle" fontSize="4" fill="#94a3b8" fontWeight="600">{n.label}</text>
                  </g>
                );
              })}
            </svg>
            <div className="flex items-center gap-3 text-[9px] font-semibold text-slate-500 mt-1">
              {[['Mule', '#ef4444'], ['Suspect', '#f59e0b'], ['Device', '#6366f1'], ['IP', '#8b5cf6']].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: c as string }} />{l}</span>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock size={16} className="text-indigo-500"/> Today's Activity</h3>
            </div>
            <div className="p-5 space-y-4 overflow-auto">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="font-mono text-slate-400 shrink-0 pt-0.5">{t.time}</span>
                  <div className="flex gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.type === 'alert' ? 'bg-red-400' : t.type === 'action' ? 'bg-indigo-400' : t.type === 'escalate' ? 'bg-orange-400' : 'bg-slate-300'}`}/>
                    <p className="text-slate-600 font-medium leading-snug">{t.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
