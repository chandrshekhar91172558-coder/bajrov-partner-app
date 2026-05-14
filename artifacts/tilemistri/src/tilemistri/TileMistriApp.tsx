import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, Shield, ChevronRight, Lock, UserPlus } from 'lucide-react';
import { useAppStore, isPhoneRegistered } from './store';
import type { UserProfile } from './store';
import { RegisterScreen, type RegisterFormData } from './RegisterScreen';
import { MainApp } from './MainApp';

type Screen = 'splash'|'auth'|'login'|'register'|'reg-otp'|'forgot-phone'|'forgot-otp'|'forgot-reset'|'main';

const P = {
  orange:    '#FF8A00',
  orangeD:   '#E06000',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#7A94C1',
  textMuted: 'rgba(255,255,255,0.35)',
  red:       '#EF4444',
  bg:        '#050D24',
  bgCard:    'rgba(255,255,255,0.05)',
  border:    'rgba(255,255,255,0.10)',
  borderO:   'rgba(255,138,0,0.28)',
};

const BG = 'linear-gradient(170deg,#050D24 0%,#071630 45%,#091E45 100%)';

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} style={{ width:42,height:42,borderRadius:21,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',WebkitTapHighlightColor:'transparent' }}>
      <ArrowLeft size={18} color="#fff" />
    </button>
  );
}

function OtpInput({ otp, onChange, error }: { otp: string[]; onChange: (v: string[]) => void; error?: string }) {
  const refs = useRef<(HTMLInputElement|null)[]>([]);
  const handle = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; onChange(next);
    if (val && i < 5) refs.current[i+1]?.focus();
    if (!val && i > 0) refs.current[i-1]?.focus();
  };
  return (
    <div>
      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
        {otp.map((d, i) => (
          <input key={i} ref={el => { refs.current[i]=el; }} value={d} maxLength={1} type="tel"
            onChange={e => handle(i, e.target.value)}
            onKeyDown={e => { if (e.key==='Backspace' && !d && i>0) refs.current[i-1]?.focus(); }}
            style={{ width:48,height:60,textAlign:'center',fontSize:24,fontWeight:700,background:'rgba(255,255,255,0.07)',border:`2px solid ${d ? P.orange : 'rgba(255,255,255,0.14)'}`,borderRadius:14,color:'#fff',outline:'none',boxShadow:d?`0 0 16px rgba(255,138,0,0.3)`:'none',transition:'all 0.18s',fontFamily:'inherit' }} />
        ))}
      </div>
      {error && (
        <div style={{ color:P.red,fontSize:13,textAlign:'center',marginTop:12,padding:'8px 16px',background:'rgba(239,68,68,0.08)',borderRadius:10,border:'1px solid rgba(239,68,68,0.2)' }}>{error}</div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, type='text', placeholder, error, prefix, suffix }: {
  label?: string; value: string; onChange: (v:string)=>void; type?:string;
  placeholder?:string; error?:string; prefix?: React.ReactNode; suffix?: React.ReactNode;
}) {
  return (
    <div>
      {label && <div style={{ fontSize:11,color:P.textSec,fontWeight:700,marginBottom:8,letterSpacing:0.8,textTransform:'uppercase' }}>{label}</div>}
      <div style={{ position:'relative' }}>
        {prefix && <div style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center',gap:8,color:P.textSec,zIndex:1 }}>{prefix}</div>}
        <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder}
          className={`premium-input${error ? ' error' : ''}`}
          style={{ paddingLeft: prefix ? 70 : 16, paddingRight: suffix ? 48 : 16 }} />
        {suffix && <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',display:'flex',alignItems:'center' }}>{suffix}</div>}
      </div>
      {error && <div style={{ color:P.red,fontSize:12,marginTop:6,paddingLeft:4 }}>{error}</div>}
    </div>
  );
}

export function TileMistriApp() {
  const store = useAppStore();
  const [screen, setScreen] = useState<Screen>(() => store.isLoggedIn ? 'main' : 'splash');

  const [loginPhone, setLoginPhone]   = useState('');
  const [loginPass,  setLoginPass]    = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError]   = useState('');

  const [pendingFormData, setPendingFormData] = useState<RegisterFormData|null>(null);
  const [pendingProfile,  setPendingProfile]  = useState<UserProfile|null>(null);

  const [otp,          setOtp]          = useState(['','','','','','']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError,     setOtpError]     = useState('');
  const [countdown,    setCountdown]    = useState(0);

  const [forgotPhone, setForgotPhone]       = useState('');
  const [forgotPhoneError, setForgotPhoneError] = useState('');
  const [newPass,     setNewPass]           = useState('');
  const [newPassConf, setNewPassConf]       = useState('');
  const [showNewPass, setShowNewPass]       = useState(false);
  const [showNewPassConf, setShowNewPassConf] = useState(false);
  const [resetError,  setResetError]        = useState('');

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c-1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (screen !== 'splash') return;
    const t = setTimeout(() => setScreen(store.isLoggedIn ? 'main' : 'auth'), 3000);
    return () => clearTimeout(t);
  }, [screen, store.isLoggedIn]);

  const generateOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code); setCountdown(30);
    setOtp(['','','','','','']); setOtpError('');
    return code;
  };

  const logout = () => {
    store.logout();
    setLoginPhone(''); setLoginPass(''); setLoginError('');
    setForgotPhone(''); setNewPass(''); setNewPassConf('');
    setScreen('auth');
  };

  const handleLogin = () => {
    if (loginPhone.length !== 10) { setLoginError('Please enter a valid 10-digit mobile number.'); return; }
    if (!loginPass) { setLoginError('Please enter your password.'); return; }
    const r = store.loginWithPassword(loginPhone, loginPass);
    if (r === 'not_found')      setLoginError('This number is not registered. Please sign up first.');
    else if (r === 'wrong_password') setLoginError('Incorrect password. Please try again.');
    else setScreen('main');
  };

  const handleRegisterSubmit = (fd: RegisterFormData, p: UserProfile) => {
    setPendingFormData(fd); setPendingProfile(p);
    generateOtp(); setScreen('reg-otp');
  };

  const verifyRegisterOtp = () => {
    if (otp.join('').length < 6) { setOtpError('Please enter the complete 6-digit OTP.'); return; }
    if (otp.join('') !== generatedOtp) { setOtpError('Invalid OTP. Please try again.'); return; }
    if (!pendingFormData || !pendingProfile) return;
    const r = store.register(pendingFormData.phone, pendingFormData.password, pendingProfile);
    if (r === 'already_exists') setOtpError('This number is already registered. Please log in.');
    else setScreen('main');
  };

  const handleForgotPhoneSubmit = () => {
    if (forgotPhone.length !== 10) { setForgotPhoneError('Please enter a valid 10-digit mobile number.'); return; }
    if (!isPhoneRegistered(forgotPhone)) { setForgotPhoneError('This number is not registered.'); return; }
    setForgotPhoneError(''); generateOtp(); setScreen('forgot-otp');
  };

  const verifyForgotOtp = () => {
    if (otp.join('').length < 6) { setOtpError('Please enter the complete 6-digit OTP.'); return; }
    if (otp.join('') !== generatedOtp) { setOtpError('Invalid OTP. Please try again.'); return; }
    setNewPass(''); setNewPassConf(''); setResetError(''); setScreen('forgot-reset');
  };

  const handleResetPassword = () => {
    if (newPass.length < 6) { setResetError('Password must be at least 6 characters long.'); return; }
    if (newPass !== newPassConf) { setResetError('Passwords do not match. Please try again.'); return; }
    store.resetPassword(forgotPhone, newPass);
    setLoginPhone(forgotPhone); setLoginPass(''); setLoginError('');
    setScreen('login');
  };

  // ── Splash ──────────────────────────────────────────────────────────────────
  if (screen === 'splash') return (
    <div className="splash-bg" style={{ width:'100%',height:'100dvh',background:'linear-gradient(170deg,#020710 0%,#040E28 50%,#071830 100%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative' }}>

      {/* Ambient orbs */}
      <div className="splash-orb" style={{ position:'absolute',width:600,height:600,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,138,0,0.14) 0%,rgba(255,138,0,0.04) 35%,transparent 65%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',top:-120,right:-100,width:360,height:360,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,138,0,0.08) 0%,transparent 65%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',bottom:-80,left:-80,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(7,30,80,0.9) 0%,transparent 70%)',pointerEvents:'none' }} />

      {/* Subtle dot grid */}
      <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',backgroundSize:'32px 32px',pointerEvents:'none' }} />

      {/* Center content */}
      <div style={{ textAlign:'center',position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',gap:0 }}>

        {/* Logo */}
        <div className="splash-logo" style={{ marginBottom:30 }}>
          <img src="/logo.png" alt="Bajrov Partner" style={{ width:148,height:148,objectFit:'contain',borderRadius:'26%',display:'block' }} />
        </div>

        {/* App name */}
        <div className="splash-title" style={{ fontSize:38,fontWeight:800,color:'#fff',letterSpacing:-1.2,lineHeight:1,marginBottom:10 }}>
          Baj<span style={{ color:P.orange }}>rov</span>
        </div>

        {/* Partner pill */}
        <div className="splash-tag" style={{ marginBottom:16 }}>
          <span style={{ display:'inline-block',background:'linear-gradient(135deg,rgba(255,138,0,0.25),rgba(224,96,0,0.12))',border:'1.5px solid rgba(255,138,0,0.45)',borderRadius:30,padding:'6px 26px',fontSize:12,fontWeight:800,color:P.orange,letterSpacing:3.5 }}>PARTNER</span>
        </div>

        {/* Tagline */}
        <div className="splash-sub" style={{ fontSize:11,color:'rgba(255,193,7,0.65)',letterSpacing:2.5,fontWeight:600,textTransform:'uppercase' }}>
          Tiles &amp; Pital Services
        </div>
      </div>

      {/* Bottom loading */}
      <div style={{ position:'absolute',bottom:52,left:0,right:0,display:'flex',flexDirection:'column',alignItems:'center',gap:10,zIndex:2 }}>
        <div style={{ width:180,height:2.5,borderRadius:8,background:'rgba(255,255,255,0.07)',overflow:'hidden' }}>
          <div className="splash-bar" style={{ height:'100%',background:`linear-gradient(90deg,${P.orange},${P.gold},${P.orange})`,backgroundSize:'200% 100%',borderRadius:8,boxShadow:`0 0 8px ${P.orangeGlow}` }} />
        </div>
        <div style={{ fontSize:10,color:'rgba(255,255,255,0.18)',letterSpacing:1.5,fontWeight:500 }}>LOADING...</div>
      </div>
    </div>
  );

  // ── Auth Hub ─────────────────────────────────────────────────────────────────
  if (screen === 'auth') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative' }}>

      {/* Top decoration */}
      <div style={{ position:'absolute',top:-150,left:'50%',transform:'translateX(-50%)',width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,138,0,0.1) 0%,transparent 60%)',pointerEvents:'none' }} />
      <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none' }} />

      {/* Logo area */}
      <div style={{ flex:'0 0 auto',paddingTop:60,display:'flex',flexDirection:'column',alignItems:'center',gap:16,position:'relative',zIndex:1 }}>
        <img src="/logo.png" alt="Bajrov Partner" style={{ width:100,height:100,objectFit:'contain',borderRadius:'24%',filter:'drop-shadow(0 8px 24px rgba(255,138,0,0.4))' }} />
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:28,fontWeight:800,color:'#fff',letterSpacing:-0.8 }}>Baj<span style={{ color:P.orange }}>rov</span> Partner</div>
          <div style={{ fontSize:13,color:P.textSec,marginTop:6 }}>Find Work. Earn More. Grow Faster.</div>
        </div>
      </div>

      {/* Cards */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'0 20px',gap:14,position:'relative',zIndex:1,maxWidth:420,width:'100%',margin:'0 auto' }}>

        {/* Login card */}
        <button onClick={() => { setLoginError(''); setScreen('login'); }}
          style={{ width:'100%',padding:'20px 20px',borderRadius:22,border:`1.5px solid rgba(255,138,0,0.45)`,background:'linear-gradient(135deg,rgba(255,138,0,0.14) 0%,rgba(255,138,0,0.05) 100%)',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:16,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',boxShadow:`0 4px 32px rgba(0,0,0,0.3),0 0 0 1px rgba(255,138,0,0.08)`,WebkitTapHighlightColor:'transparent',transition:'transform 0.15s' }}>
          <div style={{ width:54,height:54,borderRadius:27,background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 6px 20px ${P.orangeGlow}` }}>
            <Lock size={24} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff',fontWeight:700,fontSize:17,marginBottom:3 }}>LOGIN NOW</div>
            <div style={{ color:P.textSec,fontSize:12 }}>Access your account securely</div>
          </div>
          <ChevronRight size={20} color={P.orange} />
        </button>

        {/* Register card */}
        <button onClick={() => setScreen('register')}
          style={{ width:'100%',padding:'20px 20px',borderRadius:22,border:'1.5px solid rgba(255,255,255,0.10)',background:'rgba(255,255,255,0.05)',cursor:'pointer',textAlign:'left',display:'flex',alignItems:'center',gap:16,backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',WebkitTapHighlightColor:'transparent',transition:'transform 0.15s' }}>
          <div style={{ width:54,height:54,borderRadius:27,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <UserPlus size={24} color="#fff" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:'#fff',fontWeight:700,fontSize:17,marginBottom:3 }}>REGISTER NOW</div>
            <div style={{ color:P.textSec,fontSize:12 }}>Create your partner account — it's free</div>
          </div>
          <ChevronRight size={20} color={P.textSec} />
        </button>

        {/* Trust line */}
        <div style={{ display:'flex',alignItems:'center',gap:10,padding:'4px 0' }}>
          <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
          <Shield size={12} color={P.gold} />
          <span style={{ fontSize:11,color:P.textSec }}>Secure  •  Fast  •  Trusted</span>
          <div style={{ flex:1,height:1,background:'rgba(255,255,255,0.07)' }} />
        </div>
      </div>

      <div style={{ height:'env(safe-area-inset-bottom,16px)' }} />
    </div>
  );

  // ── Login ────────────────────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden' }}>

      <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none' }} />

      {/* Header */}
      <div style={{ padding:'56px 20px 0',position:'relative',zIndex:1 }}>
        <BackBtn onBack={() => setScreen('auth')} />
      </div>

      {/* Form */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 0',maxWidth:430,width:'100%',margin:'0 auto',position:'relative',zIndex:1,gap:20 }}>

        <div style={{ marginBottom:4 }}>
          <div style={{ fontSize:10,color:P.orange,fontWeight:700,letterSpacing:2.5,marginBottom:8 }}>WELCOME BACK</div>
          <div style={{ fontSize:30,fontWeight:800,color:'#fff',letterSpacing:-0.8,lineHeight:1.2 }}>Welcome Back! 👋</div>
          <div style={{ fontSize:14,color:P.textSec,marginTop:8 }}>Enter your credentials to continue</div>
        </div>

        {/* Card */}
        <div style={{ background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:24,padding:'24px 20px',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',display:'flex',flexDirection:'column',gap:18 }}>

          <InputField
            label="Mobile Number"
            value={loginPhone}
            onChange={v => { setLoginPhone(v.replace(/\D/g,'').slice(0,10)); setLoginError(''); }}
            type="tel"
            placeholder="00000 00000"
            error={loginError && loginPhone.length!==10 ? loginError : undefined}
            prefix={<><Phone size={13} color={P.orange} /><span style={{ fontSize:13,fontWeight:700,paddingLeft:4,borderLeft:'1px solid rgba(255,255,255,0.12)',marginLeft:4,paddingRight:2 }}>+91</span></>}
          />

          <div>
            <div style={{ fontSize:11,color:P.textSec,fontWeight:700,marginBottom:8,letterSpacing:0.8,textTransform:'uppercase' }}>Password</div>
            <div style={{ position:'relative' }}>
              <input value={loginPass} onChange={e=>{setLoginPass(e.target.value);setLoginError('');}}
                type={showLoginPass?'text':'password'} placeholder="Enter your password"
                onKeyDown={e=>e.key==='Enter'&&handleLogin()}
                className={`premium-input${loginError&&loginPass?'':''}`}
                style={{ paddingRight:50,width:'100%',boxSizing:'border-box' }} />
              <button onClick={()=>setShowLoginPass(p=>!p)} style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'none',cursor:'pointer',color:P.textSec,display:'flex',padding:0 }}>
                {showLoginPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {loginError && (
            <div style={{ color:P.red,fontSize:13,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.18)',borderRadius:12,padding:'10px 14px',display:'flex',alignItems:'center',gap:8 }}>
              ⚠️ {loginError}
            </div>
          )}

          <div style={{ textAlign:'right',marginTop:-6 }}>
            <button onClick={()=>{setForgotPhone(loginPhone);setForgotPhoneError('');setScreen('forgot-phone');}}
              style={{ background:'transparent',border:'none',color:P.orange,fontSize:13,cursor:'pointer',fontWeight:600,WebkitTapHighlightColor:'transparent' }}>
              Forgot Password?
            </button>
          </div>
        </div>

        <button className="btn-primary" onClick={handleLogin} style={{ fontSize:16,fontWeight:700,letterSpacing:0.5 }}>
          LOGIN NOW
        </button>

        <div style={{ textAlign:'center',fontSize:14,color:P.textSec }}>
          New here?{' '}
          <button onClick={()=>setScreen('register')} style={{ background:'transparent',border:'none',color:P.orange,cursor:'pointer',fontWeight:700,fontSize:14,WebkitTapHighlightColor:'transparent' }}>
            Create Account
          </button>
        </div>
      </div>
      <div style={{ height:'env(safe-area-inset-bottom,24px)' }} />
    </div>
  );

  // ── Register ─────────────────────────────────────────────────────────────────
  if (screen === 'register') return (
    <RegisterScreen onSubmit={handleRegisterSubmit} onBack={() => setScreen('auth')} />
  );

  // ── OTP (Register) ───────────────────────────────────────────────────────────
  if (screen === 'reg-otp') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <div style={{ padding:'56px 20px 0',position:'relative',zIndex:1 }}><BackBtn onBack={()=>setScreen('register')} /></div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 0',maxWidth:430,width:'100%',margin:'0 auto',gap:24 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ width:72,height:72,borderRadius:36,background:'rgba(255,138,0,0.12)',border:'1.5px solid rgba(255,138,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:32 }}>📱</div>
          <div style={{ fontSize:26,fontWeight:800,color:'#fff',marginBottom:8 }}>Verify OTP</div>
          <div style={{ color:P.textSec,fontSize:14 }}>
            Code sent to <span style={{ color:'#fff',fontWeight:600 }}>+91 {pendingFormData?.phone}</span>
          </div>
        </div>

        <div style={{ background:'rgba(255,193,7,0.08)',border:'1px solid rgba(255,193,7,0.3)',borderRadius:16,padding:'14px 18px',textAlign:'center' }}>
          <div style={{ fontSize:10,color:P.gold,fontWeight:700,marginBottom:6,letterSpacing:1 }}>DEMO OTP — FOR TESTING ONLY</div>
          <div style={{ fontSize:32,fontWeight:800,color:'#fff',letterSpacing:10 }}>{generatedOtp}</div>
        </div>

        <OtpInput otp={otp} onChange={setOtp} error={otpError} />

        <button className="btn-primary" onClick={verifyRegisterOtp} disabled={otp.join('').length<6}
          style={{ opacity: otp.join('').length<6 ? 0.45 : 1, cursor: otp.join('').length<6 ? 'not-allowed' : 'pointer' }}>
          ✓ Verify & Create Account
        </button>

        <div style={{ textAlign:'center',fontSize:13,color:P.textSec }}>
          {countdown > 0 ? `Resend in ${countdown}s` : (
            <button onClick={()=>generateOtp()} style={{ background:'transparent',border:'none',color:P.orange,cursor:'pointer',fontWeight:700,fontSize:13 }}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Forgot — Phone ────────────────────────────────────────────────────────────
  if (screen === 'forgot-phone') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <div style={{ padding:'56px 20px 0' }}><BackBtn onBack={()=>setScreen('login')} /></div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 0',maxWidth:430,width:'100%',margin:'0 auto',gap:24 }}>
        <div>
          <div style={{ fontSize:10,color:P.orange,fontWeight:700,letterSpacing:2.5,marginBottom:8 }}>ACCOUNT RECOVERY</div>
          <div style={{ fontSize:28,fontWeight:800,color:'#fff',marginBottom:8 }}>Reset Password 🔐</div>
          <div style={{ fontSize:14,color:P.textSec }}>Enter your registered mobile number</div>
        </div>
        <InputField
          label="Registered Mobile Number"
          value={forgotPhone}
          onChange={v=>{setForgotPhone(v.replace(/\D/g,'').slice(0,10));setForgotPhoneError('');}}
          type="tel" placeholder="00000 00000"
          error={forgotPhoneError}
          prefix={<><Phone size={13} color={P.orange}/><span style={{ fontSize:13,fontWeight:700,paddingLeft:4,borderLeft:'1px solid rgba(255,255,255,0.12)',marginLeft:4 }}>+91</span></>}
        />
        <button className="btn-primary" onClick={handleForgotPhoneSubmit}>Send OTP</button>
      </div>
    </div>
  );

  // ── Forgot — OTP ──────────────────────────────────────────────────────────────
  if (screen === 'forgot-otp') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <div style={{ padding:'56px 20px 0' }}><BackBtn onBack={()=>setScreen('forgot-phone')} /></div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 0',maxWidth:430,width:'100%',margin:'0 auto',gap:24 }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:26,fontWeight:800,color:'#fff',marginBottom:8 }}>Enter OTP</div>
          <div style={{ color:P.textSec,fontSize:14 }}>Code sent to <span style={{ color:'#fff',fontWeight:600 }}>+91 {forgotPhone}</span></div>
        </div>
        <div style={{ background:'rgba(255,193,7,0.08)',border:'1px solid rgba(255,193,7,0.3)',borderRadius:16,padding:'14px 18px',textAlign:'center' }}>
          <div style={{ fontSize:10,color:P.gold,fontWeight:700,marginBottom:6,letterSpacing:1 }}>DEMO OTP</div>
          <div style={{ fontSize:32,fontWeight:800,color:'#fff',letterSpacing:10 }}>{generatedOtp}</div>
        </div>
        <OtpInput otp={otp} onChange={setOtp} error={otpError} />
        <button className="btn-primary" onClick={verifyForgotOtp} disabled={otp.join('').length<6}
          style={{ opacity: otp.join('').length<6 ? 0.45 : 1 }}>Verify OTP</button>
        <div style={{ textAlign:'center',fontSize:13,color:P.textSec }}>
          {countdown > 0 ? `Resend in ${countdown}s` : (
            <button onClick={()=>generateOtp()} style={{ background:'transparent',border:'none',color:P.orange,cursor:'pointer',fontWeight:700,fontSize:13 }}>Resend OTP</button>
          )}
        </div>
      </div>
    </div>
  );

  // ── Forgot — Reset ────────────────────────────────────────────────────────────
  if (screen === 'forgot-reset') return (
    <div className="screen-in" style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden' }}>
      <div style={{ padding:'56px 20px 0' }}><BackBtn onBack={()=>setScreen('forgot-otp')} /></div>
      <div style={{ flex:1,display:'flex',flexDirection:'column',justifyContent:'center',padding:'24px 24px 0',maxWidth:430,width:'100%',margin:'0 auto',gap:20 }}>
        <div>
          <div style={{ fontSize:28,fontWeight:800,color:'#fff',marginBottom:8 }}>Set New Password 🔒</div>
          <div style={{ fontSize:14,color:P.textSec }}>Choose a strong password</div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:18 }}>
          <div>
            <div style={{ fontSize:11,color:P.textSec,fontWeight:700,marginBottom:8,letterSpacing:0.8,textTransform:'uppercase' }}>New Password</div>
            <div style={{ position:'relative' }}>
              <input value={newPass} onChange={e=>setNewPass(e.target.value)} type={showNewPass?'text':'password'} placeholder="Enter new password" className="premium-input" style={{ paddingRight:50,width:'100%',boxSizing:'border-box' }} />
              <button onClick={()=>setShowNewPass(p=>!p)} style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'none',cursor:'pointer',color:P.textSec }}>
                {showNewPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>
          <div>
            <div style={{ fontSize:11,color:P.textSec,fontWeight:700,marginBottom:8,letterSpacing:0.8,textTransform:'uppercase' }}>Confirm Password</div>
            <div style={{ position:'relative' }}>
              <input value={newPassConf} onChange={e=>setNewPassConf(e.target.value)} type={showNewPassConf?'text':'password'} placeholder="Confirm new password" className="premium-input" style={{ paddingRight:50,width:'100%',boxSizing:'border-box' }} />
              <button onClick={()=>setShowNewPassConf(p=>!p)} style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'none',cursor:'pointer',color:P.textSec }}>
                {showNewPassConf ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>
        </div>
        {resetError && <div style={{ color:P.red,fontSize:13,background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.18)',borderRadius:12,padding:'10px 14px' }}>⚠️ {resetError}</div>}
        <button className="btn-primary" onClick={handleResetPassword}>Update Password ✓</button>
      </div>
    </div>
  );

  return <MainApp store={store} onLogout={logout} />;
}
