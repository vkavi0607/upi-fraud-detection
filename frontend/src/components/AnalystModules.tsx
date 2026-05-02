import { useState, useEffect, useRef } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldAlert, BarChart2, Activity, X, ShieldCheck } from 'lucide-react';
import { useToast } from './Toast';

// ─── Shared tick helpers ─────────────────────────────
function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ─── TransactionRisk ─────────────────────────────────
export const TransactionRisk = () => {
  const { showToast } = useToast();
  const [blockConfirm, setBlockConfirm] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [vectors, setVectors] = useState([
    { label: 'Velocity Risk (Txn Frequency Spike)',    score: 88, color: 'from-rose-400 to-rose-600',     glow: 'rgba(225,29,72,0.45)' },
    { label: 'Geospatial IP Anomaly Mismatch',         score: 65, color: 'from-amber-400 to-amber-600',   glow: 'rgba(217,119,6,0.4)' },
    { label: 'GNN Graph Structural Density',           score: 94, color: 'from-indigo-400 to-indigo-600', glow: 'rgba(79,70,229,0.45)' },
    { label: 'Device Fingerprint Novelty Threshold',   score: 12, color: 'from-emerald-400 to-emerald-600',glow: 'rgba(16,185,129,0.3)' },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setVectors(v => v.map(vec => ({
        ...vec,
        score: Math.max(5, Math.min(99, vec.score + rand(-3, 3)))
      })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const composite = Math.round(vectors.reduce((a,v) => a + v.score, 0) / vectors.length);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Transaction Risk Analysis</h2>
      <p className="text-slate-500 font-medium mb-7">GNN feature vector breakdown — live inference scoring.</p>

      <div className="grid grid-cols-2 gap-7 flex-1">
        {/* Left: Score bars */}
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="font-extrabold text-lg text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-2">
            <Target className="text-slate-400" size={20}/> Risk Vector Breakdown
          </h3>
          <div className="space-y-7">
            {vectors.map((v, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-600">{v.label}</span>
                  <span className={`text-base ${v.score > 80 ? 'text-rose-600' : v.score > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {v.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${v.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${v.score}%`, boxShadow: `0 0 10px ${v.glow}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Verdict */}
        <div className="bg-slate-900 p-10 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden border border-slate-800">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
          <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-5 ring-4 ring-rose-500/20">
            <AlertTriangle size={48} className="text-rose-500 drop-shadow-lg" />
          </div>
          <div className="text-5xl font-black text-white mb-1">{composite}</div>
          <div className="text-rose-400 font-bold text-xs uppercase tracking-widest mb-4">Composite Risk Score</div>
          <h3 className="text-white font-black text-2xl tracking-tight">
            {composite > 70 ? 'Recommendation: BLOCK' : composite > 50 ? 'Recommendation: REVIEW' : 'Recommendation: ALLOW'}
          </h3>
          <p className="text-slate-400 font-medium mt-3 text-base leading-relaxed max-w-xs">
            GNN Topology confirms {composite}% vector alignment with active fraud cluster (Alpha-7). Live score updates every 2s.
          </p>
          {/* Block Confirmation Dialog */}
          {blockConfirm && (
            <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setBlockConfirm(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
                <div className="bg-rose-600 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-rose-200 text-xs font-bold uppercase tracking-widest">UPI Block Enforcement</p>
                      <h3 className="text-white font-black text-xl mt-0.5">Confirm Block — Risk Score {composite}</h3>
                    </div>
                    <button onClick={() => setBlockConfirm(false)} className="text-rose-300 hover:text-white p-1"><X size={20}/></button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[{l:'Composite Risk Score', v:`${composite}/100`},{l:'Cluster', v:'Alpha-7'},{l:'GNN Recommendation', v: composite > 70 ? 'BLOCK' : 'REVIEW'},{l:'Action', v:'UPI Block + SAR Auto-Draft'}].map(({l,v}) => (
                    <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</span>
                      <span className={`text-sm font-bold ${l==='Composite Risk Score'?'text-rose-600':'text-slate-900'}`}>{v}</span>
                    </div>
                  ))}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                    ⚠️ This action will immediately block UPI transactions and auto-draft a SAR for this account.
                  </div>
                </div>
                <div className="px-6 pb-6 flex gap-3">
                  <button onClick={() => setBlockConfirm(false)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={() => { setBlocked(true); setBlockConfirm(false); showToast({type:'action', title:'🔒 UPI Block Enforced', message:`Risk ${composite} — Block applied via NPCI API. SAR auto-drafted for Cluster Alpha-7.`, duration:5000}); }} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-sm transition-colors active:scale-95">Confirm &amp; Enforce Block</button>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => { if (!blocked) setBlockConfirm(true); }}
            className={`mt-7 font-bold py-3.5 px-9 rounded-xl transition-all active:scale-95 tracking-wide flex items-center gap-2 ${
              blocked
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-default'
                : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)]'
            }`}
          >
            {blocked ? <><ShieldCheck size={18}/> UPI Block Active</> : 'Acknowledge & Enforce UPI Block'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FraudTrends ─────────────────────────────────────
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function genWeek() { return DAYS.map(() => ({ blocked: rand(80, 380), reviewed: rand(200, 900), volume: rand(500, 2000) })); }

export const FraudTrends = () => {
  const [data, setData]       = useState(genWeek());
  const [tooltip, setTooltip] = useState<{ x: number; y: number; day: string; blocked: number; reviewed: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Simulate real-time trend updates
  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => prev.map(d => ({
        ...d,
        blocked:  Math.max(20, Math.min(500, d.blocked  + rand(-25, 30))),
        reviewed: Math.max(100, Math.min(1200,d.reviewed + rand(-50, 60))),
        volume:   Math.max(300, Math.min(2500,d.volume   + rand(-80, 90))),
      })));
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const W = 700, H = 220, PAD = { t: 20, r: 20, b: 40, l: 50 };
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;

  const maxBlocked  = Math.max(...data.map(d => d.blocked))  * 1.2;
  const maxReviewed = Math.max(...data.map(d => d.reviewed)) * 1.2;

  const xPos = (i: number) => PAD.l + (i / (DAYS.length - 1)) * innerW;
  const yBlk = (v: number) => PAD.t + innerH - (v / maxBlocked)  * innerH;
  const yRev = (v: number) => PAD.t + innerH - (v / maxReviewed) * innerH;

  const blockedPath  = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yBlk(d.blocked)}`).join(' ');
  const reviewedPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i)} ${yRev(d.reviewed)}`).join(' ');

  // Filled area under blocked line
  const blockedArea = `${blockedPath} L ${xPos(DAYS.length-1)} ${PAD.t+innerH} L ${xPos(0)} ${PAD.t+innerH} Z`;
  const reviewedArea= `${reviewedPath} L ${xPos(DAYS.length-1)} ${PAD.t+innerH} L ${xPos(0)} ${PAD.t+innerH} Z`;

  // Donut data
  const categories = [
    { label: 'Mule Cluster',     pct: 34, color: '#ef4444' },
    { label: 'Velocity Spike',   pct: 22, color: '#f59e0b' },
    { label: 'Geo Anomaly',      pct: 18, color: '#6366f1' },
    { label: 'Device Spoof',     pct: 13, color: '#8b5cf6' },
    { label: 'Identity Theft',   pct: 13, color: '#ec4899' },
  ];

  // Donut slices
  function describeArc(cx:number, cy:number, r:number, start:number, end:number) {
    const toRad = (d:number) => (d - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
  }

  let angle = 0;
  const slices = categories.map(c => {
    const sweep = (c.pct / 100) * 360;
    const path = describeArc(80, 80, 60, angle, angle + sweep - 2);
    angle += sweep;
    return { ...c, path };
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Macro Fraud Trend Analysis</h2>
      <p className="text-slate-500 font-medium mb-7">
        7-day rolling attack interception metrics — live-updated every 2s.
      </p>

      <div className="grid grid-cols-3 gap-6 flex-1">
        {/* LINE CHART */}
        <div className="col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><BarChart2 size={18} className="text-indigo-500"/> Blocked vs Reviewed (7-Day)</h3>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-red-500 inline-block"/>Blocked</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-amber-400 inline-block"/>Reviewed</span>
            </div>
          </div>
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 220 }}>
            <defs>
              <linearGradient id="gradBlk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02"/>
              </linearGradient>
              <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0,25,50,75,100].map(pct => {
              const y = PAD.t + innerH * (1 - pct/100);
              return <g key={pct}>
                <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#f1f5f9" strokeWidth="1"/>
                <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#94a3b8">{Math.round(maxBlocked * pct / 100)}</text>
              </g>;
            })}
            {/* Areas */}
            <path d={reviewedArea} fill="url(#gradRev)"/>
            <path d={blockedArea}  fill="url(#gradBlk)"/>
            {/* Lines */}
            <path d={reviewedPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{transition:'d 0.7s ease'}}/>
            <path d={blockedPath}  fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" style={{transition:'d 0.7s ease'}}/>
            {/* Dots + X labels */}
            {data.map((d, i) => (
              <g key={i} style={{cursor:'pointer'}}
                onMouseEnter={() => setTooltip({ x: xPos(i), y: yBlk(d.blocked), day: DAYS[i], blocked: d.blocked, reviewed: d.reviewed })}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle cx={xPos(i)} cy={yBlk(d.blocked)}  r="5" fill="#ef4444" stroke="white" strokeWidth="2"/>
                <circle cx={xPos(i)} cy={yRev(d.reviewed)} r="5" fill="#f59e0b" stroke="white" strokeWidth="2"/>
                <text x={xPos(i)} y={H - 6} textAnchor="middle" fontSize={11} fill="#94a3b8" fontWeight="600">{DAYS[i]}</text>
              </g>
            ))}
            {/* Tooltip */}
            {tooltip && (
              <g>
                <rect x={tooltip.x - 55} y={tooltip.y - 60} width={110} height={52} rx="8" fill="#1e293b"/>
                <text x={tooltip.x} y={tooltip.y - 43} textAnchor="middle" fontSize={11} fill="#94a3b8" fontWeight="700">{tooltip.day}</text>
                <text x={tooltip.x} y={tooltip.y - 27} textAnchor="middle" fontSize={11} fill="#ef4444" fontWeight="700">Blocked: {tooltip.blocked}</text>
                <text x={tooltip.x} y={tooltip.y - 13} textAnchor="middle" fontSize={11} fill="#f59e0b" fontWeight="700">Reviewed: {tooltip.reviewed}</text>
              </g>
            )}
          </svg>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity size={18} className="text-purple-500"/> Attack Vector Mix</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-44 h-44">
              {slices.map((s, i) => (
                <path key={i} d={s.path} fill={s.color} opacity="0.9" className="hover:opacity-100 transition-opacity cursor-pointer"/>
              ))}
              {/* Centre hole */}
              <circle cx="80" cy="80" r="35" fill="white"/>
              <text x="80" y="77" textAnchor="middle" fontSize="12" fontWeight="800" fill="#1e293b">7-Day</text>
              <text x="80" y="93" textAnchor="middle" fontSize="10" fill="#64748b">Total</text>
            </svg>
            <div className="w-full space-y-2 mt-4">
              {categories.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color }}/>
                    <span className="text-slate-600">{c.label}</span>
                  </div>
                  <span className="text-slate-900">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stat strip */}
      <div className="grid grid-cols-4 gap-4 mt-5">
        {[
          { label: '30-Day Blocked',   value: `${(data.reduce((a,d)=>a+d.blocked,0)*4.3).toFixed(0)}`,  color: 'text-red-600' },
          { label: '30-Day Reviewed',  value: `${(data.reduce((a,d)=>a+d.reviewed,0)*4.3).toFixed(0)}`, color: 'text-amber-600' },
          { label: 'Avg Daily Volume', value: `₹${(data.reduce((a,d)=>a+d.volume,0)/7).toFixed(0)}K`,  color: 'text-indigo-600' },
          { label: 'Detection Rate',   value: '97.3%',                                                   color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
