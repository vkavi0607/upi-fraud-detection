import { Network, ZoomIn, ZoomOut } from 'lucide-react';

export const GraphVisualizer = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-full w-full overflow-hidden relative">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 z-10 absolute top-0 w-full backdrop-blur-md">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Network className="text-indigo-400" />
          Neo4j Topological Visualizer
        </h2>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><ZoomIn size={18} /></button>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><ZoomOut size={18} /></button>
        </div>
      </div>
      
      {/* Fake interactive Graph canvas using tailwind and absolute positioning */}
      <div className="flex-1 relative bg-slate-950 w-full h-full pt-16 flex items-center justify-center overflow-hidden">
        {/* Draw edges (SVG) */}
        <svg className="absolute w-full h-full pointer-events-none opacity-40">
          <line x1="50%" y1="50%" x2="30%" y2="20%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" className="animate-pulse" />
          <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="#64748b" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="40%" y2="80%" stroke="#64748b" strokeWidth="2" />
          <line x1="50%" y1="50%" x2="75%" y2="70%" stroke="#ef4444" strokeWidth="3" />
          <line x1="75%" y1="70%" x2="85%" y2="90%" stroke="#ef4444" strokeWidth="3" />
        </svg>

        {/* Central Suspect Node */}
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.4)]">
             <span className="text-white font-bold text-xs">TXN498</span>
          </div>
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-200 text-xs py-1 px-3 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            GNN Score: 98.4 (Mule)
          </div>
        </div>

        {/* Node 2 */}
        <div className="absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center hover:bg-indigo-500/40 transition-colors">
            <span className="text-indigo-200 font-bold text-[10px]">UPI*921</span>
          </div>
        </div>

        {/* Node 3 */}
        <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center">
            <span className="text-slate-300 font-bold text-[8px]">DEV01</span>
          </div>
        </div>

        {/* Node 4 */}
        <div className="absolute top-[80%] left-[40%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center">
            <span className="text-slate-300 font-bold text-[10px]">UPI*444</span>
          </div>
        </div>

        {/* Node 5 - Target mule */}
        <div className="absolute top-[70%] left-[75%] -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <span className="text-red-200 font-bold text-[10px]">UPI*999</span>
          </div>
        </div>
      </div>
    </div>
  );
};
