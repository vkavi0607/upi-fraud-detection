import { Globe, BarChart3 } from 'lucide-react';

export const RiskManagerOverview = () => (
   <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-2">
         <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Executive Risk Dashboard</h2>
         <p className="text-slate-500 font-medium">Aggregated ML KPIs and Global Intelligence monitoring.</p>
      </div>
      
      <div className="bg-slate-900 p-8 rounded-2xl shadow-xl col-span-2 flex justify-between items-center relative overflow-hidden">
         <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-20 pointer-events-none" />
         <div className="relative z-10">
            <h3 className="font-extrabold text-white text-xl mb-2 tracking-wide">24h System-Wide Fraud Prevented</h3>
            <p className="text-slate-400 font-medium">Real-time estimated value of blocked anomalous transfers</p>
         </div>
         <div className="text-5xl font-black text-emerald-400 relative z-10 tracking-tight">₹8.42 Cr</div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
         <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <Globe className="text-red-500" size={28} />
         </div>
         <h3 className="font-extrabold text-xl text-slate-900 mb-2">Global IP Threat Level</h3>
         <p className="text-red-600 font-bold bg-red-50 inline-block px-3 py-1 rounded-lg">ELEVATED (Botnet Detected)</p>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
         <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-5">
            <BarChart3 className="text-indigo-600" size={28} />
         </div>
         <h3 className="font-extrabold text-xl text-slate-900 mb-2">GNN False Positive Rate</h3>
         <p className="text-emerald-600 font-bold bg-emerald-50 inline-block px-3 py-1 rounded-lg">1.4% (Within Target)</p>
      </div>
   </div>
);
