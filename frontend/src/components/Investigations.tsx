import { Users, FileText, CheckCircle } from 'lucide-react';

export const Investigations = ({ searchTerm }: { searchTerm: string }) => {
  const cases = [
    { id: 'CASE-204', analyst: 'Alice P.', status: 'Open', priority: 'High', opened: '2026-03-25' },
    { id: 'CASE-203', analyst: 'Bob M.', status: 'In Review', priority: 'Medium', opened: '2026-03-24' },
    { id: 'CASE-202', analyst: 'Alice P.', status: 'Closed (Fraud)', priority: 'Critical', opened: '2026-03-22' },
    { id: 'CASE-201', analyst: 'Sarah L.', status: 'Closed (False Pos)', priority: 'Low', opened: '2026-03-21' },
  ];

  const filtered = cases.filter(c => !searchTerm || c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.analyst.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Users className="text-indigo-600" />
          Case Management
        </h2>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
          + Create New Case
        </button>
      </div>
      
      <div className="grid gap-4">
        {filtered.map(c => (
          <div key={c.id} className="flex items-center justify-between p-5 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer bg-white">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.status.includes('Closed') ? 'bg-slate-100 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                {c.status.includes('Closed') ? <CheckCircle size={20} /> : <FileText size={20} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{c.id}</h4>
                <p className="text-sm text-slate-500">Assigned to: {c.analyst} • Opened: {c.opened}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                c.status === 'Open' ? 'bg-emerald-100 text-emerald-700' :
                c.status === 'In Review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {c.status}
              </span>
              <span className={`text-sm font-semibold ${c.priority === 'High' || c.priority === 'Critical' ? 'text-red-600' : 'text-slate-600'}`}>
                {c.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
