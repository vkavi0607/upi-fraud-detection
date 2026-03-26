import { LogOut } from 'lucide-react';

export const LogoutConfirm = ({ setActiveTab, onLogout }: { setActiveTab: (tab: string) => void, onLogout: () => void }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 max-w-md mx-auto w-full text-center mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-400 to-rose-600" />
      
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100">
        <LogOut size={36} strokeWidth={2.5} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Sign Out Session?</h2>
      <p className="text-slate-500 mb-8 font-medium">Are you sure you want to log out of the GuardUPI portal? Your active session credentials will be cleared.</p>
      
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => setActiveTab('Overview')} 
          className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors flex-1"
        >
          Cancel
        </button>
        <button 
          onClick={onLogout} 
          className="px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-500/40 transition-all flex-1 active:scale-95"
        >
          Yes, Logout
        </button>
      </div>
    </div>
  );
};
