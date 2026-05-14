import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ArrowLeft, Phone, Shield } from 'lucide-react';
import { useAppStore, type WorkerType } from './store';
import { ProfileSetupScreen } from './ProfileSetupScreen';
import { MainApp } from './MainApp';

type Screen = 'splash' | 'welcome' | 'login' | 'otp' | 'profile-setup' | 'main';

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        '#071B5A',
  bgGrad:    'linear-gradient(160deg, #040F35 0%, #071B5A 50%, #0A2070 100%)',
  card:      'rgba(255,255,255,0.05)',
  cardBorder:'rgba(255,138,0,0.25)',
  orange:    '#FF8A00',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#8BA5D4',
  navBg:     '#040F35',
};

const glassCard = {
  background: 'rgba(10,28,90,0.7)',
  border: `1px solid ${C.cardBorder}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
};

const orangeBtn = (disabled = false) => ({
  background: disabled ? '#1A2E6A' : `linear-gradient(135deg, #FF8A00, #E06000)`,
  boxShadow: disabled ? 'none' : `0 4px 24px ${C.orangeGlow}`,
  color: disabled ? '#3A5080' : '#fff',
  cursor: disabled ? 'not-allowed' : 'pointer',
});

// ── Tile grid pattern ────────────────────────────────────────────────────────
const TilePattern = ({ opacity = 0.07 }) => (
  <div style={{
    position: 'absolute', inset: 0, pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(255,138,0,${opacity}) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,138,0,${opacity}) 1px, transparent 1px)
    `,
    backgroundSize: '48px 48px',
  }} />
);

// ── Logo mark ────────────────────────────────────────────────────────────────
const LogoMark = ({ size = 80 }: { size?: number }) => (
  <div style={{
    width: size, height: size, borderRadius: size * 0.24,
    background: `linear-gradient(135deg, ${C.orange}, #E06000)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 ${size * 0.5}px ${C.orangeGlow}, 0 0 ${size * 0.2}px rgba(255,138,0,0.3)`,
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)',
    }} />
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="16" height="16" rx="3" fill="white" opacity="0.95"/>
      <rect x="28" y="4" width="16" height="16" rx="3" fill="white" opacity="0.95"/>
      <rect x="4" y="28" width="16" height="16" rx="3" fill="white" opacity="0.95"/>
      <rect x="28" y="28" width="16" height="16" rx="3" fill="white" opacity="0.95"/>
    </svg>
  </div>
);

export function TileMistriApp() {
  const store = useAppStore();
  const [screen, setScreen]             = useState<Screen>(() => store.isLoggedIn ? 'main' : 'splash');
  const [workerType, setWorkerType]     = useState<WorkerType>('mistri');
  const [phone, setPhone]               = useState('');
  const [otp, setOtp]                   = useState(['','','','','','']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpError, setOtpError]         = useState('');
  const [phoneError, setPhoneError]     = useState('');
  const [countdown, setCountdown]       = useState(0);
  const otpRefs = useRef<(HTMLInputElement|null)[]>([]);

  useEffect(() => {
    if (screen !== 'splash') return;
    const t = setTimeout(() => setScreen(store.isLoggedIn ? 'main' : 'welcome'), 2800);
    return () => clearTimeout(t);
  }, [screen, store.isLoggedIn]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const sendOtp = () => {
    if (phone.length !== 10 || isNaN(Number(phone))) {
      setPhoneError('10 digit ka sahi mobile number daalo'); return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code); setCountdown(30); setScreen('otp');
  };

  const verifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) { setOtpError('Poora OTP daalo'); return; }
    if (entered !== generatedOtp) { setOtpError('OTP galat hai. Dobara try karo.'); return; }
    const hasProfile = store.login(phone, workerType);
    setScreen(hasProfile ? 'main' : 'profile-setup');
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val;
    setOtp(next); setOtpError('');
    if (val && i < 5) otpRefs.current[i+1]?.focus();
    if (!val && i > 0) otpRefs.current[i-1]?.focus();
  };

  const logout = () => {
    store.logout();
    setPhone(''); setOtp(['','','','','','']);
    setGeneratedOtp(''); setOtpError(''); setPhoneError('');
    setWorkerType('mistri'); setScreen('splash');
  };

  // ── SPLASH ────────────────────────────────────────────────────────────────
  if (screen === 'splash') return (
    <div style={{ width:'100%', height:'100dvh', background: C.bgGrad, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
      <TilePattern opacity={0.06} />
      {/* Radial glow behind logo */}
      <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,138,0,0.18) 0%, transparent 70%)`, top:'50%', left:'50%', transform:'translate(-50%,-60%)' }} />

      <div style={{ textAlign:'center', position:'relative' }}>
        <div style={{ marginBottom:28 }}>
          <LogoMark size={110} />
        </div>
        <div style={{ fontSize:42, fontWeight:900, color:'#fff', letterSpacing:-1.5, lineHeight:1, marginBottom:4 }}>
          Tile<span style={{ color: C.orange }}>Mistri</span>
        </div>
        <div style={{ display:'inline-block', background:`linear-gradient(135deg, ${C.orange}, #E06000)`, borderRadius:20, padding:'5px 22px', marginBottom:14, boxShadow:`0 4px 16px ${C.orangeGlow}` }}>
          <span style={{ fontSize:15, fontWeight:900, color:'#fff', letterSpacing:2 }}>PARTNER</span>
        </div>
        <div style={{ fontSize:12, color: C.gold, letterSpacing:2.5, fontWeight:700, opacity:0.9 }}>INDIA'S #1 TILE WORKER PLATFORM</div>
      </div>

      <div style={{ position:'absolute', bottom:56, display:'flex', gap:8 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:i===0?28:8, height:8, borderRadius:4, background:i===0?C.orange:'rgba(255,255,255,0.15)', boxShadow:i===0?`0 0 8px ${C.orangeGlow}`:'none', transition:'all 0.3s' }} />
        ))}
      </div>
      <style>{`
        @keyframes logoFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes glowPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>
    </div>
  );

  // ── WELCOME ───────────────────────────────────────────────────────────────
  if (screen === 'welcome') return (
    <div style={{ width:'100%', height:'100dvh', background: C.bgGrad, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', overflow:'hidden', position:'relative' }}>
      <TilePattern opacity={0.05} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,138,0,0.12) 0%, transparent 70%)`, top:'-10%', left:'50%', transform:'translateX(-50%)' }} />

      <div style={{ textAlign:'center', marginBottom:44, position:'relative' }}>
        <div style={{ marginBottom:20 }}><LogoMark size={72} /></div>
        <div style={{ fontSize:30, fontWeight:900, color:'#fff', letterSpacing:-0.5 }}>
          Tile<span style={{ color: C.orange }}>Mistri</span> Partner
        </div>
        <div style={{ fontSize:14, color: C.gold, marginTop:6, fontWeight:700, letterSpacing:1 }}>KAUN HO TUM? 🤔</div>
      </div>

      <div style={{ width:'100%', maxWidth:370, display:'flex', flexDirection:'column', gap:14, position:'relative' }}>
        {([
          { type:'mistri' as WorkerType, icon:'🏗️', title:'Main Tile Mistri Hoon', desc:'Tile fitting, marble, granite ka kaam', active: true },
          { type:'labour' as WorkerType, icon:'🔨', title:'Main Labour Hoon',       desc:'Helper, loading, cement mixing', active: false },
        ]).map(opt => (
          <button key={opt.type} onClick={() => { setWorkerType(opt.type); setScreen('login'); }}
            style={{
              padding:'22px 24px', borderRadius:20,
              border: opt.active ? `2px solid ${C.orange}` : '2px solid rgba(255,255,255,0.1)',
              background: opt.active
                ? 'linear-gradient(135deg, rgba(255,138,0,0.18), rgba(255,138,0,0.06))'
                : 'rgba(10,28,90,0.6)',
              cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:18,
              boxShadow: opt.active ? `0 0 24px rgba(255,138,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}>
            <div style={{ fontSize:38, lineHeight:1 }}>{opt.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ color:'#fff', fontWeight:800, fontSize:16 }}>{opt.title}</div>
              <div style={{ color: C.textSec, fontSize:12, marginTop:5 }}>{opt.desc}</div>
            </div>
            <div style={{ width:32, height:32, borderRadius:16, background: opt.active ? C.orange : 'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: opt.active ? `0 0 12px ${C.orangeGlow}` : 'none' }}>
              <ChevronRight size={18} color="#fff" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (screen === 'login') return (
    <div style={{ width:'100%', height:'100dvh', background: C.bgGrad, display:'flex', flexDirection:'column', padding:'24px 20px', overflow:'hidden', position:'relative' }}>
      <TilePattern opacity={0.05} />
      <button onClick={() => setScreen('welcome')} style={{ width:44, height:44, borderRadius:22, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', marginBottom:40, position:'relative', zIndex:1 }}>
        <ArrowLeft size={20} color="#fff" />
      </button>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:370, width:'100%', margin:'0 auto', position:'relative', zIndex:1 }}>
        <div style={{ marginBottom:32 }}>
          <div style={{ fontSize:30, fontWeight:900, color:'#fff', marginBottom:8 }}>Mobile Number Daalo</div>
          <div style={{ color: C.textSec, fontSize:14 }}>Hum OTP bhejenge verify karne ke liye 📲</div>
        </div>

        <div style={{ position:'relative', marginBottom:8 }}>
          <div style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color: C.textSec, fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:6, borderRight:'1px solid rgba(255,255,255,0.12)', paddingRight:12 }}>
            <Phone size={14} color={C.orange} /> +91
          </div>
          <input value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,'').slice(0,10)); setPhoneError(''); }}
            type="tel" maxLength={10} placeholder="00000 00000"
            style={{ width:'100%', ...glassCard, borderRadius:14, padding:'17px 17px 17px 88px', color:'#fff', fontSize:20, fontWeight:700, outline:'none', boxSizing:'border-box', letterSpacing:3, border: phoneError ? '2px solid #ef4444' : `1px solid ${C.cardBorder}` }} />
        </div>
        {phoneError && <div style={{ color:'#ef4444', fontSize:12, marginBottom:8, paddingLeft:4 }}>{phoneError}</div>}

        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,193,7,0.07)', border:'1px solid rgba(255,193,7,0.2)', borderRadius:12, padding:'11px 16px', marginBottom:24 }}>
          <Shield size={15} color={C.gold} />
          <span style={{ fontSize:12, color: C.textSec }}>Har number ka alag account — data 100% secure hai</span>
        </div>

        <button onClick={sendOtp} disabled={phone.length!==10}
          style={{ width:'100%', padding:'17px', borderRadius:14, border:'none', fontSize:16, fontWeight:800, ...orangeBtn(phone.length!==10), transition:'all 0.2s' }}>
          OTP Bhejo 📲
        </button>
      </div>
    </div>
  );

  // ── OTP ───────────────────────────────────────────────────────────────────
  if (screen === 'otp') return (
    <div style={{ width:'100%', height:'100dvh', background: C.bgGrad, display:'flex', flexDirection:'column', padding:'24px 20px', overflow:'hidden', position:'relative' }}>
      <TilePattern opacity={0.05} />
      <button onClick={() => setScreen('login')} style={{ width:44, height:44, borderRadius:22, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', marginBottom:40, position:'relative', zIndex:1 }}>
        <ArrowLeft size={20} color="#fff" />
      </button>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:370, width:'100%', margin:'0 auto', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:30, fontWeight:900, color:'#fff', marginBottom:8 }}>OTP Verify Karo</div>
        <div style={{ color: C.textSec, fontSize:14, marginBottom:12 }}>+91 {phone} pe bheja gaya</div>

        <div style={{ ...glassCard, borderRadius:14, padding:'14px 18px', marginBottom:32, border:`1px solid rgba(255,193,7,0.3)` }}>
          <div style={{ fontSize:12, color: C.gold, fontWeight:700, marginBottom:4 }}>Demo OTP (testing ke liye)</div>
          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:6 }}>{generatedOtp}</div>
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'center', marginBottom:16 }}>
          {otp.map((d,i) => (
            <input key={i} ref={el => { otpRefs.current[i]=el; }} value={d} maxLength={1} type="tel"
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => { if (e.key==='Backspace' && !d && i>0) otpRefs.current[i-1]?.focus(); }}
              style={{ width:48, height:60, textAlign:'center', fontSize:26, fontWeight:800, ...glassCard, border:`2px solid ${d?C.orange:'rgba(255,255,255,0.12)'}`, borderRadius:14, color:'#fff', outline:'none', boxShadow: d?`0 0 16px ${C.orangeGlow}`:'none', transition:'all 0.2s' }} />
          ))}
        </div>

        {otpError && <div style={{ color:'#ef4444', fontSize:13, textAlign:'center', marginBottom:10 }}>{otpError}</div>}

        <button onClick={verifyOtp} disabled={otp.join('').length < 6}
          style={{ width:'100%', padding:'17px', borderRadius:14, border:'none', fontSize:16, fontWeight:800, marginTop:8, ...orangeBtn(otp.join('').length < 6), transition:'all 0.2s' }}>
          Verify Karo ✓
        </button>

        <div style={{ textAlign:'center', marginTop:18, fontSize:13, color: C.textSec }}>
          {countdown > 0 ? `Resend in ${countdown}s` : (
            <button onClick={() => { const c=String(Math.floor(100000+Math.random()*900000)); setGeneratedOtp(c); setCountdown(30); setOtp(['','','','','','']); }}
              style={{ background:'transparent', border:'none', color: C.orange, cursor:'pointer', fontWeight:700, fontSize:13 }}>
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // ── PROFILE SETUP ─────────────────────────────────────────────────────────
  if (screen === 'profile-setup') return (
    <div style={{ width:'100%', minHeight:'100dvh', background: C.bg }}>
      <ProfileSetupScreen workerType={workerType}
        onComplete={profile => { store.saveProfile(profile); setScreen('main'); }} />
    </div>
  );

  return <MainApp store={store} onLogout={logout} />;
}
