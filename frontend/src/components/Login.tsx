import React, { useState } from 'react';
import { ShieldAlert, KeyRound, User, Smartphone, BadgeAlert, Phone, UserCircle } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifyingMobile, setIsVerifyingMobile] = useState(false);
  
  const [email, setEmail] = useState('admin@guardupi.gov');
  const [firstName, setFirstName] = useState('');
  const [password, setPassword] = useState('pass123');
  const [role, setRole] = useState('Fraud Analyst');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [mfaToken, setMfaToken] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(mobile)) {
      setError("Please enter a valid global phone number (e.g. +919876543210)");
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, password, role, mobile })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration configuration failed');
      
      setIsVerifyingMobile(true);
      setOtp('');
      setSuccess(`Clearance provisioned. We dispatched a secure 6-digit SMS pin to ${mobile}.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/verify-mobile-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp_code: otp })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'SMS verification cascade failed');
      
      setIsVerifyingMobile(false);
      setIsRegistering(false);
      setOtp('');
      setSuccess("Mobile Identity verified securely! You may now authenticate internally.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to resend SMS pinpoint');
      setSuccess(`A new secure 6-digit pin was dispatched to ${mobile}.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, device_fingerprint: "chrome-windows" })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Internal pipeline failure');
      
      if (data.mfa_required) {
        setMfaToken(data.mfa_token);
        setOtp('');
      } else {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('first_name', data.first_name);
        onLogin();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:8001/api/v1/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfa_token: mfaToken, otp_code: otp })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'TOTP resolution failed');
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('first_name', data.first_name);
      onLogin(); // complete flow
      
    } catch (err: any) {
      setError(err.message);
    } finally {
       setLoading(false);
    }
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
          <p className="text-sm text-slate-500 font-medium">Enterprise Fraud Intelligence</p>
        </div>
        
        <div className="p-8 pb-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm font-bold rounded-xl border border-red-100 flex justify-center text-center animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-3 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 flex justify-center text-center animate-in fade-in slide-in-from-top-2">
              {success}
            </div>
          )}
          
          {mfaToken ? (
            <form onSubmit={handleVerifyMfa} className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
               <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-indigo-50 rounded-full mx-auto flex items-center justify-center text-indigo-600 mb-3">
                    <Smartphone size={24} />
                 </div>
                 <h3 className="font-bold text-slate-900 text-lg">Authenticator Push</h3>
                 <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">Enter the distinct 6-digit code tied to your TOTP provider to access this node.</p>
               </div>
               
               <div>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" />
                  <input type="text" autoFocus required maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white outline-none transition-all text-center text-2xl font-mono font-bold tracking-[0.5em] text-indigo-900 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm" placeholder="Enter 6-digit OTP" />
                </div>
                <p className="text-center text-xs text-slate-400 font-medium mt-3">Demo Hint: Use 123456</p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3.5 bg-slate-900 hover:bg-black disabled:bg-slate-400 text-white rounded-xl font-bold transition-all mt-4">
                {loading ? 'Verifying Context...' : 'Verify Context Identity'}
              </button>
            </form>

          ) : isVerifyingMobile ? (
            <form onSubmit={handleVerifyMobile} className="space-y-6 animate-in slide-in-from-right-4 fade-in">
               <div className="text-center mb-6">
                 <div className="w-12 h-12 bg-emerald-50 rounded-full mx-auto flex items-center justify-center text-emerald-600 mb-3">
                    <Phone size={24} className="animate-pulse" />
                 </div>
                 <h3 className="font-bold text-slate-900 text-lg">SMS Identity Verification</h3>
                 <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">Enter the 6-digit pin texted to {mobile} to complete setup.</p>
               </div>
               
               <div>
                <div className="relative group">
                  <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input type="text" autoFocus required maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full pl-11 pr-4 py-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white outline-none transition-all text-center text-2xl font-mono font-bold tracking-[0.5em] text-emerald-900 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm" placeholder="Enter SMS PIN" />
                </div>
                <p className="text-center text-xs text-slate-400 font-medium mt-3">Demo Hint: Use 123456</p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl font-bold transition-all mt-4">
                {loading ? 'Confirming Protocol...' : 'Confirm Cellular Identity'}
              </button>
              
              <div className="flex justify-between items-center mt-6 px-1">
                <button type="button" onClick={handleResendOtp} disabled={loading} className="text-sm text-emerald-700 font-bold hover:text-emerald-800 transition-colors disabled:opacity-50">
                  Resend PIN
                </button>
                <button type="button" onClick={() => {setIsVerifyingMobile(false); setIsRegistering(false); setError(''); setSuccess('');}} className="text-sm text-slate-500 font-semibold hover:text-slate-700 transition-colors">
                  Back to Login
                </button>
              </div>
            </form>

          ) : isRegistering ? (
            <form onSubmit={handleRegister} className="space-y-5 animate-in slide-in-from-right-4 fade-in">
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
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cellular Anchor</label>
                <div className="relative group">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium text-slate-900 placeholder:text-slate-400" placeholder="+91 98765 43210" />
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

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-slate-900 hover:bg-black disabled:opacity-80 text-white rounded-xl font-bold shadow-lg transition-all mt-8">
                {loading ? 'Provisioning...' : 'Request Clearance'}
              </button>
            </form>

          ) : (

            <form onSubmit={handleInitialLogin} className="space-y-5 animate-in slide-in-from-left-4 fade-in">
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

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-80 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] transition-all mt-6 active:scale-95">
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </form>
          )}
          
          {!mfaToken && !isVerifyingMobile && (
             isRegistering ? (
               <p className="text-center text-sm font-medium text-slate-500 mt-6 select-none animate-in fade-in">
                 Already have clearance? <button type="button" onClick={() => {setIsRegistering(false); setError(''); setSuccess(''); setEmail('admin@guardupi.gov'); setPassword('pass123');}} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 active:scale-95 transition-transform">Secure Login</button>
               </p>
             ) : (
               <p className="text-center text-sm font-medium text-slate-500 mt-6 select-none animate-in fade-in">
                 Need system access? <button type="button" onClick={() => {setIsRegistering(true); setError(''); setSuccess(''); setEmail(''); setPassword(''); setFirstName(''); setMobile('');}} className="text-indigo-600 hover:text-indigo-700 font-bold ml-1 active:scale-95 transition-transform">Request Clearance</button>
               </p>
             )
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center flex justify-center items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[pulse_2s_ease-in-out_infinite]" />
           <p className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold select-none">Node secure. 256-bit AES Encryption.</p>
        </div>
      </div>
    </div>
  );
};
