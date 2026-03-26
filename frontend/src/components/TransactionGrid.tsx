import { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, ActivitySquare } from 'lucide-react';

type Transaction = {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  time: string;
  score: number;
  status: 'Clean' | 'Review' | 'Blocked';
};

export const TransactionGrid = ({ searchTerm }: { searchTerm: string }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // ACTUAL REAL-TIME WEBSOCKET CONNECTION
    const ws = new WebSocket('ws://localhost:8000/ws/transactions');
    
    ws.onmessage = (event) => {
      const tx = JSON.parse(event.data);
      setTransactions(prev => [tx, ...prev].slice(0, 50));
    };

    return () => {
      ws.close();
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score > 90) return 'text-red-700 bg-red-100 border-red-200';
    if (score > 75) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-emerald-700 bg-emerald-100 border-emerald-200';
  };

  const filteredTransactions = transactions.filter(tx => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return tx.id.toLowerCase().includes(term) || 
           tx.sender.toLowerCase().includes(term) || 
           tx.receiver.toLowerCase().includes(term);
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-sm w-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ActivitySquare size={20} className="text-indigo-600" />
            Live Ingest Stream (Real WebSocket)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Listening to API Gateway Event Bus</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold animate-pulse shadow-sm">
          <Cpu size={16} />
          WS Connected
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 sticky top-0 text-xs text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Tx ID</th>
              <th className="py-4 px-6">Entities</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6">Risk Score</th>
              <th className="py-4 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 && (
               <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Waiting for live transactions from API Gateway...
                </td>
              </tr>
            )}
            {filteredTransactions.map((tx, idx) => (
              <tr key={tx.id + idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-4 px-6 text-sm font-mono font-medium text-slate-700">{tx.id}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1 text-sm font-medium">
                    <span className="text-slate-900">{tx.sender} <span className="text-slate-400 font-normal">→</span></span>
                    <span className="text-slate-600">{tx.receiver}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-bold text-slate-700">{tx.amount}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-24">
                      <div 
                        className={`h-full rounded-full ${tx.score > 90 ? 'bg-red-500' : tx.score > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${tx.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-700 w-8">{tx.score}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(tx.score)}`}>
                    {tx.status === 'Clean' ? <Shield size={12} /> : <ShieldAlert size={12} />}
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
