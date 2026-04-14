import { useState, useEffect } from 'react';
import { ActivitySquare, Zap, Target, ShieldCheck, TrendingUp, TrendingDown } from 'lucide-react';

// Mini sparkline component
const Sparkline = ({ data, color, width = 60, height = 20 }: { data: number[]; color: string; width?: number; height?: number }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  const area = `0,${height} ${pts} ${width},${height}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={area} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {/* Last dot */}
      {data.length > 0 && (
        <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * height} r="2" fill={color} stroke="white" strokeWidth="1" />
      )}
    </svg>
  );
};

export const KPICards = () => {
  const [volume, setVolume] = useState(424.5);
  const [tps, setTps] = useState(4205);
  const [blocked, setBlocked] = useState(1284);
  const [latency, setLatency] = useState(42);

  // Trailing history for sparklines
  const [volHistory, setVolHistory] = useState<number[]>(() => Array.from({ length: 20 }, () => 420 + Math.random() * 10));
  const [tpsHistory, setTpsHistory] = useState<number[]>(() => Array.from({ length: 20 }, () => 3800 + Math.random() * 800));
  const [blockHistory, setBlockHistory] = useState<number[]>(() => Array.from({ length: 20 }, () => 1280 + Math.random() * 10));
  const [latHistory, setLatHistory] = useState<number[]>(() => Array.from({ length: 20 }, () => 30 + Math.random() * 25));

  useEffect(() => {
    const id = setInterval(() => {
      setVolume(v => {
        const next = parseFloat((v + (Math.random() * 1.8 - 0.3)).toFixed(1));
        setVolHistory(h => [...h.slice(1), next]);
        return next;
      });
      setTps(t => {
        const next = Math.max(3800, Math.min(5200, t + Math.floor(Math.random() * 120 - 40)));
        setTpsHistory(h => [...h.slice(1), next]);
        return next;
      });
      setBlocked(b => {
        const next = b + (Math.random() < 0.35 ? 1 : 0);
        setBlockHistory(h => [...h.slice(1), next]);
        return next;
      });
      setLatency(l => {
        const next = Math.max(28, Math.min(68, l + Math.floor(Math.random() * 7 - 3)));
        setLatHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const volChange = ((volume - 424.5) / 424.5 * 100 + 2.8).toFixed(1);
  const tpsDelta = tps - 4000;

  const stats = [
    {
      label: 'Volume (24h)',
      value: `₹${volume}M`,
      change: `+${volChange}%`,
      isPos: true,
      icon: ActivitySquare,
      color: '#3b82f6',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      history: volHistory,
    },
    {
      label: 'Transactions/sec',
      value: tps.toLocaleString('en-IN'),
      change: `${tpsDelta >= 0 ? '+' : ''}${tpsDelta} from base`,
      isPos: tpsDelta >= 0,
      icon: Zap,
      color: '#10b981',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      history: tpsHistory,
    },
    {
      label: 'Fraud Blocked',
      value: blocked.toLocaleString('en-IN'),
      change: `+${blocked - 1284} new`,
      isPos: false,
      icon: ShieldCheck,
      color: '#6366f1',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      history: blockHistory,
    },
    {
      label: 'Avg Inference',
      value: `${latency}ms`,
      change: latency < 45 ? '✓ Under SLA' : '⚠ Above SLA',
      isPos: latency < 45,
      icon: Target,
      color: '#8b5cf6',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      history: latHistory,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, idx) => (
        <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all group">
          <div className="flex justify-between items-start mb-3">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon style={{ color: stat.color }} size={22} />
            </div>
            <div className="flex items-center gap-1">
              {stat.isPos ? <TrendingUp size={12} className="text-emerald-500" /> : <TrendingDown size={12} className="text-red-500" />}
              <span className={`text-xs font-semibold ${stat.isPos ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.label}</h3>
          <p className="text-3xl font-black text-slate-900 tracking-tight transition-all mb-3">{stat.value}</p>
          {/* Sparkline */}
          <Sparkline data={stat.history} color={stat.color} width={120} height={24} />
        </div>
      ))}
    </div>
  );
};
