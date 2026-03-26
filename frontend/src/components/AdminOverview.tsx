import { Server, Users, Cpu } from 'lucide-react';

export const AdminOverview = () => (
   <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="col-span-3">
         <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">System Admin Control Center</h2>
         <p className="text-slate-500 font-medium">Complete infrastructure topology and scaling metrics.</p>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
         <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <Server className="text-indigo-600" size={24} />
         </div>
         <h3 className="font-bold text-lg text-slate-900 mb-1">EKS Cluster Nodes</h3>
         <div className="flex justify-between items-end">
            <p className="text-emerald-600 font-bold">9 / 10 Healthy</p>
            <p className="text-xs text-slate-400 font-medium">ap-south-1</p>
         </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
         <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <Cpu className="text-purple-600" size={24} />
         </div>
         <h3 className="font-bold text-lg text-slate-900 mb-1">Triton GPU Inference</h3>
         <div className="flex justify-between items-end">
            <p className="text-red-500 font-bold">88% Utilization</p>
            <p className="text-xs text-slate-400 font-medium">A10g Multi-Instance</p>
         </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
         <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Users className="text-blue-600" size={24} />
         </div>
         <h3 className="font-bold text-lg text-slate-900 mb-1">Active Sessions</h3>
         <div className="flex justify-between items-end">
            <p className="text-slate-700 font-bold">1,245 Analysts</p>
            <p className="text-xs text-emerald-500 font-medium">+15 connecting</p>
         </div>
      </div>
   </div>
);
