import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FileText, Clock, AlertTriangle, CheckCircle2, ChevronRight, Shield, User, Calendar, GitBranch, Link2, ArrowRight, Zap, Eye, MapPin, X, Network } from 'lucide-react';
import { useToast } from './Toast';
import { GraphVisualizer } from './GraphVisualizer';

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const SAR_CASES = [
  { id: 'SAR-1041', account: 'UPI*9876', risk: 98, cluster: 'Alpha-7', analyst: 'Kavitha R.', daysOpen: 3, stage: 'Pending RBI Sign-off', amount: '₹12.4L', progress: 75 },
  { id: 'SAR-1039', account: 'UPI*4423', risk: 92, cluster: 'Beta-2', analyst: 'Rajan S.', daysOpen: 5, stage: 'Evidence Collection', amount: '₹8.7L', progress: 45 },
  { id: 'SAR-1037', account: 'UPI*7781', risk: 88, cluster: 'Gamma-1', analyst: 'Meena V.', daysOpen: 8, stage: 'Legal Review', amount: '₹22.1L', progress: 60 },
  { id: 'SAR-1033', account: 'UPI*3311', risk: 95, cluster: 'Alpha-7', analyst: 'Kavitha R.', daysOpen: 12, stage: 'Awaiting Court Subpoena', amount: '₹4.2L', progress: 30 },
];

const TIMELINE = [
  { time: '09:12', action: 'Graph traversal matched TXN998 to Cluster Alpha-7', type: 'alert' },
  { time: '09:45', action: 'SAR-1041 escalated to Level-3 review queue', type: 'escalate' },
  { time: '10:30', action: 'Geospatial hop confirmed: Mumbai → Hyderabad → Dubai', type: 'info' },
  { time: '11:00', action: 'Bank freeze applied on HDFC Acc #XXXX-4421 via NPCI API', type: 'action' },
  { time: '14:20', action: 'RBI CPIO notified via encrypted email (AES-256)', type: 'info' },
  { time: '15:05', action: 'New mule node discovered — Sigma-3 cluster updated', type: 'alert' },
];

// Evidence chain data
const EVIDENCE_CHAIN = [
  { id: 'E1', type: 'transaction', label: 'TXN49816329', amount: '₹4.2L', time: '09:12', flagged: true },
  { id: 'E2', type: 'account', label: 'UPI*9876', detail: 'Mule account', time: '09:14', flagged: true },
  { id: 'E3', type: 'device', label: 'DEV-A1', detail: 'Cloned IMEI', time: '09:18', flagged: true },
  { id: 'E4', type: 'transaction', label: 'TXN49816342', amount: '₹2.8L', time: '09:22', flagged: false },
  { id: 'E5', type: 'ip', label: '45.33.32.156', detail: 'TOR Exit', time: '09:25', flagged: true },
  { id: 'E6', type: 'account', label: 'UPI*4421', detail: 'Beneficiary', time: '09:30', flagged: false },
];

// Link analysis nodes
const LINK_NODES = [
  { id: 'L1', label: 'UPI*9876', x: 50, y: 30, type: 'mule', score: 98 },
  { id: 'L2', label: 'UPI*4421', x: 20, y: 60, type: 'suspect', score: 85 },
  { id: 'L3', label: 'DEV-A1', x: 80, y: 55, type: 'device', score: 71 },
  { id: 'L4', label: 'IP-TOR', x: 40, y: 85, type: 'ip', score: 94 },
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

type SarCase = typeof SAR_CASES[0];

export const InvestigatorOverview = () => {
  const { showToast } = useToast();
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [graphCase, setGraphCase] = useState<SarCase | null>(null);
  const [sarModal, setSarModal] = useState<SarCase | null>(null);
  const [freezeModal, setFreezeModal] = useState<SarCase | null>(null);
  const [evidenceModal, setEvidenceModal] = useState<SarCase | null>(null);
  const [sarSubmitted, setSarSubmitted] = useState<string[]>([]);
  const [frozenAccounts, setFrozenAccounts] = useState<string[]>([]);
  const [freezeDuration, setFreezeDuration] = useState('72h');
  const [sarRef] = useState(() => `RBI-SAR-${Date.now().toString().slice(-7)}`);
  const [progress, setProgress] = useState({ sar: 4, freeze: 7, rbi: 2 });
  const [sarCases, setSarCases] = useState(SAR_CASES);
  const [linkNodes, setLinkNodes] = useState(LINK_NODES);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(p => ({
        sar: Math.max(1, Math.min(10, p.sar + (Math.random() < 0.3 ? 1 : 0))),
        freeze: Math.max(1, Math.min(20, p.freeze + (Math.random() < 0.2 ? 1 : 0))),
        rbi: Math.max(0, Math.min(8, p.rbi + (Math.random() < 0.15 ? 1 : 0))),
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

      {/* ── Full-Screen Graph Modal — rendered via portal to escape stacking context ── */}
      {graphCase && ReactDOM.createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col"
          style={{ zIndex: 99999 }}
          onClick={() => setGraphCase(null)}
        >
          <div
            className="flex-1 flex flex-col m-6 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Network size={20} className="text-indigo-400" />
                  <span className="text-white font-black text-lg whitespace-nowrap">
                    GNN Topology — Cluster {graphCase.cluster}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold flex-wrap">
                  <span className="bg-indigo-900/60 text-indigo-300 border border-indigo-700 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {graphCase.id}
                  </span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                    <User size={10} /> {graphCase.analyst}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full border font-bold whitespace-nowrap ${
                    graphCase.risk > 94 ? 'bg-red-900/50 text-red-300 border-red-700'
                    : 'bg-orange-900/50 text-orange-300 border-orange-700'
                  }`}>
                    Risk {graphCase.risk}
                  </span>
                  <span className="bg-slate-800 text-slate-300 border border-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {graphCase.amount}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setGraphCase(null)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all active:scale-95 flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Graph canvas */}
            <div className="flex-1 min-h-0">
              <GraphVisualizer hideHeader />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── SAR Filing Modal ─────────────────────────────────────────────── */}
      {sarModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setSarModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-indigo-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">File SAR to RBI</p>
                  <h3 className="text-white font-black text-xl mt-0.5">{sarModal.id} — Cluster {sarModal.cluster}</h3>
                </div>
                <button onClick={() => setSarModal(null)} className="text-indigo-300 hover:text-white p-1"><X size={20} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[{ l: 'Reference No.', v: sarRef }, { l: 'Account', v: sarModal.account }, { l: 'Cluster', v: sarModal.cluster }, { l: 'Analyst', v: sarModal.analyst }, { l: 'Amount at Risk', v: sarModal.amount }, { l: 'Stage', v: sarModal.stage }].map(({ l, v }) => (
                <div key={l} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</span>
                  <span className="text-sm font-bold text-slate-900">{v}</span>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
                ⚠️ Submitting this SAR will notify RBI CPIO and lock this case for regulatory review.
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSarModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setSarSubmitted(p => [...p, sarModal.id]); setSarModal(null); setProgress(p => ({ ...p, rbi: p.rbi + 1 })); showToast({ type: 'action', title: `📄 SAR Filed — ${sarModal.id}`, message: `Ref ${sarRef} submitted to RBI CPIO via encrypted channel.`, duration: 5000 }); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-colors active:scale-95">
                {sarSubmitted.includes(sarModal.id) ? '✓ Already Filed' : 'Confirm & Submit to RBI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Account Freeze Modal ──────────────────────────────────────────── */}
      {freezeModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setFreezeModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-red-600 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-200 text-xs font-bold uppercase tracking-widest">Request Account Freeze</p>
                  <h3 className="text-white font-black text-xl mt-0.5">{freezeModal.account}</h3>
                </div>
                <button onClick={() => setFreezeModal(null)} className="text-red-300 hover:text-white p-1"><X size={20} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[{ l: 'Case', v: freezeModal.id }, { l: 'Cluster', v: freezeModal.cluster }, { l: 'Amount', v: freezeModal.amount }, { l: 'Analyst', v: freezeModal.analyst }].map(({ l, v }) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</span>
                  <span className="text-sm font-bold text-slate-900">{v}</span>
                </div>
              ))}
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Freeze Duration</p>
                <div className="grid grid-cols-3 gap-2">
                  {['24h', '48h', '72h', '7d', '14d', 'Indefinite'].map(d => (
                    <button key={d} onClick={() => setFreezeDuration(d)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${freezeDuration === d ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 font-medium">❄️ Freeze request sent via NPCI API. Account {freezeModal.account} will be locked within 2-4 hours.</div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setFreezeModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => { setFrozenAccounts(p => [...p, freezeModal.account]); setFreezeModal(null); setProgress(p => ({ ...p, freeze: p.freeze + 1 })); showToast({ type: 'error', title: `❄️ Freeze Applied — ${freezeModal.account}`, message: `${freezeDuration} freeze sent to NPCI. ${freezeModal.amount} under hold.`, duration: 5000 }); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm transition-colors active:scale-95">
                {frozenAccounts.includes(freezeModal.account) ? '✓ Already Frozen' : `Apply ${freezeDuration} Freeze`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Evidence Chain Modal ──────────────────────────────────────────── */}
      {evidenceModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setEvidenceModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-purple-700 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-bold uppercase tracking-widest">Evidence Chain</p>
                <h3 className="text-white font-black text-xl mt-0.5">{evidenceModal.id} — {evidenceModal.cluster}</h3>
              </div>
              <button onClick={() => setEvidenceModal(null)} className="text-purple-300 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-0 overflow-x-auto pb-4">
                {EVIDENCE_CHAIN.map((e, i) => (
                  <div key={e.id} className="flex items-center shrink-0">
                    <div className={`p-3 rounded-xl border-2 min-w-[130px] ${e.flagged ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white ${e.type === 'transaction' ? 'bg-indigo-500' : e.type === 'account' ? 'bg-amber-500' : e.type === 'device' ? 'bg-purple-500' : 'bg-red-500'}`}>
                          {e.type === 'transaction' ? 'TX' : e.type === 'account' ? 'AC' : e.type === 'device' ? 'DV' : 'IP'}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{e.label}</span>
                        {e.flagged && <span className="w-2 h-2 bg-red-500 rounded-full ml-auto" />}
                      </div>
                      <p className="text-[10px] text-slate-500">{e.amount || e.detail}</p>
                      <p className="text-[9px] text-slate-400 mt-1 flex items-center gap-1"><Clock size={8} />{e.time}</p>
                    </div>
                    {i < EVIDENCE_CHAIN.length - 1 && <div className="flex items-center px-1"><div className={`w-6 h-0.5 ${EVIDENCE_CHAIN[i + 1].flagged ? 'bg-red-300' : 'bg-slate-200'}`} /><ArrowRight size={10} className={EVIDENCE_CHAIN[i + 1].flagged ? 'text-red-400' : 'text-slate-300'} /></div>}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-red-600">{EVIDENCE_CHAIN.filter(e => e.flagged).length}</p><p className="text-xs text-slate-500 font-semibold">Flagged Nodes</p></div>
                <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-indigo-600">{evidenceModal.progress}%</p><p className="text-xs text-slate-500 font-semibold">Chain Verified</p></div>
                <div className="bg-slate-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-emerald-600">{evidenceModal.cluster}</p><p className="text-xs text-slate-500 font-semibold">Cluster</p></div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setEvidenceModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">Close</button>
              <button onClick={() => { setSarModal(evidenceModal); setEvidenceModal(null); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold text-sm transition-colors active:scale-95">Proceed to File SAR</button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Investigator Workspace</h2>
        <p className="text-slate-500 font-medium">Deep-graph investigations, SAR compliance, evidence chain, and link analysis.</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'SARs Pending RBI', value: progress.sar, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50', badge: 'Critical' },
          { label: 'Accounts Frozen', value: progress.freeze, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50', badge: 'Active Enforcement' },
          { label: 'RBI Notifications', value: progress.rbi, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', badge: 'Sent Today' },
        ].map((k, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${k.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <k.icon className={k.color} size={26} />
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
              <div className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md min-w-[130px] ${e.flagged ? 'border-red-200 bg-red-50/50 hover:border-red-400' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
                }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-white ${e.type === 'transaction' ? 'bg-indigo-500' : e.type === 'account' ? 'bg-amber-500' : e.type === 'device' ? 'bg-purple-500' : 'bg-red-500'
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
            <h3 className="font-bold text-slate-900 flex items-center gap-2"><AlertTriangle size={17} className="text-rose-500" /> Priority SAR Queue</h3>
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
                        <User size={10} /> {c.analyst} · <Calendar size={10} /> {c.daysOpen}d open · {c.amount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${stageColors[c.stage] || 'bg-slate-100 text-slate-500'}`}>{c.stage}</span>
                    <ChevronRight size={16} className={`text-slate-400 transition-transform ${openCase === c.id ? 'rotate-90' : ''}`} />
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
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSarModal(c); }}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors active:scale-95 ${sarSubmitted.includes(c.id) ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                      >{sarSubmitted.includes(c.id) ? '✓ SAR Filed' : 'File SAR to RBI'}</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFreezeModal(c); }}
                        className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors active:scale-95 ${frozenAccounts.includes(c.account) ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-100'}`}
                      >{frozenAccounts.includes(c.account) ? '❄️ Frozen' : 'Request Account Freeze'}</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setGraphCase(c); }}
                        className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-4 py-2 rounded-lg transition-colors active:scale-95"
                      >View Graph</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEvidenceModal(c); }}
                        className="text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 px-4 py-2 rounded-lg transition-colors active:scale-95 flex items-center gap-1"
                      ><Eye size={11} /> Evidence Chain</button>
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
              <h3 className="font-bold text-slate-900 flex items-center gap-2"><Clock size={16} className="text-indigo-500" /> Today's Activity</h3>
            </div>
            <div className="p-5 space-y-4 overflow-auto">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex gap-3 text-xs">
                  <span className="font-mono text-slate-400 shrink-0 pt-0.5">{t.time}</span>
                  <div className="flex gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.type === 'alert' ? 'bg-red-400' : t.type === 'action' ? 'bg-indigo-400' : t.type === 'escalate' ? 'bg-orange-400' : 'bg-slate-300'}`} />
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
