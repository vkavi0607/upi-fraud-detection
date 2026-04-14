import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, ActivitySquare, Wifi, WifiOff } from 'lucide-react';

type Transaction = {
  id: string;
  _key: number;
  sender: string;
  receiver: string;
  amount: string;
  time: string;
  score: number;
  status: 'Clean' | 'Review' | 'Blocked';
};

// --- Simulation helpers ---
const SENDERS  = ['raj.kumar@okaxis','priya.s@okhdfcbank','arun@okicici','meena.v@oksbi','kiran@okaxis','deepak@okhdfc','sunita@okybl','vinod@okunion'];
const RCVRS    = ['merchant:flipkart_blr','merchant:amazon_che','upi:9876543210@okaxis','wallet:gpay_9988','merchant:swiggy_hyd','bank:HDFC0012345','wallet:paytm_8765'];
const CHANNELS = ['GPAY','PHONEPE','PAYTM','BHIM','AMAZONPAY'];

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

let _seq = 0;
function generateTx(): Transaction {
  const score = Math.random() < 0.15 ? rand(85, 99) : Math.random() < 0.2 ? rand(70, 84) : rand(5, 65);
  const status: Transaction['status'] = score > 90 ? 'Blocked' : score > 74 ? 'Review' : 'Clean';
  const amt = score > 85 ? rand(50000, 999999) : rand(100, 49999);
  const channel = pick(CHANNELS);
  return {
    id: `TXN${Date.now().toString().slice(-8)}${rand(10,99)}`,
    _key: ++_seq,
    sender: pick(SENDERS),
    receiver: pick(RCVRS),
    amount: `₹${amt.toLocaleString('en-IN')}`,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    score,
    status,
  };
}

// Seed with initial data
const SEED: Transaction[] = Array.from({ length: 18 }, generateTx);

export const TransactionGrid = ({ searchTerm }: { searchTerm: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED);
  const [isLive, setIsLive] = useState(true);
  const [newRowId, setNewRowId] = useState<string>('');

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const tx = generateTx();
      setNewRowId(tx.id);
      setTransactions(prev => [tx, ...prev].slice(0, 60));
      setTimeout(() => setNewRowId(''), 800);
    }, rand(900, 2400)); // new tx every 0.9–2.4 s

    return () => clearInterval(interval);
  }, [isLive]);

  const getScoreStyle = (score: number) => {
    if (score > 90) return 'text-red-700 bg-red-100 border-red-200';
    if (score > 74) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-emerald-700 bg-emerald-100 border-emerald-200';
  };

  const filtered = transactions.filter(tx => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return tx.id.toLowerCase().includes(t) || tx.sender.toLowerCase().includes(t) || tx.receiver.toLowerCase().includes(t);
  });

  const blockedCount = transactions.filter(t => t.status === 'Blocked').length;
  const reviewCount  = transactions.filter(t => t.status === 'Review').length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm w-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ActivitySquare size={20} className="text-indigo-600" />
            Live Ingest Stream
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-3">
            <span>{transactions.length} transactions · </span>
            <span className="text-red-600 font-semibold">{blockedCount} blocked</span>
            <span className="text-amber-600 font-semibold">{reviewCount} review</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(p => !p)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all shadow-sm ${
              isLive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 animate-pulse'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {isLive ? <><Cpu size={15}/> LIVE</> : <><WifiOff size={15}/> PAUSED</>}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-5">Tx ID</th>
              <th className="py-3.5 px-5">Entities</th>
              <th className="py-3.5 px-5">Amount</th>
              <th className="py-3.5 px-5">Risk Score</th>
              <th className="py-3.5 px-5">Time</th>
              <th className="py-3.5 px-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <tr
                key={tx._key}
                className={`transition-all ${tx.id === newRowId ? 'bg-indigo-50/80 scale-[1.001]' : 'hover:bg-slate-50/80'}`}
              >
                <td className="py-3.5 px-5 text-xs font-mono font-bold text-slate-700">{tx.id}</td>
                <td className="py-3.5 px-5">
                  <div className="flex flex-col gap-0.5 text-xs font-medium">
                    <span className="text-slate-800 truncate max-w-[140px]">{tx.sender}</span>
                    <span className="text-slate-400">→ <span className="text-slate-600 truncate">{tx.receiver}</span></span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-sm font-bold text-slate-800 whitespace-nowrap">{tx.amount}</td>
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${tx.score > 90 ? 'bg-red-500' : tx.score > 74 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${tx.score}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-bold w-6 text-right ${tx.score > 90 ? 'text-red-600' : tx.score > 74 ? 'text-amber-600' : 'text-emerald-600'}`}>{tx.score}</span>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-xs text-slate-400 font-mono whitespace-nowrap">{tx.time}</td>
                <td className="py-3.5 px-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getScoreStyle(tx.score)}`}>
                    {tx.status === 'Clean' ? <Shield size={11}/> : <ShieldAlert size={11}/>}
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
