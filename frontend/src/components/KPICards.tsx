import { ActivitySquare, Zap, Target, ShieldCheck } from 'lucide-react';

const stats = [
  { label: 'Total Volume (24h)', value: '₹424.5M', change: '+12.5%', isPositive: true, icon: ActivitySquare, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { label: 'Transactions/sec', value: '4,205', change: '+341', isPositive: true, icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Fraud Attempts Blocked', value: '1,284', change: '+14%', isPositive: false, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  { label: 'Avg Inference Latency', value: '42ms', change: '-2ms', isPositive: true, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
];

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stat.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {stat.change}
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};
