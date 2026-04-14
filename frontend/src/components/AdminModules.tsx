import React, { useState, useEffect } from 'react';
import { Server, Users, Cpu, Activity, ShieldCheck, Database, Search, Plus, X, CheckCircle, AlertCircle, RefreshCw, Download } from 'lucide-react';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ─── USER MANAGEMENT ─────────────────────────────────────────────────────────
export const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Raj Patil',    email: 'analyst@guardupi.gov',      initial: 'R', avatarClass: 'bg-indigo-100 text-indigo-700',  role: 'Fraud Analyst',       roleClass: 'bg-blue-50 text-blue-700 border-blue-100',         mfa: 'Disabled',       mfaClass: 'bg-red-50 text-red-700 border-red-100',       lastLogin: '2 mins ago',     active: true  },
    { id: 2, name: 'Alice Smith',  email: 'admin@guardupi.gov',        initial: 'A', avatarClass: 'bg-slate-900 text-white shadow',  role: 'Admin Level',         roleClass: 'bg-slate-900 text-white shadow-sm border-transparent',mfa: 'Auth App Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',lastLogin: 'Active Now',     active: true  },
    { id: 3, name: 'Priya Gupta', email: 'investigator@guardupi.gov',  initial: 'P', avatarClass: 'bg-rose-100 text-rose-700',       role: 'Senior Investigator', roleClass: 'bg-rose-50 text-rose-700 border-rose-100',         mfa: 'SMS Bound',      mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',lastLogin: '12 hours ago',   active: false },
    { id: 4, name: 'Arjun Mehta', email: 'risk@guardupi.gov',          initial: 'M', avatarClass: 'bg-purple-100 text-purple-700',   role: 'Risk Manager',        roleClass: 'bg-purple-50 text-purple-700 border-purple-100',   mfa: 'Auth App Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',lastLogin: '1 hour ago',     active: false },
  ]);
  const [search, setSearch]     = useState('');
  const [showAdd, setShowAdd]   = useState(false);
  const [newName, setNewName]   = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole]   = useState('Fraud Analyst');
  const [toast, setToast]       = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleProvision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const initials = newName.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    setUsers(prev => [{
      id: Date.now(), name: newName, email: newEmail, initial: initials,
      avatarClass: 'bg-indigo-100 text-indigo-700', role: newRole,
      roleClass: 'bg-blue-50 text-blue-700 border-blue-100',
      mfa: 'Disabled', mfaClass: 'bg-red-50 text-red-700 border-red-100',
      lastLogin: 'Never', active: false,
    }, ...prev]);
    setShowAdd(false); setNewName(''); setNewEmail(''); setNewRole('Fraud Analyst');
    showToast(`✓ ${newName} provisioned successfully`);
  };

  const handleMfaToggle = (id: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const next = u.mfa === 'Disabled' ? 'SMS Bound' : u.mfa === 'SMS Bound' ? 'Auth App Bound' : 'Disabled';
      const cls  = next === 'Disabled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100';
      return { ...u, mfa: next, mfaClass: cls };
    }));
    showToast('MFA policy updated');
  };
  const handleRevoke = (id: number) => { setUsers(prev => prev.filter(u => u.id !== id)); showToast('Access revoked'); };
  const handleReset  = (id: number) => showToast(`Security keys regenerated for user #${id}`);

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xl animate-in slide-in-from-top-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400"/> {toast}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 font-medium">Manage analysts, assign roles, enforce Zero-Trust MFA.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all w-52"/>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95 flex items-center gap-2">
            <Plus size={16}/> Provision Analyst
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <form onSubmit={handleProvision} onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Provision New Analyst</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all" placeholder="e.g. Kavitha Rajan"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Email</label>
                <input required type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all" placeholder="analyst@guardupi.gov"/>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Clearance Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all bg-white font-semibold">
                  {['Fraud Analyst','Senior Investigator','Risk Manager','Admin'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all active:scale-95">Provision Access</button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Summary bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-6 text-xs font-semibold text-slate-500">
          <span>{users.length} total users</span>
          <span className="text-emerald-600">{users.filter(u => u.active).length} active now</span>
          <span className="text-red-600">{users.filter(u => u.mfa === 'Disabled').length} without MFA</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-extrabold tracking-wider">
            <tr><th className="p-5">Staff Member</th><th className="p-5">Clearance Role</th><th className="p-5">MFA Status</th><th className="p-5">Last Session</th><th className="p-5">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-sm">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${u.avatarClass} relative`}>
                    {u.initial}
                    {u.active && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"/>}
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold">{u.name}</p>
                    <p className="text-xs text-slate-400">{u.email}</p>
                  </div>
                </td>
                <td className="p-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${u.roleClass}`}>{u.role}</span></td>
                <td className="p-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${u.mfaClass}`}>{u.mfa}</span></td>
                <td className="p-5 font-bold flex items-center gap-1.5 min-h-[72px]">
                  {u.active ? <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/><span className="text-emerald-600">{u.lastLogin}</span></> : <span className="text-slate-500">{u.lastLogin}</span>}
                </td>
                <td className="p-5">
                  <div className="flex gap-3">
                    <button onClick={() => handleMfaToggle(u.id)} className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors active:scale-95">Enforce MFA</button>
                    <button onClick={() => handleReset(u.id)}     className="text-slate-400 font-bold hover:text-indigo-600 transition-colors">Reset Keys</button>
                    <button onClick={() => handleRevoke(u.id)}    className="text-rose-600 font-bold hover:text-rose-800 transition-colors">Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-slate-400">No users match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── ML MODEL STATUS ──────────────────────────────────────────────────────────
export const MLModelStatus = () => {
  const [latency,   setLatency]   = useState(14.2);
  const [vectors,   setVectors]   = useState(4.2);
  const [vram,      setVram]      = useState(14.8);
  const [loss,      setLoss]      = useState(0.0214);
  const [f1,        setF1]        = useState(0.9622);
  const [epoch,     setEpoch]     = useState(450);
  const [history,   setHistory]   = useState<number[]>(Array.from({length:20}, () => 0.02 + Math.random()*0.01));

  useEffect(() => {
    const id = setInterval(() => {
      setLatency(v => parseFloat((Math.max(9, Math.min(22, v + (Math.random()*2-1))).toFixed(1))));
      setVectors(v => parseFloat((Math.max(3.8, Math.min(5.1, v + (Math.random()*0.2-0.1))).toFixed(1))));
      setVram(v    => parseFloat((Math.max(12, Math.min(15.9, v + (Math.random()*0.4-0.2))).toFixed(1))));
      setLoss(v    => parseFloat((Math.max(0.018, Math.min(0.035, v + (Math.random()*0.002-0.001))).toFixed(4))));
      setF1(v      => parseFloat((Math.max(0.94, Math.min(0.98, v + (Math.random()*0.004-0.002))).toFixed(4))));
      setEpoch(v   => v + 1);
      setHistory(h => [...h.slice(1), 0.018 + Math.random()*0.015]);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  // Loss sparkline
  const W = 260, H = 52;
  const maxL = Math.max(...history), minL = Math.min(...history);
  const pts = history.map((v, i) =>
    `${(i / (history.length-1)) * W},${H - ((v-minL) / (maxL-minL+0.001)) * H}`
  ).join(' ');

  const vramPct = (vram / 16) * 100;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">ML Model Status</h2>
        <p className="text-slate-500 font-medium">Live GNN inference telemetry — updates every 2.5s.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* GraphSAGE card */}
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg flex items-center gap-2"><Cpu className="text-indigo-600" size={22}/> GraphSAGE Topology</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg flex items-center gap-1 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"/> ACTIVE
            </span>
          </div>
          <div className="space-y-4 text-sm font-medium">
            {[
              { label: 'Inference Latency', value: `${latency} ms / tx`,          color: latency < 16 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50' },
              { label: 'Vectors / hour',    value: `${vectors}M`,                  color: 'text-slate-900 bg-slate-50' },
              { label: 'VRAM Usage',        value: `${vram} GB / 16.0 GB`,         color: vram > 15 ? 'text-red-700 bg-red-50' : 'text-slate-900 bg-slate-50' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-500">{r.label}</span>
                <span className={`font-bold text-sm px-3 py-1 rounded-md transition-all ${r.color}`}>{r.value}</span>
              </div>
            ))}
            {/* VRAM bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1"><span>VRAM Load</span><span>{vramPct.toFixed(0)}%</span></div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${vramPct > 93 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${vramPct}%` }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Training card */}
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg flex items-center gap-2"><Activity className="text-rose-600" size={22}/> Pattern Training</h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1 rounded-lg">EPOCH {epoch}</span>
          </div>
          <div className="space-y-4 text-sm font-medium">
            {[
              { label: 'Compute Array',  value: 'AWS A100 Matrix',                   color: 'text-amber-700 bg-amber-50' },
              { label: 'Cross-Entropy ↓',value: loss.toFixed(4),                     color: 'text-emerald-700 bg-emerald-50' },
              { label: 'F1 Score',       value: f1.toFixed(4),                       color: 'text-indigo-700 bg-indigo-50' },
            ].map((r, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-500">{r.label}</span>
                <span className={`font-bold text-sm px-3 py-1 rounded-md transition-all ${r.color}`}>{r.value}</span>
              </div>
            ))}
            {/* Loss sparkline */}
            <div>
              <p className="text-xs text-slate-400 mb-1.5">Cross-Entropy Loss Trend</p>
              <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="overflow-visible">
                <defs>
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <polyline points={`0,${H} ${pts} ${W},${H}`} fill="url(#lossGrad)"/>
                <polyline points={pts} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Model registry */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Database size={17} className="text-slate-400"/>
          <h3 className="font-bold text-slate-900">Model Registry</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <tr><th className="px-6 py-3">Model</th><th className="px-6 py-3">Version</th><th className="px-6 py-3">F1 Score</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Deployed</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'GraphSAGE GNN',       ver: 'v2.4.1', f1: f1.toFixed(4),   status: 'Production', date: '2026-04-01' },
              { name: 'Gradient Boost Rules', ver: 'v1.8.0', f1: '0.9401',        status: 'Shadow',     date: '2026-03-15' },
              { name: 'GraphSAGE GNN',       ver: 'v2.3.0', f1: '0.9589',        status: 'Archived',   date: '2026-02-10' },
            ].map((m, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-3.5 font-semibold text-slate-800">{m.name}</td>
                <td className="px-6 py-3.5 font-mono text-slate-600">{m.ver}</td>
                <td className="px-6 py-3.5 font-mono font-bold text-indigo-700">{m.f1}</td>
                <td className="px-6 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${m.status === 'Production' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : m.status === 'Shadow' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-500'}`}>
                    {m.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-slate-400 text-xs">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
const LOG_POOL = [
  (ts: string) => ({ t: ts, lvl: 'INFO',  cat: 'AUTH',  msg: `Zero-Trust session granted. JWT injected for analyst #${rand(800,999)}`, color: 'text-blue-400' }),
  (ts: string) => ({ t: ts, lvl: 'INFO',  cat: 'K8S',   msg: `HPA scaled Transaction pods: ${rand(3,5)} → ${rand(6,9)} (CPU ${rand(70,90)}%)`, color: 'text-blue-400' }),
  (ts: string) => ({ t: ts, lvl: 'WARN',  cat: 'SEC',   msg: `Brute-force attempt from IP 45.${rand(1,255)}.${rand(1,255)}.${rand(1,100)}. Geoblock applied.`, color: 'text-rose-400' }),
  (ts: string) => ({ t: ts, lvl: 'SYS',   cat: 'NEO4J', msg: `Batch graph merge committed ${rand(8000,14000).toLocaleString()} edges in ${rand(90,210)}ms`, color: 'text-indigo-400' }),
  (ts: string) => ({ t: ts, lvl: 'MODEL', cat: 'TRITON',msg: `Inference batch complete — ${rand(1800,2200)} vectors @ ${rand(10,18)}ms`, color: 'text-purple-400' }),
  (ts: string) => ({ t: ts, lvl: 'DATA',  cat: 'KAFKA', msg: `Partition lag normalized. Consumer offset delta: 0`, color: 'text-amber-400' }),
  (ts: string) => ({ t: ts, lvl: 'INFO',  cat: 'DB',    msg: `TimescaleDB chunk compressed — saved ${rand(1,5)}.${rand(1,9)} GB`, color: 'text-emerald-400' }),
  (ts: string) => ({ t: ts, lvl: 'ALERT', cat: 'FRAUD', msg: `GNN flagged TXN${rand(10000000,99999999)} — risk ${rand(88,99)}% → Cluster Alpha-7`, color: 'text-red-400' }),
];

function nowTs() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}

const LVL_COLOR: Record<string, string> = { INFO:'text-blue-400', WARN:'text-rose-400', SYS:'text-indigo-400', MODEL:'text-purple-400', DATA:'text-amber-400', ALERT:'text-red-400' };

export const AuditLogs = () => {
  const [filter, setFilter] = useState<string>('ALL');
  const [logs, setLogs] = useState(() =>
    Array.from({ length: 10 }, (_, i) => {
      const fn = LOG_POOL[i % LOG_POOL.length];
      return fn(nowTs());
    })
  );

  useEffect(() => {
    const id = setInterval(() => {
      const fn = LOG_POOL[rand(0, LOG_POOL.length - 1)];
      setLogs(prev => [fn(nowTs()), ...prev].slice(0, 50));
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const filtered = logs.filter(l => filter === 'ALL' || l.lvl === filter);
  const levels = ['ALL', 'INFO', 'WARN', 'ALERT', 'SYS', 'MODEL', 'DATA'];

  const handleDownload = () => {
    const txt = logs.map(l => `[${l.t}] ${l.lvl.padEnd(5)} [${l.cat}] ${l.msg}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    a.download = `guardupi_audit_${Date.now()}.log`;
    a.click();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-180px)] flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cryptographic Audit Logs</h2>
          <p className="text-slate-500 font-medium">Immutable system event stream — live tail with {logs.length} events captured.</p>
        </div>
        <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-sm font-bold transition-all active:scale-95">
          <Download size={15}/> Export .log
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 flex-wrap">
        {levels.map(l => (
          <button key={l} onClick={() => setFilter(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === l ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
            {l}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} events</span>
      </div>

      {/* Log terminal */}
      <div className="bg-[#0b0f19] rounded-2xl flex-1 overflow-y-auto p-6 font-mono text-sm border border-slate-800 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-5 pointer-events-none"/>
        <div className="space-y-1.5">
          {filtered.map((log, i) => (
            <div key={i} className={`flex gap-3 items-start leading-snug ${i === 0 ? 'animate-in fade-in slide-in-from-top-1' : ''}`}>
              <span className="text-slate-600 shrink-0">[{log.t}]</span>
              <span className={`font-bold shrink-0 w-14 ${LVL_COLOR[log.lvl] ?? 'text-slate-400'}`}>{log.lvl}</span>
              <span className="text-slate-500 shrink-0 w-16">[{log.cat}]</span>
              <span className="text-emerald-300">{log.msg}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-slate-600 text-xs">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"/>
          Streaming live...
        </div>
      </div>
    </div>
  );
};
