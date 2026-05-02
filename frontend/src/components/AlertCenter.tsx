import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, RefreshCw, ShieldAlert, X, FileText, Zap, CheckCircle, User, AlertOctagon } from 'lucide-react';
import { useToast } from './Toast';

const BASE_ALERTS = [
  { id: 'ALT-8291', txId: 'TXN49816329', severity: 'Critical', time: 120,   rule: 'GNN Risk > 90 (Mule Cluster Alpha-7)' },
  { id: 'ALT-8290', txId: 'TXN25841912', severity: 'High',     time: 900,   rule: 'Velocity Spike (Device Fingerprint)' },
  { id: 'ALT-8289', txId: 'TXN34483985', severity: 'High',     time: 2200,  rule: 'GNN Risk > 80 (Fast-Flow Pattern)' },
  { id: 'ALT-8288', txId: 'TXN68114333', severity: 'Medium',   time: 4800,  rule: 'Unusual Geospatial IP Mismatch' },
  { id: 'ALT-8287', txId: 'TXN11293847', severity: 'Critical', time: 7200,  rule: 'Identity Spoof Ring (Cluster Beta-2)' },
  { id: 'ALT-8286', txId: 'TXN90348821', severity: 'Medium',   time: 10800, rule: 'SIM-Swap Correlation Flag' },
];

type Alert = typeof BASE_ALERTS[0];

function formatAge(secs: number) {
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs/60)}m ago`;
  return `${Math.floor(secs/3600)}h ago`;
}

export const AlertCenter = ({ searchTerm }: { searchTerm: string }) => {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [escalated, setEscalated] = useState<string[]>([]);
  const [caseOpened, setCaseOpened] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);
  const [investigateAlert, setInvestigateAlert] = useState<Alert | null>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const tick = setInterval(() => setCounter(c => c + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() < 0.4) {
        const newId = `ALT-${8292 + alerts.length}`;
        const pick = ['GNN Risk > 92 (New Mule Node)','Velocity Anomaly (>200 txn/min)','Device Clone Detected','Cross-Border IP Hop','Rapid Fund Drain Pattern'];
        setAlerts(prev => [{
          id: newId,
          txId: `TXN${Math.floor(Math.random()*90000000+10000000)}`,
          severity: Math.random() < 0.4 ? 'Critical' : 'High',
          time: 0,
          rule: pick[Math.floor(Math.random()*pick.length)],
        }, ...prev].slice(0, 12));
      }
    }, 8000);
    return () => clearInterval(id);
  }, [alerts.length]);

  const visible = alerts
    .filter(a => !dismissed.includes(a.id))
    .filter(a => {
      if (!searchTerm) return true;
      const t = searchTerm.toLowerCase();
      return a.id.toLowerCase().includes(t) || a.txId.toLowerCase().includes(t) || a.rule.toLowerCase().includes(t);
    });

  const critCount = visible.filter(a => a.severity === 'Critical').length;

  const sevColor = (s: string) =>
    s === 'Critical' ? 'bg-red-100 text-red-700' :
    s === 'High'     ? 'bg-orange-100 text-orange-700' :
                       'bg-yellow-100 text-yellow-700';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden relative">

      {/* ── Investigate Side Drawer ─────────────────────────────────────── */}
      {investigateAlert && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex justify-end"
          onClick={() => { setInvestigateAlert(null); setNotes(''); }}
        >
          <div
            className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right-8 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className={`px-6 py-5 flex items-center justify-between flex-shrink-0 ${
              investigateAlert.severity === 'Critical' ? 'bg-red-600' :
              investigateAlert.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-500'
            }`}>
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Investigation</p>
                <h3 className="text-white font-black text-xl mt-0.5">{investigateAlert.id}</h3>
              </div>
              <button onClick={() => { setInvestigateAlert(null); setNotes(''); }} className="text-white/70 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-5">
              {/* Alert Details */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                {[
                  { l: 'Alert ID',     v: investigateAlert.id },
                  { l: 'Transaction',  v: investigateAlert.txId },
                  { l: 'Severity',     v: investigateAlert.severity },
                  { l: 'Trigger Rule', v: investigateAlert.rule },
                  { l: 'Age',          v: formatAge(investigateAlert.time + counter) },
                ].map(({ l, v }) => (
                  <div key={l} className="flex justify-between items-start gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide shrink-0">{l}</span>
                    <span className={`text-xs font-bold text-right ${l === 'Severity' ? (investigateAlert.severity === 'Critical' ? 'text-red-600' : investigateAlert.severity === 'High' ? 'text-orange-600' : 'text-yellow-600') : 'text-slate-800'}`}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {escalated.includes(investigateAlert.id) && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><AlertOctagon size={11}/> Escalated to L3</span>
                )}
                {caseOpened.includes(investigateAlert.id) && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-1"><FileText size={11}/> Case Opened</span>
                )}
              </div>

              {/* Investigation Notes */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Investigation Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Document your findings, anomalies, or initial assessment..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all resize-none text-slate-700"
                />
              </div>

              {/* Recommended Actions */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Recommended Actions</p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setEscalated(p => [...p, investigateAlert.id]);
                      showToast({ type: 'error', title: `🚨 Escalated — ${investigateAlert.id}`, message: `${investigateAlert.rule} escalated to Level-3 analyst queue.`, duration: 4000 });
                    }}
                    disabled={escalated.includes(investigateAlert.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                      escalated.includes(investigateAlert.id)
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-default'
                        : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    <AlertOctagon size={16} />
                    {escalated.includes(investigateAlert.id) ? '✓ Escalated to L3' : 'Escalate to Level-3'}
                  </button>
                  <button
                    onClick={() => {
                      setCaseOpened(p => [...p, investigateAlert.id]);
                      showToast({ type: 'action', title: `📋 Case Opened — ${investigateAlert.id}`, message: `Investigation case created for ${investigateAlert.txId}. Assigned to analyst queue.`, duration: 4000 });
                    }}
                    disabled={caseOpened.includes(investigateAlert.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                      caseOpened.includes(investigateAlert.id)
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-default'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    <FileText size={16} />
                    {caseOpened.includes(investigateAlert.id) ? '✓ Case Already Opened' : 'Open Investigation Case'}
                  </button>
                  <button
                    onClick={() => {
                      setDismissed(d => [...d, investigateAlert.id]);
                      setInvestigateAlert(null);
                      setNotes('');
                      showToast({ type: 'success', title: `Alert ${investigateAlert.id} Acknowledged`, message: 'Reviewed and removed from active queue.', duration: 3000 });
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold border bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 transition-all active:scale-95"
                  >
                    <CheckCircle size={16} />
                    Acknowledge &amp; Close
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
              <button
                onClick={() => { setInvestigateAlert(null); setNotes(''); }}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
              >Close</button>
              <button
                onClick={() => {
                  if (notes.trim()) {
                    showToast({ type: 'success', title: 'Notes Saved', message: `Investigation notes for ${investigateAlert.id} saved successfully.`, duration: 3000 });
                  }
                  setInvestigateAlert(null);
                  setNotes('');
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm transition-colors active:scale-95"
              >Save &amp; Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/30">
        <div className="flex items-center gap-3">
          <div className="relative">
            <AlertTriangle className="text-red-500" size={22} />
            {critCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                {critCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Active Alerts
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">{visible.length}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Live — new alerts stream automatically</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed([])}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RefreshCw size={13}/> Reset
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500 sticky top-0">
            <tr>
              <th className="py-3.5 px-5">Alert ID</th>
              <th className="py-3.5 px-5">Related TX</th>
              <th className="py-3.5 px-5">Severity</th>
              <th className="py-3.5 px-5">Trigger Rule</th>
              <th className="py-3.5 px-5">Age</th>
              <th className="py-3.5 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">No active alerts matching criteria.</td>
              </tr>
            )}
            {visible.map(alert => (
              <tr key={alert.id} className={`hover:bg-slate-50 transition-colors ${alert.time === 0 ? 'animate-in fade-in slide-in-from-top-2 bg-red-50/40' : ''}`}>
                <td className="py-3.5 px-5 font-mono text-sm text-slate-900 font-bold">
                  <div className="flex items-center gap-2">
                    {alert.id}
                    {escalated.includes(alert.id) && <span className="text-[9px] font-black bg-red-100 text-red-600 px-1.5 py-0.5 rounded">L3</span>}
                    {caseOpened.includes(alert.id) && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">CASE</span>}
                  </div>
                </td>
                <td className="py-3.5 px-5 font-mono text-sm text-indigo-600 cursor-pointer hover:underline">{alert.txId}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${sevColor(alert.severity)}`}>
                    {alert.severity === 'Critical' && <ShieldAlert size={11}/>}
                    {alert.severity}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-sm text-slate-600 max-w-[240px] truncate">{alert.rule}</td>
                <td className="py-3.5 px-5 text-sm text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
                  <Clock size={13}/>{formatAge(alert.time + counter)}
                </td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInvestigateAlert(alert)}
                      className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors active:scale-95"
                    >
                      Investigate
                    </button>
                    <button
                      onClick={() => {
                        setDismissed(d => [...d, alert.id]);
                        showToast({ type: 'success', title: `Alert ${alert.id} Dismissed`, message: `${alert.rule} — Removed from queue.`, duration: 3000 });
                      }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition-colors active:scale-95"
                    >
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
