import { useState, useEffect } from 'react';
import { Globe, BarChart3, TrendingUp, ShieldCheck, Zap, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, Activity, Target, Shield, Eye } from 'lucide-react';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const REGIONS = [
  { name: 'Maharashtra', fraudPct: 34, color: '#ef4444', cases: 412 },
  { name: 'Delhi NCR', fraudPct: 22, color: '#f59e0b', cases: 268 },
  { name: 'Karnataka', fraudPct: 18, color: '#6366f1', cases: 219 },
  { name: 'Tamil Nadu', fraudPct: 13, color: '#8b5cf6', cases: 158 },
  { name: 'West Bengal', fraudPct: 8, color: '#ec4899', cases: 97 },
  { name: 'Others', fraudPct: 5, color: '#64748b', cases: 61 },
];

// Anomaly timeline data
const ANOMALY_TYPES = ['Velocity Spike', 'Geo Anomaly', 'Mule Pattern', 'Device Clone', 'SIM Swap', 'Fund Drain'];
const generateAnomalies = () => Array.from({ length: 18 }, (_, i) => ({
  hour: i + 1,
  type: ANOMALY_TYPES[rand(0, ANOMALY_TYPES.length - 1)],
  severity: (['Critical', 'High', 'Medium'] as const)[rand(0, 2)],
  score: rand(72, 99),
}));

// Predictive alerts
const PREDICTIVE_ALERTS = [
  { cluster: 'Alpha-7', prediction: 'Mule cascade in 2h', confidence: 94, eta: '~2h', color: '#ef4444' },
  { cluster: 'Sigma-3', prediction: 'Velocity burst expected', confidence: 87, eta: '~4h', color: '#f59e0b' },
  { cluster: 'Delta-5', prediction: 'New node injection likely', confidence: 79, eta: '~6h', color: '#6366f1' },
  { cluster: 'Zeta-9', prediction: 'Geo-hop pattern emerging', confidence: 72, eta: '~8h', color: '#8b5cf6' },
];

// Compliance items
const COMPLIANCE = [
  { item: 'SAR filings (monthly)', status: 'On Track', progress: 92, deadline: 'Apr 30', color: 'emerald' },
  { item: 'AML audit response', status: 'Due Soon', progress: 68, deadline: 'Apr 20', color: 'amber' },
  { item: 'NPCI quarterly report', status: 'Completed', progress: 100, deadline: 'Apr 10', color: 'emerald' },
  { item: 'RBI CPIO notification', status: 'Pending', progress: 35, deadline: 'Apr 18', color: 'red' },
  { item: 'PCI DSS renewal', status: 'On Track', progress: 80, deadline: 'May 15', color: 'emerald' },
];

export const RiskManagerOverview = () => {
  const [prevented, setPrevented] = useState(8.42);
  const [fpRate, setFpRate] = useState(1.4);
  const [velocity, setVelocity] = useState(4205);
  const [threatLvl, setThreatLvl] = useState<'HIGH' | 'ELEVATED' | 'CRITICAL'>('ELEVATED');
  const [regions, setRegions] = useState(REGIONS);
  const [history, setHistory] = useState<number[]>(() => Array.from({ length: 24 }, () => rand(60, 340)));
  const [anomalies, setAnomalies] = useState(generateAnomalies);
  const [predictions, setPredictions] = useState(PREDICTIVE_ALERTS);
  const [compliance, setCompliance] = useState(COMPLIANCE);

  useEffect(() => {
    const id = setInterval(() => {
      setPrevented(v => parseFloat((v + (Math.random() * 0.08)).toFixed(2)));
      setFpRate(v => parseFloat((Math.max(0.8, Math.min(2.5, v + (Math.random() * 0.1 - 0.05))).toFixed(2))));
      setVelocity(v => Math.max(3600, Math.min(5400, v + rand(-80, 100))));
      setHistory(h => [...h.slice(1), rand(60, 400)]);
      setRegions(r => r.map(re => ({ ...re, cases: Math.max(10, re.cases + rand(-5, 8)) })));
      setPredictions(p => p.map(pr => ({ ...pr, confidence: Math.max(60, Math.min(99, pr.confidence + rand(-2, 2))) })));
      setCompliance(c => c.map(ci => ({ ...ci, progress: Math.min(100, ci.progress + (ci.progress < 100 ? rand(0, 1) : 0)) })));
      if (Math.random() < 0.1) {
        const levels: ('HIGH' | 'ELEVATED' | 'CRITICAL')[] = ['HIGH', 'ELEVATED', 'CRITICAL'];
        setThreatLvl(levels[rand(0, 2)]);
      }
    }, 2200);
    return () => clearInterval(id);
  }, []);

  // Sparkline SVG helper
  const W = 200, H = 48;
  const max = Math.max(...history);
  const pts = history.map((v, i) => `${(i / (history.length - 1)) * W},${H - (v / max) * H}`).join(' ');

  const threatColor = threatLvl === 'CRITICAL' ? { bg: 'bg-red-600', text: 'text-red-600', badge: 'bg-red-50 text-red-700 border-red-200' }
    : threatLvl === 'HIGH' ? { bg: 'bg-orange-500', text: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' }
      : { bg: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' };

  const totalCases = regions.reduce((a, r) => a + r.cases, 0);

  // Anomaly timeline SVG
  const anomalyW = 700, anomalyH = 60;
  const sevColor = (s: string) => s === 'Critical' ? '#ef4444' : s === 'High' ? '#f59e0b' : '#6366f1';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-7">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Executive Risk Dashboard</h2>
        <p className="text-slate-500 font-medium">Live ML KPIs, predictive alerts, anomaly timeline, and compliance tracking.</p>
      </div>

      {/* Hero banner */}
      <div className="bg-slate-900 p-7 rounded-2xl shadow-xl flex justify-between items-center relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500 rounded-full blur-[140px] opacity-15 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-indigo-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-1">24h Fraud Prevented</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-emerald-400 tracking-tight">₹{prevented} Cr</span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1 mb-2"><ArrowUpRight size={14} /> +0.8% vs yesterday</span>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-slate-500 text-xs mb-2 text-right">Transaction Velocity (24h)</p>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
            <polyline points={`0,${H} ${pts} ${W},${H}`} fill="url(#sparkGrad)" opacity="0.3" />
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-emerald-400 text-right text-xs font-mono font-bold">{velocity.toLocaleString()} txn/s</p>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Globe className="text-red-500" size={22} />
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${threatColor.badge} ${threatLvl === 'CRITICAL' ? 'animate-pulse' : ''}`}>
              {threatLvl}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">Global IP Threat Level</p>
          <p className={`text-xl font-black mt-1 ${threatColor.text}`}>{threatLvl === 'CRITICAL' ? 'Botnet + APT Active' : threatLvl === 'HIGH' ? 'Botnet Detected' : 'Suspicious Probing'}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart3 className="text-indigo-600" size={22} />
            </div>
            <span className={`text-xs font-bold flex items-center gap-1 ${fpRate < 1.5 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {fpRate < 1.5 ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}
              {fpRate < 1.5 ? 'Within SLA' : 'Above SLA'}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">GNN False Positive Rate</p>
          <p className={`text-3xl font-black mt-1 ${fpRate < 1.5 ? 'text-emerald-600' : 'text-amber-600'}`}>{fpRate}%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="text-purple-600" size={22} />
            </div>
            <span className="text-xs font-bold text-emerald-600">97.3% Detection</span>
          </div>
          <p className="text-xs text-slate-500 font-semibold">Model Accuracy (F1)</p>
          <p className="text-3xl font-black mt-1 text-purple-600">0.9622</p>
        </div>
      </div>

      {/* Anomaly Detection Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity size={17} className="text-rose-500" /> Anomaly Detection Timeline (24h)
        </h3>
        <svg viewBox={`0 0 ${anomalyW} ${anomalyH}`} className="w-full" style={{ height: 60 }}>
          {/* Timeline base */}
          <line x1="20" y1="30" x2={anomalyW - 20} y2="30" stroke="#e2e8f0" strokeWidth="2" />
          {/* Hour markers */}
          {[0, 6, 12, 18, 24].map(h => {
            const x = 20 + (h / 24) * (anomalyW - 40);
            return <g key={h}>
              <line x1={x} y1="25" x2={x} y2="35" stroke="#cbd5e1" strokeWidth="1" />
              <text x={x} y="50" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight="600">{`${String(h).padStart(2, '0')}:00`}</text>
            </g>;
          })}
          {/* Anomaly markers */}
          {anomalies.map((a, i) => {
            const x = 20 + (a.hour / 24) * (anomalyW - 40) + rand(-8, 8);
            const r = a.severity === 'Critical' ? 7 : a.severity === 'High' ? 5.5 : 4;
            return (
              <g key={i}>
                {a.severity === 'Critical' && <circle cx={x} cy="30" r={r + 4} fill={sevColor(a.severity)} opacity="0.15">
                  <animate attributeName="r" values={`${r + 2};${r + 6};${r + 2}`} dur="2s" repeatCount="indefinite" />
                </circle>}
                <circle cx={x} cy="30" r={r} fill={sevColor(a.severity)} stroke="white" strokeWidth="1.5" style={{ cursor: 'pointer' }} />
              </g>
            );
          })}
        </svg>
        <div className="flex items-center gap-6 mt-2 text-[10px] font-semibold text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Critical ({anomalies.filter(a => a.severity === 'Critical').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> High ({anomalies.filter(a => a.severity === 'High').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Medium ({anomalies.filter(a => a.severity === 'Medium').length})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Regional breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Zap size={17} className="text-indigo-500" /> Fraud Cases by Region (Live)
          </h3>
          <div className="space-y-3">
            {regions.map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-600 w-28 shrink-0">{r.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.fraudPct}%`, background: r.color, boxShadow: `0 0 8px ${r.color}55` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 w-16 text-right">{r.cases} cases</span>
                <span className="text-xs font-bold w-8 text-right" style={{ color: r.color }}>{r.fraudPct}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total cases across all regions</span>
            <span className="font-black text-slate-900 text-base">{totalCases.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Predictive Alerts + Compliance */}
        <div className="flex flex-col gap-6">
          {/* ML Predictive Alerts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={16} className="text-rose-500" /> ML Predictive Alert Queue
            </h3>
            <div className="space-y-2.5">
              {predictions.map((p, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: p.color }}>
                    {p.confidence}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-900">{p.cluster}</span>
                      <span className="text-[10px] font-mono text-slate-400">ETA {p.eta}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{p.prediction}</p>
                  </div>
                  <div className="w-10">
                    <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.confidence}%`, background: p.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" /> RBI/NPCI Compliance
            </h3>
            <div className="space-y-2.5">
              {compliance.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700 truncate">{c.item}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-${c.color}-50 text-${c.color}-700 border border-${c.color}-100`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 bg-${c.color}-500`} style={{ width: `${c.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{c.progress}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 shrink-0 flex items-center gap-1"><Clock size={9} /> {c.deadline}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
