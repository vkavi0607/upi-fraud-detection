import { Target, Search, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';

export const TransactionRisk = () => (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Transaction Risk Analysis Protocol</h2>
      <p className="text-slate-500 font-medium mb-8">Deep dive isolated environment assessing the physical feature vectors intrinsically flagged by the ML pipeline.</p>
      
      <div className="grid grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-extrabold text-xl text-slate-900 mb-6 border-b border-slate-100 pb-4 flex items-center gap-3"><Search className="text-slate-400"/> Isolated Risk Scoring Vectors Breakdown</h3>
            <div className="space-y-8">
               <div>
                  <div className="flex justify-between text-sm font-extrabold mb-2"><span className="text-slate-600">Velocity Risk Constraint (Txn Frequency Limit Breakdown)</span><span className="text-rose-600 text-base">88% Flag</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full w-[88%] shadow-[0_0_10px_rgba(225,29,72,0.5)]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm font-extrabold mb-2"><span className="text-slate-600">Geospatial IP Anomaly Mismatch</span><span className="text-amber-600 text-base">65% Flag</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full w-[65%] shadow-[0_0_10px_rgba(217,119,6,0.5)]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm font-extrabold mb-2"><span className="text-slate-600">Deep Graph Network Structural Connection Density</span><span className="text-indigo-600 text-base">94% Flag</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full w-[94%] shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div></div>
               </div>
               <div>
                  <div className="flex justify-between text-sm font-extrabold mb-2"><span className="text-slate-600">Device Fingerprint Novelty Threshold</span><span className="text-emerald-600 text-base">12% Safe</span></div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full w-[12%]"></div></div>
               </div>
            </div>
         </div>
         <div className="bg-slate-900 p-10 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center relative overflow-hidden border border-slate-800">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
            
            <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 ring-4 ring-rose-500/20">
               <AlertTriangle size={48} className="text-rose-500 drop-shadow-lg" />
            </div>
            <h3 className="text-white font-black text-3xl tracking-tight">System Recommendation: BLOCK</h3>
            <p className="text-slate-400 font-medium mt-4 text-lg leading-relaxed max-w-sm">The GNN Graph Topology model highly confirms a 94.2% vector alignment strictly tying this intent with an active and globally known structured fraud ring (Cluster Alpha).</p>
            <button className="mt-8 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_30px_rgba(225,29,72,0.6)] active:scale-95 tracking-wide">
               Acknowledge & Enforce UPI Block
            </button>
         </div>
      </div>
   </div>
);

export const FraudTrends = () => (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Macro Fraud Trend Analysis</h2>
      <p className="text-slate-500 font-medium mb-8">Visualization aggregation of continuously intercepted, parsed, and logged attacks isolated over the last 30 operational days.</p>
      
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex-1 flex flex-col items-center justify-center min-h-[400px]">
         <div className="text-center">
             <div className="relative w-32 h-32 mx-auto mb-6">
                 <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-50"></div>
                 <div className="absolute inset-0 flex items-center justify-center bg-indigo-50 rounded-full z-10">
                     <TrendingUp size={48} className="text-indigo-400" />
                 </div>
             </div>
             <p className="text-slate-900 text-xl font-extrabold mb-2 tracking-tight">Connecting Visualization Submodule via Websocket...</p>
             <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed border border-slate-100 bg-slate-50 p-4 rounded-xl mt-4 shadow-inner">Establishing real-time synchronization protocol with TimescaleDB time-series relational aggregation streams to dynamically project mapping heatmap geometry on layer grid.</p>
         </div>
      </div>
   </div>
);
