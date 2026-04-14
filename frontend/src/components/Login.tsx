import React, { useState } from 'react';
import { ShieldAlert, KeyRound, User, BadgeAlert, UserCircle, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// Demo users – no backend needed
const DEMO_USERS: Record<string, { password: string; role: string; first_name: string }> = {
  'admin@guardupi.gov':     { password: 'pass123', role: 'Admin',               first_name: 'Admin' },
  'analyst@guardupi.gov':   { password: 'pass123', role: 'Fraud Analyst',       first_name: 'Priya' },
  'risk@guardupi.gov':      { password: 'pass123', role: 'Risk Manager',        first_name: 'Arjun' },
  'senior@guardupi.gov':    { password: 'pass123', role: 'Senior Investigator', first_name: 'Kavitha' },
};

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const [email, setEmail]         = useState('analyst@guardupi.gov');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword]   = useState('pass123');
  const [role, setRole]           = useState('Fraud Analyst');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 700));

    const user = DEMO_USERS[email.toLowerCase().trim()];
    if (!user || user.password !== password) {
      setError('Invalid credentials. Try analyst@guardupi.gov / pass123');
      setLoading(false);
      return;
    }

    localStorage.setItem('token', 'demo-token-' + Date.now());
    localStorage.setItem('role', user.role);
    localStorage.setItem('first_name', user.first_name);
    setLoading(false);
    onLogin();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));

    // Register as a new demo user
    DEMO_USERS[email.toLowerCase().trim()] = {
      password,
      role,
      first_name: firstName,
    };

    setLoading(false);
    setSuccess(`Account created for ${firstName}. Login with your credentials.`);
    setIsRegistering(false);
    setEmail(email);
    setPassword(password);
  };

  const resetToLogin = () => {
    setIsRegistering(false);
    setError('');
    setSuccess('');
    setEmail('analyst@guardupi.gov');
    setPassword('pass123');
    setFirstName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 w-full">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-[150px] mix-blend-multiply opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-50/50 rounded-full blur-[150px] mix-blend-multiply opacity-50 pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden relative z-10 transition-all">
        <div className="p-8 text-center bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/30">
            <ShieldAlert size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">GuardUPI</h2>
          <p className="text-sm text-slate-500 font-medium">Enterprise Fraud Intelligence Platform</p>
        </div>

        <div className="p-8 pb-6">
          {error && (
            <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={16} className="shrink-0" /> {success}
            </div>
          )}

          {isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-4 animate-in slide-in-from-right-4 fade-in">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                <div className="relative group">
                  <UserCircle size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" placeholder="e.g. Rahul" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Analyst ID / Email</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" placeholder="new_analyst@guardupi.gov" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Secure Password</label>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 tracking-widest" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Clearance Role</label>
                <div className="relative group">
                  <BadgeAlert size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold text-slate-900 appearance-none cursor-pointer">
                    <option value="Fraud Analyst">Fraud Analyst</option>
                    <option value="Senior Investigator">Senior Investigator</option>
                    <option value="Risk Manager">Risk Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-slate-900 hover:bg-black disabled:opacity-80 text-white rounded-xl font-bold shadow-lg transition-all mt-2 active:scale-95 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Provisioning...</> : <>Request Clearance <ArrowRight size={16} /></>}
              </button>

              <p className="text-center text-sm font-medium text-slate-500 mt-4">
                Have clearance? <button type="button" onClick={resetToLogin} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">Secure Login</button>
              </p>
            </form>

          ) : (
            <form onSubmit={handleLogin} className="space-y-5 animate-in slide-in-from-left-4 fade-in">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Analyst ID / Email</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" placeholder="analyst@guardupi.gov" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Secure Password</label>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400 tracking-widest" placeholder="••••••••" />
                </div>
              </div>

              {/* Quick-fill demo hints */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {Object.entries({ 'Fraud Analyst': 'analyst@guardupi.gov', 'Admin': 'admin@guardupi.gov', 'Risk Mgr': 'risk@guardupi.gov', 'Investigator': 'senior@guardupi.gov' }).map(([label, e]) => (
                  <button key={label} type="button" onClick={() => { setEmail(e); setPassword('pass123'); }}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg font-semibold text-slate-600 hover:text-indigo-700 transition-all text-left truncate">
                    {label}
                  </button>
                ))}
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-80 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-all active:scale-95 flex items-center justify-center gap-2">
                {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Secure Login'}
              </button>

              <p className="text-center text-sm font-medium text-slate-500 mt-2">
                Need access? <button type="button" onClick={() => { setIsRegistering(true); setError(''); setSuccess(''); setEmail(''); setPassword(''); setFirstName(''); }} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1">Request Clearance</button>
              </p>
            </form>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex justify-center items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold select-none">Demo Mode · All passwords: pass123</p>
        </div>
      </div>
    </div>
  );
};
