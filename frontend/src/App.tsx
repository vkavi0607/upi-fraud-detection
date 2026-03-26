import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { TransactionGrid } from './components/TransactionGrid';
import { AlertCenter } from './components/AlertCenter';
import { Investigations } from './components/Investigations';
import { GraphVisualizer } from './components/GraphVisualizer';
import { SettingsModule } from './components/Settings';
import { LogoutConfirm } from './components/LogoutConfirm';
import { Login } from './components/Login';
import { AdminOverview } from './components/AdminOverview';
import { InvestigatorOverview } from './components/InvestigatorOverview';
import { RiskManagerOverview } from './components/RiskManagerOverview';
import { UserManagement, MLModelStatus, AuditLogs } from './components/AdminModules';
import { TransactionRisk, FraudTrends } from './components/AnalystModules';
import { Bell, Search } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'Fraud Analyst');
  const [firstName, setFirstName] = useState(localStorage.getItem('first_name') || 'User');

  if (!isAuthenticated) {
    return <Login onLogin={() => {
      setIsAuthenticated(true);
      setUserRole(localStorage.getItem('role') || 'Fraud Analyst');
      setFirstName(localStorage.getItem('first_name') || 'User');
    }} />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('Overview');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('first_name');
  };

  const renderOverviewForRole = () => {
    switch (userRole) {
      case 'Admin': return <AdminOverview />;
      case 'Senior Investigator': return <InvestigatorOverview />;
      case 'Risk Manager': return <RiskManagerOverview />;
      case 'Fraud Analyst':
      default:
        // Original Fraud Analyst Layout
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Real-Time Analyst Monitoring</h1>
              <p className="text-slate-500 font-medium">GNN Model v2.4 inference metrics across national UPI network.</p>
            </div>
            
            <div className="mb-8">
              <KPICards />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 min-h-[400px]">
              <div className="xl:col-span-2 shadow-sm rounded-2xl bg-white">
                <TransactionGrid searchTerm={searchTerm} />
              </div>
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-4 text-slate-900 border-b border-slate-100 pb-4">Top Suspicious Clusters</h3>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-indigo-200 border-dashed animate-[spin_10s_linear_infinite] mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-50" />
                  </div>
                  <p className="text-sm text-slate-800 font-bold">Rendering Graph Topology...</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-[200px] font-medium">Awaiting neo4j subgraph traversal metrics.</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />
      
      <main className="flex-1 flex flex-col relative z-10 w-full min-w-0">
        <header className="h-20 px-8 flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white shadow-sm z-10">
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
            <span>{userRole} Gateway</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-indigo-600 font-bold tracking-wide">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search globals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-72 bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 text-slate-900 font-medium shadow-sm"
              />
            </div>
            
            <button className="relative p-2.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-900 group">
              <Bell size={20} className="group-hover:animate-swing" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white animate-pulse" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white shadow-md flex items-center justify-center text-sm font-bold border-2 border-indigo-100">
                {firstName ? firstName.charAt(0).toUpperCase() : userRole.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">{firstName}</span>
                <span className="text-xs text-emerald-500 font-bold tracking-wide">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 bg-slate-50/50">
          {activeTab === 'Overview' && renderOverviewForRole()}

          {/* Admin Specific Workflows */}
          {activeTab === 'System Health' && <div className="animate-in fade-in slide-in-from-bottom-4"><AdminOverview /></div>}
          {activeTab === 'User Management' && <div className="animate-in fade-in slide-in-from-bottom-4"><UserManagement /></div>}
          {activeTab === 'Fraud Overview' && <div className="animate-in fade-in slide-in-from-bottom-4"><RiskManagerOverview /></div>}
          {activeTab === 'ML Model Status' && <div className="animate-in fade-in slide-in-from-bottom-4"><MLModelStatus /></div>}
          {activeTab === 'Audit Logs' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><AuditLogs /></div>}

          {/* Analyst Specific Workflows */}
          {activeTab === 'Live Transactions' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><TransactionGrid searchTerm={searchTerm} /></div>}
          {activeTab === 'Fraud Alerts' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><AlertCenter searchTerm={searchTerm} /></div>}
          {activeTab === 'Transaction Risk Analysis' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><TransactionRisk /></div>}
          {activeTab === 'Account Investigation' && <div className="animate-in fade-in slide-in-from-bottom-4"><Investigations searchTerm={searchTerm} /></div>}
          {activeTab === 'Fraud Trends' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><FraudTrends /></div>}

          {/* Standard Universal Overlaps */}
          {activeTab === 'Case Management' && <div className="animate-in fade-in slide-in-from-bottom-4"><Investigations searchTerm={searchTerm} /></div>}
          {activeTab === 'Graph Visualizer' && <div className="animate-in fade-in slide-in-from-bottom-4 h-full"><GraphVisualizer /></div>}
          
          {/* Universal System Settings */}
          {activeTab === 'Settings' && <div className="animate-in fade-in slide-in-from-bottom-4"><SettingsModule /></div>}
          {activeTab === 'Logout' && <div className="animate-in fade-in slide-in-from-bottom-4"><LogoutConfirm setActiveTab={setActiveTab} onLogout={handleLogout} /></div>}
          
          {/* Fallback for components mapping not thoroughly connected in routing logic */}
          {['Fraud Intelligence', 'Pattern Analytics'].includes(activeTab) && (
             <div className="flex-1 flex flex-col items-center justify-center text-center bg-white border border-slate-200 rounded-3xl shadow-sm p-16 mt-8 animate-in fade-in slide-in-from-bottom-4">
               <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                 <Search size={32} className="text-slate-400" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-3">{activeTab}</h2>
               <p className="text-slate-500 font-medium max-w-sm leading-relaxed text-lg">This secured {userRole} module is currently indexing the 24h data lake and is partially offline in this local replica environment.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
