import { useState, useEffect, useRef } from 'react';
import { Globe, TrendingUp, ShieldAlert, AlertTriangle, BarChart3, Activity, Eye, Target, Zap, ArrowUpRight, ArrowDownRight, Clock, Shield, Cpu } from 'lucide-react';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ═══════════════════════════════════════════════════════════════════════════
// FRAUD INTELLIGENCE — Full Threat Intelligence Dashboard
// ═══════════════════════════════════════════════════════════════════════════
const THREAT_FEED = [
  { ip: '45.33.32.156',    country: 'RU', type: 'Botnet C2',       score: 98, seen: '2m ago' },
  { ip: '198.51.100.42',   country: 'NG', type: 'Credential Stuff', score: 94, seen: '5m ago' },
  { ip: '203.0.113.77',    country: 'CN', type: 'API Abuse',        score: 91, seen: '12m ago' },
  { ip: '185.220.101.33',  country: 'IR', type: 'TOR Exit Node',    score: 89, seen: '18m ago' },
  { ip: '91.219.236.12',   country: 'UA', type: 'Port Scanner',     score: 85, seen: '25m ago' },
  { ip: '104.248.79.88',   country: 'US', type: 'Proxy Network',    score: 82, seen: '31m ago' },
];

const DARKWEB_MENTIONS = [
  { source: 'Telegram Channel', detail: 'UPI mule acc bulk sale — 500 accounts listed', severity: 'Critical', time: '1h ago' },
  { source: 'Dark Forum (RU)',  detail: 'New SIM-swap toolkit targeting Jio/Airtel',    severity: 'High',     time: '3h ago' },
  { source: 'Paste Site',       detail: 'Leaked NPCI test credentials (likely fake)',    severity: 'Medium',   time: '6h ago' },
  { source: 'Marketplace',      detail: 'Cloned device fingerprints for sale (₹200/ea)', severity: 'High',    time: '12h ago' },
];

const GEO_THREATS = [
  { region: 'Russia',      attacks: 342, change: +18, color: '#ef4444' },
  { region: 'Nigeria',     attacks: 198, change: +7,  color: '#f59e0b' },
  { region: 'China',       attacks: 156, change: -3,  color: '#6366f1' },
  { region: 'India (Int)', attacks: 89,  change: +22, color: '#ec4899' },
  { region: 'Iran',        attacks: 67,  change: +5,  color: '#8b5cf6' },
  { region: 'Others',      attacks: 45,  change: -1,  color: '#64748b' },
];

export const FraudIntelligence = () => {
  const [threats, setThreats]     = useState(THREAT_FEED);
  const [geoData, setGeoData]     = useState(GEO_THREATS);
  const [blockedIPs, setBlockedIPs] = useState(1842);
  const [activeBots, setActiveBots] = useState(23);
  const [threatScore, setThreatScore] = useState(78);

  useEffect(() => {
    const id = setInterval(() => {
      setBlockedIPs(v => v + rand(0, 3));
      setActiveBots(v => Math.max(8, Math.min(45, v + rand(-2, 3))));
      setThreatScore(v => Math.max(50, Math.min(99, v + rand(-3, 3))));
      setGeoData(g => g.map(r => ({ ...r, attacks: Math.max(10, r.attacks + rand(-5, 8)) })));
      setThreats(prev => prev.map(t => ({ ...t, score: Math.max(70, Math.min(99, t.score + rand(-2, 2))) })));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  // Attack radar — 6-axis SVG
  const radarAxes = ['Botnet', 'Phishing', 'API Abuse', 'SIM Swap', 'Mule Ring', 'Geo Spoof'];
  const radarValues = [82, 45, 71, 93, 88, 56];
  const R = 70, CX = 85, CY = 85;
  const radarPts = radarValues.map((v, i) => {
    const angle = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
    const r = (v / 100) * R;
    return `${CX + r * Math.cos(angle)},${CY + r * Math.sin(angle)}`;
  }).join(' ');

  const totalAtk = geoData.reduce((a, g) => a + g.attacks, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-7">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Fraud Intelligence Center</h2>
        <p className="text-slate-500 font-medium">Global threat feed, dark web monitoring, and attack vector analysis.</p>
      </div>

      {/* Hero KPI strip */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'IPs Blocked (24h)', value: blockedIPs.toLocaleString(), icon: Shield, color: 'text-red-600', bg: 'bg-red-50', trend: `+${rand(12, 30)} today` },
          { label: 'Active Bot Networks', value: activeBots, icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-50', trend: `${activeBots > 20 ? '▲' : '▼'} Monitoring` },
          { label: 'Global Threat Score', value: `${threatScore}/100`, icon: Target, color: threatScore > 75 ? 'text-red-600' : 'text-amber-600', bg: threatScore > 75 ? 'bg-red-50' : 'bg-amber-50', trend: threatScore > 75 ? 'ELEVATED' : 'MODERATE' },
        ].map((k, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-11 h-11 rounded-xl ${k.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <k.icon className={k.color} size={22} />
            </div>
            <p className="text-xs text-slate-500 font-semibold">{k.label}</p>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{k.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* IP Threat Feed */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-red-50/30">
            <ShieldAlert size={17} className="text-red-500" />
            <h3 className="font-bold text-slate-900">Global IP Threat Feed</h3>
            <span className="ml-auto text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="divide-y divide-slate-100">
            {threats.map((t, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-black text-white ${t.score > 92 ? 'bg-red-500' : t.score > 85 ? 'bg-orange-500' : 'bg-amber-500'}`}>
                    {t.score}
                  </div>
                  <div>
                    <p className="text-sm font-mono font-bold text-slate-800">{t.ip}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">{t.country} · {t.type} · <Clock size={10} /> {t.seen}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">Block</button>
              </div>
            ))}
          </div>
        </div>

        {/* Attack Radar */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-5 flex flex-col">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-indigo-400" /> Attack Vector Radar</h3>
          <div className="flex-1 flex items-center justify-center">
            <svg viewBox="0 0 170 170" className="w-44 h-44">
              {/* Grid circles */}
              {[25, 50, 75, 100].map(pct => (
                <circle key={pct} cx={CX} cy={CY} r={(pct / 100) * R} fill="none" stroke="#334155" strokeWidth="0.5" />
              ))}
              {/* Axis lines */}
              {radarAxes.map((_, i) => {
                const angle = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
                return <line key={i} x1={CX} y1={CY} x2={CX + R * Math.cos(angle)} y2={CY + R * Math.sin(angle)} stroke="#475569" strokeWidth="0.5" />;
              })}
              {/* Data polygon */}
              <polygon points={radarPts} fill="rgba(99,102,241,0.25)" stroke="#818cf8" strokeWidth="2" />
              {/* Dots + Labels */}
              {radarAxes.map((label, i) => {
                const angle = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
                const v = radarValues[i];
                const r = (v / 100) * R;
                const lx = CX + (R + 14) * Math.cos(angle);
                const ly = CY + (R + 14) * Math.sin(angle);
                return (
                  <g key={i}>
                    <circle cx={CX + r * Math.cos(angle)} cy={CY + r * Math.sin(angle)} r="3" fill="#818cf8" stroke="#0b0f19" strokeWidth="1.5" />
                    <text x={lx} y={ly + 3} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">{label}</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2">6-axis adversary pattern intensity</p>
        </div>
      </div>

      {/* Dark Web + Geo Threats */}
      <div className="grid grid-cols-2 gap-6">
        {/* Dark Web Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Eye size={17} className="text-purple-500" />
            <h3 className="font-bold text-slate-900">Dark Web Mention Tracker</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {DARKWEB_MENTIONS.map((m, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-600">{m.source}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    m.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    m.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                  }`}>{m.severity}</span>
                </div>
                <p className="text-sm text-slate-700 font-medium leading-snug">{m.detail}</p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={9} /> {m.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Threat Correlation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Globe size={17} className="text-indigo-500" /> Geographic Attack Origins</h3>
          <div className="space-y-3">
            {geoData.map((g, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-600 w-24 shrink-0">{g.region}</span>
                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(g.attacks / (totalAtk || 1)) * 100}%`, background: g.color, boxShadow: `0 0 8px ${g.color}55` }} />
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 w-12 text-right">{g.attacks}</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 w-14 ${g.change > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {g.change > 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{Math.abs(g.change)}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total attack events (24h)</span>
            <span className="font-black text-slate-900 text-base">{totalAtk.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════
// PATTERN ANALYTICS — Advanced Pattern Matching & Behavioral Drift
// ═══════════════════════════════════════════════════════════════════════════
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const CLUSTER_EVOLUTION = [
  { name: 'Alpha-7',  data: Array.from({ length: 14 }, () => rand(8, 35)),  color: '#ef4444' },
  { name: 'Beta-2',   data: Array.from({ length: 14 }, () => rand(4, 18)),  color: '#f59e0b' },
  { name: 'Sigma-3',  data: Array.from({ length: 14 }, () => rand(15, 45)), color: '#6366f1' },
  { name: 'Delta-5',  data: Array.from({ length: 14 }, () => rand(3, 12)),  color: '#8b5cf6' },
];

const DRIFT_METRICS = [
  { label: 'Transaction Amount Distribution', drift: 0.042, status: 'Stable',    color: 'text-emerald-600' },
  { label: 'Temporal Access Pattern',         drift: 0.128, status: 'Drifting',   color: 'text-amber-600' },
  { label: 'Device Fingerprint Entropy',      drift: 0.231, status: 'Alert',      color: 'text-red-600' },
  { label: 'Geospatial Hop Frequency',        drift: 0.067, status: 'Stable',     color: 'text-emerald-600' },
  { label: 'Beneficiary Graph Density',       drift: 0.189, status: 'Drifting',   color: 'text-amber-600' },
  { label: 'Channel Switching Rate',          drift: 0.034, status: 'Stable',     color: 'text-emerald-600' },
];

export const PatternAnalytics = () => {
  const [hourlyData, setHourlyData] = useState(() => HOURS.map(() => ({ blocked: rand(10, 80), clean: rand(200, 600) })));
  const [clusters, setClusters]     = useState(CLUSTER_EVOLUTION);
  const [drifts, setDrifts]         = useState(DRIFT_METRICS);

  useEffect(() => {
    const id = setInterval(() => {
      setHourlyData(prev => prev.map(h => ({
        blocked: Math.max(5, Math.min(120, h.blocked + rand(-5, 8))),
        clean: Math.max(100, Math.min(800, h.clean + rand(-30, 40))),
      })));
      setClusters(prev => prev.map(c => ({
        ...c,
        data: [...c.data.slice(1), rand(3, 45)],
      })));
      setDrifts(prev => prev.map(d => {
        const newDrift = parseFloat((Math.max(0.01, Math.min(0.35, d.drift + (Math.random() * 0.04 - 0.02)))).toFixed(3));
        return {
          ...d,
          drift: newDrift,
          status: newDrift > 0.2 ? 'Alert' : newDrift > 0.1 ? 'Drifting' : 'Stable',
          color: newDrift > 0.2 ? 'text-red-600' : newDrift > 0.1 ? 'text-amber-600' : 'text-emerald-600',
        };
      }));
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Time-series chart
  const W = 720, H = 180, PAD = { t: 15, r: 10, b: 30, l: 40 };
  const iW = W - PAD.l - PAD.r, iH = H - PAD.t - PAD.b;
  const maxH = Math.max(...hourlyData.map(h => h.blocked + h.clean)) * 1.1;

  // Cluster evolution sparklines
  const clusterW = 180, clusterH = 40;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-7">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Pattern Analytics</h2>
        <p className="text-slate-500 font-medium">Time-series decomposition, cluster evolution, and behavioral drift detection.</p>
      </div>

      {/* Hourly Stacked Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2"><BarChart3 size={18} className="text-indigo-500" /> 24h Transaction Decomposition</h3>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-red-500 inline-block" />Blocked</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-indigo-400 inline-block" />Clean</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
          {/* Grid */}
          {[0, 25, 50, 75, 100].map(pct => {
            const y = PAD.t + iH * (1 - pct / 100);
            return <g key={pct}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="#f1f5f9" strokeWidth="1" />
              <text x={PAD.l - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#94a3b8">{Math.round(maxH * pct / 100)}</text>
            </g>;
          })}
          {/* Bars */}
          {hourlyData.map((h, i) => {
            const barW = (iW / 24) * 0.7;
            const x = PAD.l + (i / 24) * iW + (iW / 24) * 0.15;
            const cleanH = (h.clean / maxH) * iH;
            const blockedH = (h.blocked / maxH) * iH;
            return (
              <g key={i}>
                <rect x={x} y={PAD.t + iH - cleanH - blockedH} width={barW} height={cleanH} fill="#818cf8" rx="2" opacity="0.7" />
                <rect x={x} y={PAD.t + iH - blockedH} width={barW} height={blockedH} fill="#ef4444" rx="2" opacity="0.85" />
                {i % 3 === 0 && <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={8} fill="#94a3b8" fontWeight="600">{HOURS[i]}</text>}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Cluster Evolution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><TrendingUp size={17} className="text-indigo-500" /> Cluster Evolution (14-Day)</h3>
          <div className="space-y-5">
            {clusters.map((c, ci) => {
              const max = Math.max(...c.data, 1);
              const pts = c.data.map((v, i) => `${(i / (c.data.length - 1)) * clusterW},${clusterH - (v / max) * clusterH}`).join(' ');
              const latest = c.data[c.data.length - 1];
              const prev = c.data[c.data.length - 2];
              return (
                <div key={ci} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-600 w-20 shrink-0">{c.name}</span>
                  <svg viewBox={`0 0 ${clusterW} ${clusterH}`} width={clusterW} height={clusterH} className="flex-1">
                    <polyline points={pts} fill="none" stroke={c.color} strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                  <div className="flex items-center gap-1 text-xs font-bold w-16">
                    <span style={{ color: c.color }}>{latest}</span>
                    <span className={latest > prev ? 'text-red-500' : 'text-emerald-500'}>
                      {latest > prev ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Behavioral Drift Detection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><AlertTriangle size={17} className="text-amber-500" /> Behavioral Drift Detection</h3>
          <div className="space-y-3.5">
            {drifts.map((d, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-xs font-semibold text-slate-700 truncate">{d.label}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(d.drift / 0.35) * 100}%`,
                          background: d.drift > 0.2 ? '#ef4444' : d.drift > 0.1 ? '#f59e0b' : '#10b981',
                          boxShadow: d.drift > 0.2 ? '0 0 8px rgba(239,68,68,0.4)' : 'none',
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 w-10 text-right">{d.drift.toFixed(3)}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${
                  d.status === 'Alert' ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' :
                  d.status === 'Drifting' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-emerald-50 text-emerald-700 border-emerald-100'
                }`}>{d.status}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400">Drift threshold: <span className="font-bold text-amber-600">0.10</span> (warning) · <span className="font-bold text-red-600">0.20</span> (alert) — KL-divergence metric</p>
          </div>
        </div>
      </div>
    </div>
  );
};
