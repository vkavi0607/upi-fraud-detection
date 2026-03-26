import { FileText } from 'lucide-react';

export const InvestigatorOverview = () => (
   <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
         <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Investigator Workspace</h2>
         <p className="text-slate-500 font-medium">Deep-dive graph topologies and regulatory SAR filings.</p>
      </div>
      
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center min-h-[400px]">
         <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <FileText size={40} className="text-rose-500" />
         </div>
         <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Priority SAR Matrix</h3>
         <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">You have 4 critical investigations pending final Suspicious Activity Report documentation for regional RBI compliance.</p>
         <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white px-8 py-3.5 rounded-xl font-bold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-lg">
            Open Priority Queue
         </button>
      </div>
   </div>
);
