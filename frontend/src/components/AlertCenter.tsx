import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, RefreshCw, ShieldAlert } from 'lucide-react';

const BASE_ALERTS = [
  { id: 'ALT-8291', txId: 'TXN49816329', severity: 'Critical', time: 120,   rule: 'GNN Risk > 90 (Mule Cluster Alpha-7)' },
  { id: 'ALT-8290', txId: 'TXN25841912', severity: 'High',     time: 900,   rule: 'Velocity Spike (Device Fingerprint)' },
  { id: 'ALT-8289', txId: 'TXN34483985', severity: 'High',     time: 2200,  rule: 'GNN Risk > 80 (Fast-Flow Pattern)' },
  { id: 'ALT-8288', txId: 'TXN68114333', severity: 'Medium',   time: 4800,  rule: 'Unusual Geospatial IP Mismatch' },
  { id: 'ALT-8287', txId: 'TXN11293847', severity: 'Critical', time: 7200,  rule: 'Identity Spoof Ring (Cluster Beta-2)' },
  { id: 'ALT-8286', txId: 'TXN90348821', severity: 'Medium',   time: 10800, rule: 'SIM-Swap Correlation Flag' },
];

function formatAge(secs: number) {
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs/60)}m ago`;
  return `${Math.floor(secs/3600)}h ago`;
}

export const AlertCenter = ({ searchTerm }: { searchTerm: string }) => {
  const [alerts, setAlerts] = useState(BASE_ALERTS);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [counter, setCounter] = useState(0);

  // Age all alerts every second
  useEffect(() => {
    const tick = setInterval(() => setCounter(c => c + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  // Occasionally add a new critical alert
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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
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
                <td className="py-3.5 px-5 font-mono text-sm text-slate-900 font-bold">{alert.id}</td>
                <td className="py-3.5 px-5 font-mono text-sm text-indigo-600 cursor-pointer hover:underline">{alert.txId}</td>
                <td className="py-3.5 px-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                    alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'High'     ? 'bg-orange-100 text-orange-700' :
                                                   'bg-yellow-100 text-yellow-700'
                  }`}>
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
                    <button className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors">
                      Investigate
                    </button>
                    <button
                      onClick={() => setDismissed(d => [...d, alert.id])}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg text-xs font-bold transition-colors"
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
