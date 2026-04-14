import { useState, useEffect } from 'react';
import { Server, Users, Cpu, Database, Activity, CheckCircle, AlertCircle, Clock, Wifi, HardDrive, MemoryStick, Gauge, Zap, Shield } from 'lucide-react';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const SERVICES = [
  { name: 'API Gateway',         region: 'ap-south-1', status: 'Healthy' },
  { name: 'Auth Service',        region: 'ap-south-1', status: 'Healthy' },
  { name: 'Transaction Service', region: 'ap-south-1', status: 'Healthy' },
  { name: 'Graph Service',       region: 'us-east-1',  status: 'Degraded' },
  { name: 'Alert Service',       region: 'ap-south-1', status: 'Healthy' },
  { name: 'Triton Inference',    region: 'us-east-1',  status: 'Healthy' },
  { name: 'Kafka Broker',        region: 'ap-south-1', status: 'Healthy' },
  { name: 'TimescaleDB',         region: 'ap-south-1', status: 'Healthy' },
];

const LOG_TEMPLATES = [
  (ts: string) => `<slate>[${ts}]</slate> <blue>INFO</blue> [K8S] HPA scaled Transaction pods: 4 → 6 (CPU 78%)`,
  (ts: string) => `<slate>[${ts}]</slate> <indigo>SYS</indigo>  [NEO4J] Graph traversal committed 8,241 edges in 142ms`,
  (ts: string) => `<slate>[${ts}]</slate> <blue>INFO</blue> [AUTH] Session token refreshed for analyst #${rand(800,999)}`,
  (ts: string) => `<slate>[${ts}]</slate> <purple>MODEL</purple> GraphSAGE inference batch complete — 2048 vectors`,
  (ts: string) => `<slate>[${ts}]</slate> <rose>WARN</rose>  [SEC] Rate-limit triggered from IP 45.${rand(1,255)}.${rand(1,255)}.${rand(1,100)}`,
  (ts: string) => `<slate>[${ts}]</slate> <amber>KAFKA</amber> Partition lag normalized — offset delta 0`,
  (ts: string) => `<slate>[${ts}]</slate> <green>INFO</green> [DB] TimescaleDB chunk compression saved 3.2 GB`,
];

// Pod data
const PODS = [
  { name: 'txn-svc-0', status: 'Running', cpu: 72, mem: 61 },
  { name: 'txn-svc-1', status: 'Running', cpu: 68, mem: 58 },
  { name: 'txn-svc-2', status: 'Running', cpu: 81, mem: 74 },
  { name: 'txn-svc-3', status: 'Running', cpu: 45, mem: 42 },
  { name: 'txn-svc-4', status: 'Running', cpu: 55, mem: 50 },
  { name: 'txn-svc-5', status: 'Pending', cpu: 0,  mem: 0 },
  { name: 'auth-svc-0', status: 'Running', cpu: 34, mem: 28 },
  { name: 'auth-svc-1', status: 'Running', cpu: 29, mem: 25 },
  { name: 'graph-svc-0', status: 'Running', cpu: 88, mem: 82 },
  { name: 'graph-svc-1', status: 'CrashLoop', cpu: 0, mem: 0 },
  { name: 'alert-svc-0', status: 'Running', cpu: 41, mem: 36 },
  { name: 'triton-0', status: 'Running', cpu: 92, mem: 89 },
];

// Incident data
const INCIDENTS = [
  { id: 'INC-042', severity: 'Critical', title: 'Graph Service pod restart loop', resolver: 'SRE Bot', status: 'Mitigated', time: '2h ago' },
  { id: 'INC-041', severity: 'High',     title: 'Kafka partition lag spike > 10K', resolver: 'Arjun M.', status: 'Resolved', time: '4h ago' },
  { id: 'INC-040', severity: 'Medium',   title: 'Auth service 5xx burst (rate limit)', resolver: 'Auto-heal', status: 'Resolved', time: '8h ago' },
  { id: 'INC-039', severity: 'Low',      title: 'TLS cert renewal warning (7d)', resolver: 'Pending', status: 'Open', time: '12h ago' },
];

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}

// Circular Gauge component
const CircularGauge = ({ value, max, label, unit, color, size = 80 }: { value: number; max: number; label: string; unit: string; color: string; size?: number }) => {
  const pct = (value / max) * 100;
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const dangerColor = pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : color;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dangerColor} strokeWidth="6"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.7s ease, stroke 0.3s' }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-lg font-black" style={{ color: dangerColor }}>{value}</span>
        <span className="text-[9px] text-slate-400 font-semibold">{unit}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-500 mt-0.5">{label}</p>
    </div>
  );
};

export const AdminOverview = () => {
  const [nodes,    setNodes]    = useState(9);
  const [gpu,      setGpu]      = useState(88);
  const [sessions, setSessions] = useState(1245);
  const [dbOps,    setDbOps]    = useState(42300);
  const [cpuPct,   setCpuPct]   = useState(72);
  const [memPct,   setMemPct]   = useState(64);
  const [netMbps,  setNetMbps]  = useState(842);
  const [diskPct,  setDiskPct]  = useState(58);
  const [logs, setLogs] = useState([
    LOG_TEMPLATES[0](nowTs()),
    LOG_TEMPLATES[4](nowTs()),
    LOG_TEMPLATES[2](nowTs()),
  ]);
  const [services, setServices] = useState(SERVICES);
  const [pods, setPods] = useState(PODS);

  useEffect(() => {
    const id = setInterval(() => {
      setGpu(g      => Math.max(60, Math.min(99, g + rand(-5, 5))));
      setSessions(s => Math.max(1100, Math.min(1500, s + rand(-15, 20))));
      setDbOps(d    => Math.max(38000, Math.min(55000, d + rand(-800, 1200))));
      setCpuPct(v   => Math.max(40, Math.min(98, v + rand(-4, 5))));
      setMemPct(v   => Math.max(35, Math.min(92, v + rand(-3, 4))));
      setNetMbps(v  => Math.max(400, Math.min(1200, v + rand(-50, 60))));
      setDiskPct(v  => Math.min(95, v + (Math.random() < 0.2 ? 1 : 0)));
      setPods(prev  => prev.map(p => ({
        ...p,
        cpu: p.status === 'Running' ? Math.max(10, Math.min(99, p.cpu + rand(-5, 6))) : 0,
        mem: p.status === 'Running' ? Math.max(10, Math.min(95, p.mem + rand(-4, 5))) : 0,
      })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Stream a new log line every 3s
  useEffect(() => {
    const id = setInterval(() => {
      const tmpl = LOG_TEMPLATES[rand(0, LOG_TEMPLATES.length - 1)];
      setLogs(prev => [tmpl(nowTs()), ...prev].slice(0, 14));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Occasionally flip Graph Service status
  useEffect(() => {
    const id = setInterval(() => {
      setServices(prev => prev.map(s =>
        s.name === 'Graph Service'
          ? { ...s, status: Math.random() < 0.5 ? 'Healthy' : 'Degraded' }
          : s
      ));
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const kpis = [
    { label: 'EKS Nodes Healthy', value: `${nodes} / 10`,      sub: 'ap-south-1',         icon: Server,   color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'GPU Utilization',   value: `${gpu}%`,             sub: 'A10g Multi-Instance', icon: Cpu,      color: gpu > 90 ? 'text-red-600' : 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Active Sessions',   value: sessions.toLocaleString('en-IN'), sub: 'analysts online',   icon: Users,    color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'DB Ops / sec',      value: dbOps.toLocaleString('en-IN'),    sub: 'TimescaleDB',        icon: Database, color: 'text-emerald-600',bg: 'bg-emerald-50' },
  ];

  const renderLog = (raw: string, i: number) => {
    const colorMap: Record<string, string> = {
      slate: '#64748b', blue: '#60a5fa', indigo: '#818cf8',
      purple: '#c084fc', rose: '#fb7185', amber: '#fcd34d',
      green: '#34d399',
    };
    const parts = raw.split(/(<[^>]+>.*?<\/[^>]+>)/g);
    return (
      <p key={i} className="mb-1.5 text-[13px] leading-snug">
        {parts.map((part, j) => {
          const m = part.match(/<(\w+)>(.*?)<\/\w+>/);
          if (m) return <span key={j} style={{ color: colorMap[m[1]] ?? '#94a3b8' }}>{m[2]}</span>;
          return <span key={j} className="text-emerald-300">{part}</span>;
        })}
      </p>
    );
  };

  const podStatusColor = (s: string) => s === 'Running' ? 'bg-emerald-500' : s === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-7">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">System Admin Control Center</h2>
        <p className="text-slate-500 font-medium">Live infrastructure topology, resource gauges, pod health, and streaming ops log.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-11 h-11 rounded-xl ${k.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <k.icon className={k.color} size={22}/>
            </div>
            <p className="text-xs text-slate-500 font-semibold mb-1">{k.label}</p>
            <p className={`text-2xl font-black ${k.color} transition-all`}>{k.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Resource Gauges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
          <Gauge size={17} className="text-indigo-500" /> Infrastructure Resource Utilization
        </h3>
        <div className="flex justify-around items-center">
          <div className="relative">
            <CircularGauge value={cpuPct} max={100} label="CPU Cluster" unit="%" color="#6366f1" />
          </div>
          <div className="relative">
            <CircularGauge value={memPct} max={100} label="Memory" unit="%" color="#8b5cf6" />
          </div>
          <div className="relative">
            <CircularGauge value={Math.round(netMbps)} max={1200} label="Network I/O" unit="Mbps" color="#06b6d4" />
          </div>
          <div className="relative">
            <CircularGauge value={diskPct} max={100} label="Disk Usage" unit="%" color="#10b981" />
          </div>
          <div className="relative">
            <CircularGauge value={gpu} max={100} label="GPU (A10g)" unit="%" color="#ec4899" />
          </div>
        </div>
      </div>

      {/* Pod Topology + Service Health side by side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Kubernetes Pod Topology */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Zap size={16} className="text-indigo-500" /> Kubernetes Pod Topology
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {pods.map((p, i) => (
              <div key={i} className="relative p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={`w-2 h-2 rounded-full ${podStatusColor(p.status)}`} />
                  <span className="text-[10px] font-bold text-slate-700 truncate">{p.name}</span>
                </div>
                {p.status === 'Running' ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-slate-400 w-6">CPU</span>
                      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${p.cpu > 85 ? 'bg-red-500' : p.cpu > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${p.cpu}%` }} />
                      </div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 w-6 text-right">{p.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[8px] text-slate-400 w-6">MEM</span>
                      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${p.mem > 85 ? 'bg-red-500' : p.mem > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${p.mem}%` }} />
                      </div>
                      <span className="text-[8px] font-mono font-bold text-slate-400 w-6 text-right">{p.mem}%</span>
                    </div>
                  </div>
                ) : (
                  <p className={`text-[9px] font-bold ${p.status === 'Pending' ? 'text-amber-600' : 'text-red-600'}`}>{p.status}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Running ({pods.filter(p => p.status === 'Running').length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending ({pods.filter(p => p.status === 'Pending').length})</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Failed ({pods.filter(p => p.status === 'CrashLoop').length})</span>
          </div>
        </div>

        {/* Service health + incidents */}
        <div className="flex flex-col gap-6">
          {/* Service health table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
              <Activity size={17} className="text-indigo-500"/>
              <h3 className="font-bold text-slate-900 text-sm">Microservice Health</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[200px] overflow-auto">
              {services.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.region}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    s.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                  }`}>
                    {s.status === 'Healthy' ? <CheckCircle size={10}/> : <AlertCircle size={10}/>}
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Response Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Shield size={15} className="text-rose-500" /> Incident Response (24h)
            </h3>
            <div className="space-y-2.5">
              {INCIDENTS.map((inc, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white shrink-0 ${
                    inc.severity === 'Critical' ? 'bg-red-500' : inc.severity === 'High' ? 'bg-orange-500' : inc.severity === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                  }`}>
                    {inc.severity.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 truncate">{inc.title}</p>
                    <p className="text-[9px] text-slate-400 flex items-center gap-2">
                      {inc.resolver} · <Clock size={8} /> {inc.time}
                    </p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    inc.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' : inc.status === 'Mitigated' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>{inc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live ops log */}
      <div className="bg-[#0b0f19] rounded-2xl border border-slate-800 shadow-xl flex flex-col overflow-hidden" style={{ height: 280 }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live Ops Log</span>
          </div>
          <Clock size={14} className="text-slate-500"/>
        </div>
        <div className="flex-1 overflow-auto p-5 font-mono space-y-0">
          {logs.map((l, i) => renderLog(l, i))}
        </div>
      </div>
    </div>
  );
};
