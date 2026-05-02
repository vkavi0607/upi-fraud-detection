import React, { useState } from 'react';
import { Users, FileText, CheckCircle, AlertTriangle, Clock, Plus, X, ChevronDown, Filter } from 'lucide-react';
import { useToast } from './Toast';

type Status = 'Open' | 'In Review' | 'Escalated' | 'Closed (Fraud)' | 'Closed (False Pos)';
type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

type Case = {
  id: string;
  analyst: string;
  status: Status;
  priority: Priority;
  opened: string;
  txId: string;
  amount: string;
  cluster: string;
  notes: string;
};

const INIT_CASES: Case[] = [
  { id: 'CASE-208', analyst: 'Kavitha R.', status: 'Open', priority: 'Critical', opened: '2026-04-14', txId: 'TXN49816329', amount: '₹12.4L', cluster: 'Alpha-7', notes: 'Suspected mule account. GNN score 98.' },
  { id: 'CASE-207', analyst: 'Alice P.', status: 'Escalated', priority: 'Critical', opened: '2026-04-13', txId: 'TXN25841912', amount: '₹8.7L', cluster: 'Beta-2', notes: 'Multiple device hops across 3 states.' },
  { id: 'CASE-206', analyst: 'Bob M.', status: 'In Review', priority: 'High', opened: '2026-04-12', txId: 'TXN34483985', amount: '₹3.2L', cluster: 'Gamma-12', notes: 'Velocity spike — 200+ txns in 10 min.' },
  { id: 'CASE-205', analyst: 'Sarah L.', status: 'In Review', priority: 'Medium', opened: '2026-04-11', txId: 'TXN68114333', amount: '₹89K', cluster: 'Sigma-3', notes: 'Geospatial mismatch flagged by GNN.' },
  { id: 'CASE-204', analyst: 'Alice P.', status: 'Open', priority: 'High', opened: '2026-04-10', txId: 'TXN11293847', amount: '₹2.1L', cluster: 'Alpha-7', notes: 'New node connecting to known mule cluster.' },
  { id: 'CASE-203', analyst: 'Bob M.', status: 'Closed (Fraud)', priority: 'Critical', opened: '2026-04-08', txId: 'TXN90348821', amount: '₹22.1L', cluster: 'Alpha-7', notes: 'Confirmed fraud ring. SAR filed with RBI.' },
  { id: 'CASE-202', analyst: 'Sarah L.', status: 'Closed (False Pos)', priority: 'Low', opened: '2026-04-06', txId: 'TXN55674321', amount: '₹45K', cluster: 'None', notes: 'False positive. Business transaction confirmed.' },
];

const ANALYSTS = ['Alice P.', 'Bob M.', 'Kavitha R.', 'Sarah L.', 'Rajan S.', 'Meena V.'];
const STATUS_STYLE: Record<Status, string> = {
  'Open': 'bg-emerald-100 text-emerald-700',
  'In Review': 'bg-amber-100 text-amber-700',
  'Escalated': 'bg-red-100 text-red-700',
  'Closed (Fraud)': 'bg-slate-100 text-slate-600',
  'Closed (False Pos)': 'bg-slate-100 text-slate-500',
};
const PRIORITY_COLOR: Record<Priority, string> = {
  Critical: 'text-red-600', High: 'text-orange-600', Medium: 'text-amber-600', Low: 'text-slate-500'
};

export const Investigations = ({ searchTerm }: { searchTerm: string }) => {
  const { showToast } = useToast();
  const [cases, setCases] = useState<Case[]>(INIT_CASES);
  const [filterPri, setFilterPri] = useState<string>('All');
  const [filterStat, setFilterStat] = useState<string>('All');
  const [selected, setSelected] = useState<Case | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [sarModal, setSarModal] = useState<Case | null>(null);
  const [freezeModal, setFreezeModal] = useState<Case | null>(null);
  const [sarFiled, setSarFiled] = useState<string[]>([]);
  const [frozenCases, setFrozenCases] = useState<string[]>([]);
  const [freezeDur, setFreezeDur] = useState('72h');
  const [sarRef] = useState(() => `RBI-SAR-${Date.now().toString().slice(-7)}`);

  // new case form state
  const [nTxId, setNTxId] = useState('');
  const [nAmt, setNAmt] = useState('');
  const [nAnalyst, setNAnalyst] = useState(ANALYSTS[0]);
  const [nPri, setNPri] = useState<Priority>('High');
  const [nCluster, setNCluster] = useState('');
  const [nNotes, setNNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: Case = {
      id: `CASE-${209 + cases.length}`,
      analyst: nAnalyst,
      status: 'Open',
      priority: nPri,
      opened: new Date().toISOString().slice(0, 10),
      txId: nTxId || `TXN${Date.now().toString().slice(-8)}`,
      amount: nAmt || '₹?',
      cluster: nCluster || 'Pending',
      notes: nNotes,
    };
    setCases(prev => [newCase, ...prev]);
    setShowCreate(false);
    setNTxId(''); setNAmt(''); setNCluster(''); setNNotes('');
    showToast({ type: 'success', title: `✓ ${newCase.id} Opened`, message: `Assigned to ${nAnalyst} — Priority: ${nPri}.`, duration: 3500 });
  };

  const handleStatusChange = (id: string, status: Status) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
    showToast({ type: 'info', title: `Status Updated → ${status}`, message: `Case ${id} has been moved to ${status}.`, duration: 3000 });
  };

  const filtered = cases.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || c.id.toLowerCase().includes(term) || c.analyst.toLowerCase().includes(term) || c.txId.toLowerCase().includes(term);
    const matchPri = filterPri === 'All' || c.priority === filterPri;
    const matchStat = filterStat === 'All' || c.status === filterStat;
    return matchSearch && matchPri && matchStat;
  });

  const counts = { open: cases.filter(c => c.status === 'Open' || c.status === 'Escalated').length, review: cases.filter(c => c.status === 'In Review').length, closed: cases.filter(c => c.status.startsWith('Closed')).length };

  return (
    <div className="relative">

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-in zoom-in-95 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Open New Case</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Related TX ID', val: nTxId, set: setNTxId, ph: 'TXN49816329' },
                { label: 'Amount', val: nAmt, set: setNAmt, ph: '₹12,40,000' },
                { label: 'Fraud Cluster', val: nCluster, set: setNCluster, ph: 'Alpha-7' },
              ].map(f => (
                <div key={f.label} className={f.label === 'Related TX ID' ? 'col-span-2' : ''}>
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">{f.label}</label>
                  <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Assign Analyst</label>
                <select value={nAnalyst} onChange={e => setNAnalyst(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white font-semibold">
                  {ANALYSTS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Priority</label>
                <select value={nPri} onChange={e => setNPri(e.target.value as Priority)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 bg-white font-semibold">
                  {(['Critical', 'High', 'Medium', 'Low'] as Priority[]).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-1.5 block">Initial Notes</label>
                <textarea value={nNotes} onChange={e => setNNotes(e.target.value)} rows={2} placeholder="Describe the suspicious activity..." className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all resize-none" />
              </div>
            </div>
            <button type="submit" className="w-full mt-5 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition-all active:scale-95">Open Investigation</button>
          </form>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 z-30 backdrop-blur-sm flex justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right-8" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-black text-xl text-slate-900">{selected.id}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selected.txId} · {selected.amount}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Cluster', value: selected.cluster },
                  { label: 'Analyst', value: selected.analyst },
                  { label: 'Opened', value: selected.opened },
                  { label: 'Priority', value: selected.priority },
                ].map((f, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{f.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${f.label === 'Priority' ? PRIORITY_COLOR[selected.priority] : 'text-slate-800'}`}>{f.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Notes</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-4">{selected.notes || 'No notes added.'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['Open', 'In Review', 'Escalated', 'Closed (Fraud)', 'Closed (False Pos)'] as Status[]).map(s => (
                    <button key={s} onClick={() => handleStatusChange(selected.id, s)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${selected.status === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => setSarModal(selected)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${sarFiled.includes(selected.id) ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              >{sarFiled.includes(selected.id) ? '✓ SAR Filed' : 'File SAR Report'}</button>
              <button
                onClick={() => setFreezeModal(selected)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${frozenCases.includes(selected.id) ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-100'}`}
              >{frozenCases.includes(selected.id) ? '❄️ Frozen' : 'Request Freeze'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAR Filing Modal ─────────────────────────────────────────── */}
      {sarModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setSarModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-indigo-600 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">File SAR Report</p>
                <h3 className="text-white font-black text-xl mt-0.5">{sarModal.id} — {sarModal.cluster}</h3>
              </div>
              <button onClick={() => setSarModal(null)} className="text-indigo-300 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-3">
              {[{ l: 'Reference No.', v: sarRef }, { l: 'Transaction', v: sarModal.txId }, { l: 'Cluster', v: sarModal.cluster }, { l: 'Analyst', v: sarModal.analyst }, { l: 'Amount', v: sarModal.amount }, { l: 'Priority', v: sarModal.priority }].map(({ l, v }) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</span>
                  <span className="text-sm font-bold text-slate-900">{v}</span>
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">⚠️ Submitting SAR will notify RBI CPIO and lock this case for regulatory review.</div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setSarModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setSarFiled(p => [...p, sarModal.id]); handleStatusChange(sarModal.id, 'Closed (Fraud)'); setSarModal(null); setSelected(null); showToast({ type: 'action', title: `📄 SAR Filed — ${sarModal.id}`, message: `Ref ${sarRef} submitted to RBI. Case closed as Fraud.`, duration: 5000 }); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm active:scale-95">
                {sarFiled.includes(sarModal.id) ? '✓ Already Filed' : 'Confirm & Submit to RBI'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Freeze Confirmation Modal ─────────────────────────────────── */}
      {freezeModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setFreezeModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 fade-in" onClick={e => e.stopPropagation()}>
            <div className="bg-red-600 px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-red-200 text-xs font-bold uppercase tracking-widest">Account Freeze Request</p>
                <h3 className="text-white font-black text-xl mt-0.5">{freezeModal.txId}</h3>
              </div>
              <button onClick={() => setFreezeModal(null)} className="text-red-300 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[{ l: 'Case', v: freezeModal.id }, { l: 'Amount', v: freezeModal.amount }, { l: 'Cluster', v: freezeModal.cluster }, { l: 'Analyst', v: freezeModal.analyst }].map(({ l, v }) => (
                <div key={l} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{l}</span>
                  <span className="text-sm font-bold text-slate-900">{v}</span>
                </div>
              ))}
              <div>
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Freeze Duration</p>
                <div className="grid grid-cols-3 gap-2">
                  {['24h', '48h', '72h', '7d', '14d', 'Indefinite'].map(d => (
                    <button key={d} onClick={() => setFreezeDur(d)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${freezeDur === d ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200 hover:border-red-300'}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 font-medium">❄️ Freeze via NPCI API. Account will be locked within 2-4 hours.</div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setFreezeModal(null)} className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setFrozenCases(p => [...p, freezeModal.id]); setFreezeModal(null); showToast({ type: 'error', title: `❄️ Freeze Applied — ${freezeModal.txId}`, message: `${freezeDur} freeze sent to NPCI. ${freezeModal.amount} under hold.`, duration: 5000 }); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-sm active:scale-95">
                {frozenCases.includes(freezeModal.id) ? '✓ Already Frozen' : `Apply ${freezeDur} Freeze`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 w-full">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="text-indigo-600" size={22} /> Case Management</h2>
            <div className="flex gap-2 text-xs font-bold">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-full">{counts.open} Active</span>
              <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">{counts.review} In Review</span>
              <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full">{counts.closed} Closed</span>
            </div>
          </div>
          <button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md">
            <Plus size={16} /> Open New Case
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold"><Filter size={13} /> Filter:</div>
          <select value={filterPri} onChange={e => setFilterPri(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer">
            <option value="All">All Priorities</option>
            {['Critical', 'High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
          </select>
          <select value={filterStat} onChange={e => setFilterStat(e.target.value)} className="text-xs font-bold border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-indigo-400 cursor-pointer">
            <option value="All">All Statuses</option>
            {['Open', 'In Review', 'Escalated', 'Closed (Fraud)', 'Closed (False Pos)'].map(s => <option key={s}>{s}</option>)}
          </select>
          <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} cases</span>
        </div>

        <div className="grid gap-3">
          {filtered.length === 0 && <p className="text-center text-slate-400 py-10">No cases match filters.</p>}
          {filtered.map(c => (
            <div key={c.id} onClick={() => setSelected(c)}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status.startsWith('Closed') ? 'bg-slate-100 text-slate-400' : c.status === 'Escalated' ? 'bg-red-100 text-red-500' : 'bg-indigo-100 text-indigo-600'}`}>
                  {c.status.startsWith('Closed') ? <CheckCircle size={20} /> : c.status === 'Escalated' ? <AlertTriangle size={20} /> : <FileText size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900">{c.id}</h4>
                    <span className="font-mono text-xs text-indigo-600">{c.txId}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-semibold">{c.cluster}</span>
                  </div>
                  <p className="text-sm text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>{c.analyst}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <Clock size={11} /> {c.opened}
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="font-bold text-slate-700">{c.amount}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                <span className={`text-sm font-bold ${PRIORITY_COLOR[c.priority]}`}>{c.priority}</span>
                <ChevronDown size={16} className="text-slate-300 group-hover:text-indigo-400 -rotate-90 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


