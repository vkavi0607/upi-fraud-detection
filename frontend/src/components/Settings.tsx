import { useState } from 'react';
import { Save, CheckCircle, Bell, Shield, Clock, Sliders, User, Lock, Eye, EyeOff, Palette } from 'lucide-react';

type Section = 'automation' | 'notifications' | 'display' | 'security' | 'profile';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`}/>
  </button>
);

export const SettingsModule = () => {
  const [section,      setSection]      = useState<Section>('automation');
  const [autoBlock,    setAutoBlock]    = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [autoSAR,      setAutoSAR]      = useState(false);
  const [emailAlerts,  setEmailAlerts]  = useState(true);
  const [smsAlerts,    setSmsAlerts]    = useState(false);
  const [slackAlerts,  setSlackAlerts]  = useState(true);
  const [critOnly,     setCritOnly]     = useState(false);
  const [compactMode,  setCompactMode]  = useState(false);
  const [showScores,   setShowScores]   = useState(true);
  const [animationsOn, setAnimationsOn] = useState(true);
  const [threshold,    setThreshold]    = useState(90);
  const [reviewThresh, setReviewThresh] = useState(75);
  const [sessionTTL,   setSessionTTL]   = useState(30);
  const [require2FA,   setRequire2FA]   = useState(true);
  const [ipWhitelist,  setIpWhitelist]  = useState(true);
  const [showPass,     setShowPass]     = useState(false);
  const [displayName,  setDisplayName]  = useState(localStorage.getItem('first_name') || 'Analyst');
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);

  const handleSave = () => {
    setSaving(true); setSaved(false);
    localStorage.setItem('first_name', displayName);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); }, 800);
  };

  const NAV: { id: Section; label: string; icon: typeof Shield }[] = [
    { id: 'automation',    label: 'Automation',     icon: Shield    },
    { id: 'notifications', label: 'Notifications',  icon: Bell      },
    { id: 'display',       label: 'Display',        icon: Palette   },
    { id: 'security',      label: 'Security',       icon: Lock      },
    { id: 'profile',       label: 'Profile',        icon: User      },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h2>
        <p className="text-slate-500 font-medium">Configure automation rules, alerts, and session preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left ${
                  section === n.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                <n.icon size={16}/> {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
          {/* ── AUTOMATION ─────────────────────────────── */}
          {section === 'automation' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2"><Shield size={18} className="text-indigo-500"/> Automated Actions</h3>

              {[
                { label: 'Auto-block transactions with GNN score above threshold', sub: 'Immediately blocks high-risk UPI payments', val: autoBlock,    set: setAutoBlock    },
                { label: 'Auto-escalate to Senior Investigator', sub: 'Creates escalation when analyst flags a review case', val: autoEscalate, set: setAutoEscalate },
                { label: 'Auto-generate SAR report on confirmed fraud', sub: 'Sends pre-filled SAR to RBI compliance queue',  val: autoSAR,      set: setAutoSAR      },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <Toggle checked={item.val} onChange={item.set}/>
                </label>
              ))}

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 border border-slate-200 rounded-xl">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5"><Shield size={12}/> Block Threshold</label>
                  <input type="range" min={80} max={99} value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-full accent-indigo-600"/>
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>80</span><span className="font-black text-indigo-600 text-sm">{threshold}</span><span>99</span></div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5"><Eye size={12}/> Review Threshold</label>
                  <input type="range" min={60} max={90} value={reviewThresh} onChange={e => setReviewThresh(+e.target.value)} className="w-full accent-amber-500"/>
                  <div className="flex justify-between text-xs text-slate-400 mt-1"><span>60</span><span className="font-black text-amber-600 text-sm">{reviewThresh}</span><span>90</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ──────────────────────────── */}
          {section === 'notifications' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2"><Bell size={18} className="text-indigo-500"/> Notification Channels</h3>
              {[
                { label: 'Email Alerts', sub: 'Critical alerts to registered inbox', icon: '📧', val: emailAlerts, set: setEmailAlerts },
                { label: 'SMS Alerts',   sub: 'High-severity texts to registered mobile', icon: '📱', val: smsAlerts, set: setSmsAlerts },
                { label: 'Slack Alerts', sub: 'Post to #fraud-alerts channel', icon: '💬', val: slackAlerts, set: setSlackAlerts },
                { label: 'Critical Only', sub: 'Suppress medium/low alerts across all channels', icon: '🔇', val: critOnly, set: setCritOnly },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                  <Toggle checked={item.val} onChange={item.set}/>
                </label>
              ))}
            </div>
          )}

          {/* ── DISPLAY ────────────────────────────────── */}
          {section === 'display' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2"><Palette size={18} className="text-indigo-500"/> Display Preferences</h3>
              {[
                { label: 'Compact Mode', sub: 'Reduce padding for denser information display', val: compactMode, set: setCompactMode },
                { label: 'Show GNN Scores on all rows', sub: 'Display fraud probability inline in tables', val: showScores, set: setShowScores },
                { label: 'Enable animations', sub: 'Live-update transitions and micro-animations', val: animationsOn, set: setAnimationsOn },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <Toggle checked={item.val} onChange={item.set}/>
                </label>
              ))}
            </div>
          )}

          {/* ── SECURITY ───────────────────────────────── */}
          {section === 'security' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2"><Lock size={18} className="text-indigo-500"/> Security Settings</h3>
              {[
                { label: 'Require 2FA on every login', sub: 'TOTP or SMS pin on each session start', val: require2FA,   set: setRequire2FA   },
                { label: 'IP Whitelist Enforcement',   sub: 'Block sessions outside allowlisted ranges', val: ipWhitelist, set: setIpWhitelist },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 cursor-pointer transition-all">
                  <div><p className="text-sm font-semibold text-slate-800">{item.label}</p><p className="text-xs text-slate-400 mt-0.5">{item.sub}</p></div>
                  <Toggle checked={item.val} onChange={item.set}/>
                </label>
              ))}

              <div className="p-4 border border-slate-200 rounded-xl">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 block flex items-center gap-1.5"><Clock size={12}/> Session TTL (minutes)</label>
                <input type="range" min={10} max={120} step={5} value={sessionTTL} onChange={e => setSessionTTL(+e.target.value)} className="w-full accent-indigo-600"/>
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>10m</span><span className="font-black text-indigo-600 text-sm">{sessionTTL} min</span><span>120m</span></div>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">Change Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="New password" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-400 transition-all"/>
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
                <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">Update Password →</button>
              </div>
            </div>
          )}

          {/* ── PROFILE ────────────────────────────────── */}
          {section === 'profile' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <h3 className="font-extrabold text-lg text-slate-900 border-b pb-4 border-slate-100 flex items-center gap-2"><User size={18} className="text-indigo-500"/> Your Profile</h3>

              <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg">{displayName}</p>
                  <p className="text-xs text-emerald-600 font-bold">{localStorage.getItem('role') || 'Fraud Analyst'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{localStorage.getItem('email') || 'analyst@guardupi.gov'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Display Name</label>
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Analyst ID</label>
                  <input value={localStorage.getItem('email') || 'analyst@guardupi.gov'} disabled className="w-full border border-slate-100 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"/>
                </div>
              </div>
            </div>
          )}

          {/* Save button (always visible) */}
          <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-6">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Save size={16}/>}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl text-sm border border-emerald-100 animate-in fade-in slide-in-from-left-4">
                <CheckCircle size={16}/> Saved successfully
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
