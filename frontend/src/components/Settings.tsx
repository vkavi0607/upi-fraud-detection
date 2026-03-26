import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export const SettingsModule = () => {
  const [autoBlock, setAutoBlock] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    
    // Simulate API call to save preferences
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000); // Hide toast after 3s
    }, 800);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl mx-auto w-full relative">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Platform Settings</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Automated Actions</h3>
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
            <input type="checkbox" checked={autoBlock} onChange={e => setAutoBlock(e.target.checked)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
            <span className="text-slate-700 font-medium">Auto-block transactions with GNN Core score &gt; 90</span>
          </label>
        </div>

        <div>
           <h3 className="font-semibold text-slate-900 mb-2">Notification Preferences</h3>
           <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer mb-3 transition-colors shadow-sm">
            <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
            <span className="text-slate-700 font-medium">Email Alerts for Critical Fraud Rings</span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors shadow-sm">
            <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} className="w-5 h-5 accent-indigo-600 rounded cursor-pointer" />
            <span className="text-slate-700 font-medium">SMS Alerts for High Severity Escalations</span>
          </label>
        </div>

        <div className="pt-6 flex items-center gap-4 border-t border-slate-100 mt-8">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center min-w-[200px] gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] active:scale-95"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
            {saving ? 'Syncing...' : 'Save Configurations'}
          </button>
          
          {saved && (
            <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-left-4 text-sm border border-emerald-100 shadow-sm">
              <CheckCircle size={18} /> Preferences Updated
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
