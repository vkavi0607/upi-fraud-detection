import { AlertTriangle, Clock } from 'lucide-react';

export const AlertCenter = ({ searchTerm }: { searchTerm: string }) => {
  const alerts = [
    { id: 'ALT-8291', txId: 'TXN49816329', severity: 'Critical', time: '2 mins ago', rule: 'GNN Risk > 90 (Mule Cluster)' },
    { id: 'ALT-8290', txId: 'TXN25841912', severity: 'High', time: '15 mins ago', rule: 'Velocity Spike (Device)' },
    { id: 'ALT-8289', txId: 'TXN34483985', severity: 'Medium', time: '1 hour ago', rule: 'Unusual IP location' },
    { id: 'ALT-8288', txId: 'TXN68114333', severity: 'High', time: '3 hours ago', rule: 'GNN Risk > 80 (Fast Flow)' },
  ];

  const filtered = alerts.filter(a => !searchTerm || a.id.toLowerCase().includes(searchTerm.toLowerCase()) || a.txId.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-red-50/30">
        <AlertTriangle className="text-red-500" size={24} />
        <div>
          <h2 className="text-xl font-bold text-slate-900">Active Alerts</h2>
          <p className="text-sm text-slate-500">Requires immediate analyst review</p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-0">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="py-4 px-6">Alert ID</th>
              <th className="py-4 px-6">Related TX</th>
              <th className="py-4 px-6">Severity</th>
              <th className="py-4 px-6">Trigger Rule</th>
              <th className="py-4 px-6">Time</th>
              <th className="py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(alert => (
              <tr key={alert.id} className="hover:bg-slate-50">
                <td className="py-4 px-6 font-mono text-sm text-slate-900 font-bold">{alert.id}</td>
                <td className="py-4 px-6 font-mono text-sm text-indigo-600 cursor-pointer hover:underline">{alert.txId}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {alert.severity}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-slate-600">{alert.rule}</td>
                <td className="py-4 px-6 text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock size={14} /> {alert.time}
                </td>
                <td className="py-4 px-6">
                  <button className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold transition-colors">
                    Investigate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
