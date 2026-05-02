import { 
  ActivitySquare, LayoutDashboard, ShieldAlert, Cpu, 
  Settings, LogOut, Network, Users, FileText, 
  BarChart3, Globe, Server, TrendingUp, GitBranch, Eye, Target, Shield
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, role }: { activeTab: string, setActiveTab: (tab: string) => void, role: string }) => {
  const getNavItems = () => {
    const common = [
      { name: 'Overview', icon: LayoutDashboard },
    ];
    
    switch(role) {
      case 'Admin': 
        return [...common, {name: 'System Health', icon: Server}, {name: 'User Management', icon: Users}, {name: 'Fraud Overview', icon: Globe}, {name: 'ML Model Status', icon: Cpu}, {name: 'Audit Logs', icon: FileText}];
      case 'Fraud Analyst': 
        return [...common, {name: 'Live Transactions', icon: ActivitySquare}, {name: 'Fraud Alerts', icon: ShieldAlert}, {name: 'Transaction Risk Analysis', icon: BarChart3}, {name: 'Account Investigation', icon: Users}, {name: 'Fraud Trends', icon: TrendingUp}];
      case 'Senior Investigator': 
        return [...common, {name: 'Evidence Chain', icon: GitBranch}, {name: 'Case Management', icon: FileText}, {name: 'Graph Visualizer', icon: Network}, {name: 'Forensic Timeline', icon: Eye}];
      case 'Risk Manager': 
        return [...common, {name: 'Fraud Intelligence', icon: Globe}, {name: 'Pattern Analytics', icon: BarChart3}, {name: 'Risk Alerts', icon: ShieldAlert}, {name: 'Compliance', icon: Shield}];
      default: 
        return common;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-full relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8 pb-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <ShieldAlert className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">GuardUPI</h1>
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">Enterprise Analytics</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{role} Level</p>
        </div>
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold text-sm
              ${activeTab === item.name 
                ? 'bg-indigo-50 text-indigo-700 shadow-[0_2px_10px_rgba(79,70,229,0.06)] border border-indigo-100/50' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
          >
            <item.icon size={20} className={activeTab === item.name ? 'text-indigo-600' : 'text-slate-400'} />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={() => setActiveTab('Settings')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all font-medium text-sm border border-transparent"
        >
          <Settings size={20} className="text-slate-400" />
          Settings
        </button>
        <button 
          onClick={() => setActiveTab('Logout')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-1 font-medium text-sm border border-transparent"
        >
          <LogOut size={20} className="text-red-500" />
          Logout
        </button>
      </div>
    </div>
  );
};
