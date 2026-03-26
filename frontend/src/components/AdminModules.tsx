import React, { useState } from 'react';
import { Server, Users, Cpu, Activity, ShieldCheck, Database, Search } from 'lucide-react';

export const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Raj Patil', email: 'analyst@guardupi.gov', initial: 'R', avatarClass: 'bg-indigo-100 text-indigo-700', role: 'Fraud Analyst', roleClass: 'bg-blue-50 text-blue-700 border-blue-100', mfa: 'Disabled', mfaClass: 'bg-red-50 text-red-700 border-red-100', lastLogin: '2 mins ago', active: false },
    { id: 2, name: 'Alice Smith', email: 'admin@guardupi.gov', initial: 'A', avatarClass: 'bg-slate-900 text-white shadow-md', role: 'Admin Level', roleClass: 'bg-slate-900 text-white shadow-sm border-transparent', mfa: 'Auth App Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100', lastLogin: 'Active Matrix', active: true },
    { id: 3, name: 'Priya Gupta', email: 'investigator@guardupi.gov', initial: 'P', avatarClass: 'bg-rose-100 text-rose-700', role: 'Senior Investigator', roleClass: 'bg-rose-50 text-rose-700 border-rose-100', mfa: 'SMS Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100', lastLogin: '12 hours ago', active: false }
  ]);

  const handleProvision = () => {
    const newUser = { id: Date.now(), name: 'New Analyst', email: `analyst_${Date.now().toString().slice(-4)}@guardupi.gov`, initial: 'N', avatarClass: 'bg-indigo-100 text-indigo-700', role: 'Fraud Analyst', roleClass: 'bg-blue-50 text-blue-700 border-blue-100', mfa: 'Disabled', mfaClass: 'bg-red-50 text-red-700 border-red-100', lastLogin: 'Never', active: false };
    setUsers([newUser, ...users]);
  };

  const handleMfaToggle = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        if (u.mfa === 'Disabled') return {...u, mfa: 'SMS Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100'};
        if (u.mfa === 'SMS Bound') return {...u, mfa: 'Auth App Bound', mfaClass: 'bg-emerald-50 text-emerald-700 border-emerald-100'};
        return {...u, mfa: 'Disabled', mfaClass: 'bg-red-50 text-red-700 border-red-100'};
      }
      return u;
    }));
  };

  const handleRevoke = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
  };
  
  const handleReset = (id: number) => {
    alert(`Security keys actively regenerated for user ID ${id}`);
  };

  return (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
     <div className="flex justify-between items-center mb-6">
       <div>
         <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Management</h2>
         <p className="text-slate-500 font-medium tracking-wide">Manage analysts, assign structural roles, and enforce Zero-Trust MFA constraints.</p>
       </div>
       <button onClick={handleProvision} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95">
         + Provision New Analyst
       </button>
     </div>
     <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-extrabold tracking-wider">
              <tr><th className="p-5">Staff Member</th><th className="p-5">Clearance Role</th><th className="p-5">MFA Status</th><th className="p-5">Last Login Session</th><th className="p-5">Actions</th></tr>
           </thead>
           <tbody className="divide-y divide-slate-100 font-medium text-sm">
             {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                   <td className="p-5 flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${u.avatarClass}`}>
                       {u.initial}
                     </div>
                     <div>
                       <p className="text-slate-900 font-bold text-base tracking-tight">{u.name}</p>
                       <p className="text-xs text-slate-400 font-medium">{u.email}</p>
                     </div>
                   </td>
                   <td className="p-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${u.roleClass}`}>{u.role}</span></td>
                   <td className="p-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${u.mfaClass}`}>{u.mfa}</span></td>
                   
                   <td className="p-5 font-bold flex items-center gap-1.5 min-h-[72px]">
                     {u.active ? (
                       <><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div><span className="text-emerald-600">{u.lastLogin}</span></>
                     ) : (
                       <span className="text-slate-500">{u.lastLogin}</span>
                     )}
                   </td>
                   <td className="p-5">
                    <div className="flex gap-4">
                     <button onClick={() => handleMfaToggle(u.id)} className="text-indigo-600 font-bold cursor-pointer hover:text-indigo-800 transition-colors select-none active:scale-95 origin-left">Enforce MFA</button>
                     <button onClick={() => handleReset(u.id)} className="text-slate-400 font-bold cursor-pointer hover:text-indigo-600 transition-colors select-none">Reset Keys</button>
                     <button onClick={() => handleRevoke(u.id)} className="text-rose-600 font-bold cursor-pointer hover:text-rose-800 transition-colors select-none">Revoke Access</button>
                    </div>
                   </td>
                </tr>
             ))}
           </tbody>
        </table>
     </div>
   </div>
  );
};

export const MLModelStatus = () => (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Machine Learning Model Status</h2>
      <p className="text-slate-500 font-medium">Live telemetry from the GNN processing hardware orchestration clusters.</p>
      
      <div className="grid grid-cols-2 gap-6 mt-4">
         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-extrabold text-xl mb-3 flex items-center gap-3"><Cpu className="text-indigo-600" size={28} /> GraphSAGE Topology Generator</h3>
            <p className="text-emerald-700 font-bold bg-emerald-50 inline-block px-4 py-1.5 rounded-lg mb-6 border border-emerald-100 shadow-inner">ACTIVE - NVIDIA Triton Server</p>
            <div className="space-y-4 text-sm font-medium">
               <div className="flex justify-between items-center"><span className="text-slate-500">Inference Latency Target:</span><span className="text-slate-900 font-bold text-base bg-slate-50 py-1 px-3 rounded-md">14.2 ms / tx</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">Node Vectors Processed:</span><span className="text-slate-900 font-bold text-base bg-slate-50 py-1 px-3 rounded-md">4.2M / hr</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">VRAM Allocation:</span><span className="text-slate-900 font-bold text-base bg-slate-50 py-1 px-3 rounded-md">14.8 GB / 16.0 GB</span></div>
            </div>
         </div>
         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-extrabold text-xl mb-3 flex items-center gap-3"><Activity className="text-rose-600" size={28} /> Pattern Recognition Training</h3>
            <p className="text-amber-700 font-bold bg-amber-50 inline-block px-4 py-1.5 rounded-lg mb-6 border border-amber-100 shadow-inner">TRAINING - Block Epoch 450</p>
            <div className="space-y-4 text-sm font-medium">
               <div className="flex justify-between items-center"><span className="text-slate-500">Compute Array Target:</span><span className="text-amber-600 font-bold text-base bg-amber-50 py-1 px-3 rounded-md">AWS A100 Matrix (100%)</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">Real-time Cross-Entropy Loss:</span><span className="text-emerald-600 font-bold text-base bg-emerald-50 py-1 px-3 rounded-md animate-pulse">0.0214 ↓</span></div>
               <div className="flex justify-between items-center"><span className="text-slate-500">F1 Score (Test Validation):</span><span className="text-slate-900 font-bold text-base bg-slate-50 py-1 px-3 rounded-md">0.9622</span></div>
            </div>
         </div>
      </div>
   </div>
);

export const AuditLogs = () => (
   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Deep Cryptographic Audit Logs</h2>
      <p className="text-slate-500 font-medium mb-6">Unalterable logging for comprehensive system usage observability and threat hunting.</p>
      
      <div className="bg-[#0b0f19] rounded-2xl p-8 font-mono text-sm leading-relaxed text-emerald-400 overflow-y-auto flex-1 border border-slate-800 shadow-2xl relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />
         
         <p className="mb-2"><span className="text-slate-500">[16:34:12]</span> <span className="text-blue-400">INFO</span> [AUTH] Mobile Verification SMS payload successfully requested bound for <span className="text-white">+919****210</span></p>
         <p className="mb-2"><span className="text-slate-500">[16:34:15]</span> <span className="text-blue-400">INFO</span> [AUTH] Zero-Trust Session granted. Encrypted JWT 256-bit payload injected globally to analyst profile #892.</p>
         <p className="mb-2"><span className="text-slate-500">[16:01:22]</span> <span className="text-indigo-400">SYS</span>  [K8S] Triton Inference Analytics Server automatically scaled to bounds of 4 nodes via HPA metrics.</p>
         <p className="mb-2"><span className="text-slate-500">[15:45:10]</span> <span className="text-purple-400">MODEL</span> GraphSAGE anomaly retraining sequence forcibly manually externally triggered. Pulled updated layer weights directly from AWS ECR.</p>
         <p className="mb-2 text-rose-400 font-bold"><span className="text-slate-500 font-normal">[15:30:00]</span> WARN [SEC] Multiple consecutive failed brute-force dict logins detected scaling from IP 45.22.11.100. Connection dropped. Automated Geoblock applied.</p>
         <p className="mb-2"><span className="text-slate-500">[15:02:11]</span> <span className="text-blue-400">INFO</span> [AUTH] Admin session dynamically explicitly challenged via secure YubiKey physical hardware TOTP factor check.</p>
         <p className="mb-2"><span className="text-slate-500">[14:55:00]</span> <span className="text-amber-400">DATA</span> [NEO4J] Batch graph alignment successfully merged 12,045 new nodes into topological representation.</p>
         <br/>
         <div className="flex items-center gap-2 text-slate-600">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            Observing live tail log stream...
         </div>
      </div>
   </div>
);
