import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Home, Briefcase, IndianRupee, User, Bell, MapPin, Edit2, LogOut, X } from 'lucide-react';
import type { useAppStore } from './store';
import { EXTRA_JOBS_POOL } from './store';
import type { Job, PaymentMethod } from './store';

type Tab = 'home' | 'jobs' | 'earnings' | 'profile';
type StoreType = ReturnType<typeof useAppStore>;
interface Props { store: StoreType; onLogout: () => void; }

// ── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:        '#071B5A',
  bgGrad:    'linear-gradient(160deg, #040F35 0%, #071B5A 50%, #0A2070 100%)',
  orange:    '#FF8A00',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#8BA5D4',
  navBg:     '#040F35',
  cardBorder:'rgba(255,138,0,0.22)',
  green:     '#22c55e',
};

const glassCard = (glowBorder = false) => ({
  background: 'rgba(10,28,90,0.75)',
  border: `1px solid ${glowBorder ? C.orange : C.cardBorder}`,
  boxShadow: glowBorder
    ? `0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(255,138,0,0.2), inset 0 1px 0 rgba(255,255,255,0.07)`
    : `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
  backdropFilter: 'blur(12px)',
});

// ── Sound ────────────────────────────────────────────────────────────────────
function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    [880, 1100, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch {}
}

// ── Notification Banner ──────────────────────────────────────────────────────
function JobNotification({ job, onAccept, onDismiss }: { job: Job; onAccept: () => void; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { onDismiss(); return 0; }
      return c - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [onDismiss]);

  return (
    <div style={{ position:'fixed', top:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, zIndex:999, transformOrigin:'top center' }}>
      {/* Shimmer line */}
      <div style={{ height: visible ? 3 : 0, background:`linear-gradient(90deg, ${C.orange}, ${C.gold}, ${C.orange})`, backgroundSize:'200% 100%', animation:'shimmer 1.5s linear infinite', transition:'height 0.3s' }} />
      <div style={{
        margin:'6px 10px 0',
        ...glassCard(true),
        borderRadius:20, overflow:'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(90deg,${C.orange},#E06000)`, padding:'9px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:4, background:'#fff', display:'inline-block', animation:'blink 1s infinite' }} />
            <span style={{ color:'#fff', fontWeight:900, fontSize:13, letterSpacing:0.5 }}>🔔 NAYA JOB AAYA!</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ background:'rgba(0,0,0,0.25)', borderRadius:10, padding:'2px 8px', color:'#fff', fontSize:11, fontWeight:700 }}>{countdown}s</span>
            <button onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }} style={{ background:'rgba(0,0,0,0.25)', border:'none', color:'#fff', width:22, height:22, borderRadius:11, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={12} />
            </button>
          </div>
        </div>

        <div style={{ padding:'16px 18px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:900, color:'#fff', marginBottom:4 }}>{job.customerName}</div>
              <span style={{ background:`rgba(255,138,0,0.18)`, color: C.orange, borderRadius:8, padding:'3px 12px', fontSize:12, fontWeight:700, border:`1px solid rgba(255,138,0,0.3)` }}>{job.workType}</span>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:24, fontWeight:900, color: C.gold, textShadow:`0 0 12px rgba(255,193,7,0.5)` }}>₹{job.dailyRate}</div>
              <div style={{ fontSize:11, color: C.textSec }}>per day</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:16, marginBottom:14, color: C.textSec, fontSize:13 }}>
            <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={13} color={C.orange} />{job.location}</span>
            <span>📍 {job.distance} km</span>
          </div>
          {/* Countdown bar */}
          <div style={{ height:3, background:'rgba(255,255,255,0.1)', borderRadius:2, marginBottom:14, overflow:'hidden' }}>
            <div style={{ height:'100%', background:`linear-gradient(90deg,${C.orange},${C.gold})`, borderRadius:2, width:`${(countdown/20)*100}%`, transition:'width 1s linear' }} />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => { setVisible(false); setTimeout(onAccept, 300); }}
              style={{ flex:1, padding:'13px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontWeight:900, fontSize:15, cursor:'pointer', boxShadow:`0 4px 18px ${C.orangeGlow}` }}>
              ✓ Accept Karo
            </button>
            <button onClick={() => { setVisible(false); setTimeout(onDismiss, 400); }}
              style={{ flex:0.55, padding:'13px 0', borderRadius:12, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', color: C.textSec, fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Skip
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes livePulse{0%{box-shadow:0 0 0 0 rgba(34,197,94,0.55)}60%{box-shadow:0 0 0 7px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}
      `}</style>
    </div>
  );
}

// ── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange, jobCount }: { active: Tab; onChange: (t: Tab) => void; jobCount: number }) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id:'home',     icon:<Home size={22}/>,         label:'Home' },
    { id:'jobs',     icon:<Briefcase size={22}/>,    label:'Jobs' },
    { id:'earnings', icon:<IndianRupee size={22}/>,  label:'Earnings' },
    { id:'profile',  icon:<User size={22}/>,         label:'Profile' },
  ];
  return (
    <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:430, background: C.navBg, borderTop:`1px solid rgba(255,138,0,0.18)`, display:'flex', zIndex:100, paddingBottom:'env(safe-area-inset-bottom)', boxShadow:`0 -4px 24px rgba(0,0,0,0.5)` }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{ flex:1, padding:'11px 0 8px', border:'none', background:'transparent', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3, color: isActive ? C.orange : '#4A6A9A', position:'relative', transition:'all 0.2s' }}>
            <div style={{ position:'relative', filter: isActive ? `drop-shadow(0 0 6px ${C.orangeGlow})` : 'none', transition:'filter 0.2s' }}>
              {t.icon}
              {t.id==='home' && jobCount > 0 && (
                <div style={{ position:'absolute', top:-5, right:-7, background:'#ef4444', borderRadius:8, minWidth:16, height:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff', padding:'0 3px', boxShadow:'0 2px 6px rgba(239,68,68,0.5)' }}>{jobCount}</div>
              )}
            </div>
            <span style={{ fontSize:10, fontWeight: isActive ? 800 : 600, letterSpacing:0.3 }}>{t.label}</span>
            {isActive && <div style={{ position:'absolute', bottom:0, width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${C.orange}, transparent)`, boxShadow:`0 0 8px ${C.orangeGlow}` }} />}
          </button>
        );
      })}
    </div>
  );
}

// ── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onAccept, onReject }: { job: Job; onAccept: () => void; onReject: () => void }) {
  const isNew = job.postedAgo === 'Abhi abhi';
  return (
    <div style={{ ...glassCard(isNew), borderRadius:18, padding:'16px 18px', marginBottom:14, position:'relative', overflow:'hidden', transition:'all 0.2s' }}>
      {isNew && (
        <>
          <div style={{ position:'absolute', top:0, right:0, width:80, height:80, background:`radial-gradient(circle, rgba(255,138,0,0.15) 0%, transparent 70%)`, pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:12, right:14, background:`linear-gradient(135deg,${C.orange},#E06000)`, borderRadius:8, padding:'2px 10px', fontSize:10, fontWeight:900, color:'#fff', boxShadow:`0 2px 8px ${C.orangeGlow}`, animation:'blink 1.5s infinite' }}>NEW</div>
        </>
      )}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10, paddingRight: isNew ? 56 : 0 }}>
        <span style={{ background:`rgba(255,138,0,0.15)`, color: C.orange, borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:700, border:`1px solid rgba(255,138,0,0.3)` }}>{job.workType}</span>
        <span style={{ color: C.gold, fontWeight:900, fontSize:20, textShadow:`0 0 10px rgba(255,193,7,0.4)` }}>₹{job.dailyRate}<span style={{ fontSize:11, color: C.textSec, fontWeight:500 }}>/day</span></span>
      </div>
      <div style={{ fontSize:16, fontWeight:800, marginBottom:8, color:'#fff' }}>{job.customerName}</div>
      <div style={{ display:'flex', gap:16, marginBottom:14, color: C.textSec, fontSize:13 }}>
        <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={13} color={C.orange}/>{job.location}</span>
        <span>📍 {job.distance} km</span>
        <span>🕐 {job.postedAgo}</span>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onAccept} style={{ flex:1, padding:'13px 0', borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', boxShadow:`0 4px 16px ${C.orangeGlow}` }}>Accept ✓</button>
        <button onClick={onReject} style={{ flex:0.55, padding:'13px 0', borderRadius:12, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', color: C.textSec, fontWeight:700, fontSize:14, cursor:'pointer' }}>Reject</button>
      </div>
    </div>
  );
}

// ── Status Toggle ────────────────────────────────────────────────────────────
function StatusToggle({ isOnline, onToggle }: { isOnline: boolean; onToggle: () => void }) {
  const [toast, setToast] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const handle = () => {
    setAnimating(true);
    onToggle();
    setToast(isOnline ? "Naye jobs nahi aayenge" : 'Aap customers ko dikh rahe ho!');
    setTimeout(() => setAnimating(false), 400);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div style={{ marginBottom:20, position:'relative' }}>
      {/* Toast */}
      <div style={{ position:'absolute', top:-48, left:0, right:0, display:'flex', justifyContent:'center', pointerEvents:'none', zIndex:50, opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(-6px)', transition:'all 0.3s' }}>
        <div style={{ background:`rgba(255,138,0,0.12)`, border:`1px solid rgba(255,138,0,0.35)`, backdropFilter:'blur(10px)', borderRadius:20, padding:'7px 18px', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap', boxShadow:`0 4px 20px ${C.orangeGlow}` }}>
          {toast}
        </div>
      </div>

      <div style={{ ...glassCard(), borderRadius:18, padding:'15px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', transition:'all 0.3s', border: isOnline ? '1px solid rgba(34,197,94,0.3)' : `1px solid ${C.cardBorder}` }} onClick={handle}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background: isOnline ? C.green : '#475569', animation: isOnline ? 'livePulse 2s infinite' : 'none', transition:'background 0.3s' }} />
          <div>
            <div style={{ fontSize:14, fontWeight:800, color: isOnline ? '#fff' : '#64748b', transition:'color 0.3s' }}>{isOnline ? 'Available for Work' : 'Currently Offline'}</div>
            <div style={{ fontSize:11, color: isOnline ? '#86efac' : '#475569', marginTop:1, transition:'color 0.3s' }}>{isOnline ? 'Jobs aa rahe hain' : 'Jobs band hain abhi'}</div>
          </div>
        </div>

        {/* Toggle pill */}
        <div style={{ width:54, height:30, borderRadius:15, background: isOnline ? `linear-gradient(135deg,${C.green},#16a34a)` : 'rgba(255,255,255,0.08)', border:`1.5px solid ${isOnline ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.12)'}`, position:'relative', transition:'all 0.35s', boxShadow: isOnline ? '0 0 16px rgba(34,197,94,0.45)' : 'none', flexShrink:0 }}>
          <div style={{ position:'absolute', top:4, left: isOnline ? 27 : 4, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 2px 6px rgba(0,0,0,0.3)', transition:'left 0.3s cubic-bezier(0.34,1.4,0.64,1)', transform: animating ? 'scale(0.85)' : 'scale(1)' }} />
        </div>
      </div>
    </div>
  );
}

// ── Home Tab ──────────────────────────────────────────────────────────────────
function HomeTab({ store, notification, onClearNotification }: { store: StoreType; notification: Job | null; onClearNotification: () => void }) {
  const paidEarnings = store.earnings.filter(e => e.status === 'paid');
  const todayTotal = store.earnings.slice(0,1).reduce((s,e) => s+e.amount, 0);
  const weekTotal = paidEarnings.reduce((s,e) => s+e.amount, 0);
  const availableJobs = store.jobs.filter(j => j.status === 'available');
  const acceptedJobs = store.jobs.filter(j => ['accepted','started','on-break'].includes(j.status));

  return (
    <div style={{ padding:'16px 16px 0' }}>
      {notification && (
        <JobNotification job={notification}
          onAccept={() => { store.acceptJob(notification.id); onClearNotification(); }}
          onDismiss={onClearNotification} />
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:24, background:`rgba(255,138,0,0.15)`, border:`2px solid ${C.orange}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 14px rgba(255,138,0,0.25)` }}>
            <User size={22} color={C.orange} />
          </div>
          <div>
            <div style={{ fontSize:12, color: C.textSec }}>Good Morning 👷</div>
            <div style={{ fontSize:17, fontWeight:900, color:'#fff' }}>{store.profile?.name || 'Worker'}</div>
          </div>
        </div>
        <div style={{ position:'relative', width:42, height:42, borderRadius:21, ...glassCard(), display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Bell size={18} color={C.textSec} />
          {availableJobs.length > 0 && <div style={{ position:'absolute', top:9, right:9, width:8, height:8, borderRadius:4, background:'#ef4444', border:`1.5px solid ${C.bg}`, boxShadow:'0 0 6px rgba(239,68,68,0.6)' }} />}
        </div>
      </div>

      {/* Status toggle */}
      <StatusToggle isOnline={store.isOnline} onToggle={store.toggleOnline} />

      {/* Earnings card */}
      <div style={{ background:`linear-gradient(135deg, rgba(255,138,0,0.22), rgba(255,138,0,0.08))`, borderRadius:20, padding:20, marginBottom:20, border:`1px solid rgba(255,138,0,0.35)`, boxShadow:`0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(255,138,0,0.1)`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,193,7,0.15) 0%, transparent 70%)` }} />
        <div style={{ fontSize:13, color: C.textSec, marginBottom:4 }}>Today's Earnings</div>
        <div style={{ fontSize:40, fontWeight:900, color: C.gold, marginBottom:18, textShadow:`0 0 20px rgba(255,193,7,0.4)` }}>₹{todayTotal.toLocaleString('en-IN')}</div>
        <div style={{ display:'flex' }}>
          <div style={{ flex:1, borderRight:`1px solid rgba(255,255,255,0.12)`, paddingRight:16 }}>
            <div style={{ fontSize:11, color: C.textSec }}>This Week</div>
            <div style={{ fontSize:19, fontWeight:800, color:'#fff' }}>₹{weekTotal.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ flex:1, paddingLeft:16 }}>
            <div style={{ fontSize:11, color: C.textSec }}>Completed</div>
            <div style={{ fontSize:19, fontWeight:800, color:'#fff' }}>{paidEarnings.length} jobs</div>
          </div>
        </div>
      </div>

      {/* Active job banner */}
      {acceptedJobs.length > 0 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:14, fontWeight:800, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ width:8, height:8, borderRadius:4, background: C.green, display:'inline-block', boxShadow:`0 0 8px ${C.green}` }} />Active Job
          </div>
          <div style={{ ...glassCard(), borderRadius:16, padding:14, border:`1px solid rgba(34,197,94,0.25)`, boxShadow:`0 8px 24px rgba(0,0,0,0.4), 0 0 14px rgba(34,197,94,0.08)` }}>
            <div style={{ fontWeight:800, fontSize:15 }}>{acceptedJobs[0].customerName}</div>
            <div style={{ color: C.textSec, fontSize:13, marginTop:2 }}>{acceptedJobs[0].workType} • {acceptedJobs[0].location}</div>
            <div style={{ color: C.green, fontSize:12, marginTop:7, fontWeight:700 }}>
              {acceptedJobs[0].status==='accepted' ? '⏳ Jobs tab mein jao — Kaam shuru karo' : acceptedJobs[0].status==='started' ? '✅ Kaam chal raha hai' : '☕ Lunch break pe ho'}
            </div>
          </div>
        </div>
      )}

      {/* Nearby jobs */}
      <div style={{ marginBottom:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <span style={{ fontSize:15, fontWeight:900 }}>Nearby Jobs</span>
          {availableJobs.length > 0 && <span style={{ background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', borderRadius:10, padding:'2px 10px', fontSize:12, fontWeight:900, boxShadow:`0 2px 8px ${C.orangeGlow}` }}>{availableJobs.length}</span>}
        </div>
        {availableJobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'44px 20px', color:'rgba(255,255,255,0.2)' }}>
            <Briefcase size={44} style={{ marginBottom:12, opacity:0.3 }} />
            <div style={{ fontWeight:700, color:'rgba(255,255,255,0.35)' }}>Abhi koi job nahi hai</div>
            <div style={{ fontSize:13, marginTop:6, color:'rgba(255,255,255,0.25)' }}>Online raho — naaye jobs aayenge</div>
          </div>
        ) : availableJobs.map(job => (
          <JobCard key={job.id} job={job} onAccept={() => store.acceptJob(job.id)} onReject={() => store.rejectJob(job.id)} />
        ))}
      </div>
    </div>
  );
}

// ── WorkFlow Tracker ─────────────────────────────────────────────────────────
function WorkFlowTracker({ job, store }: { job: Job; store: StoreType }) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [rating, setRating] = useState(0);
  const payMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id:'cash', label:'Cash', icon:'💵' }, { id:'upi', label:'UPI', icon:'📱' },
    { id:'phonepe', label:'PhonePe', icon:'🟣' }, { id:'googlepay', label:'GPay', icon:'🔵' }, { id:'paytm', label:'Paytm', icon:'🔷' },
  ];

  if (job.rating) return (
    <div style={{ ...glassCard(), borderRadius:16, padding:16, border:`1px solid rgba(34,197,94,0.25)`, marginBottom:12 }}>
      <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>✅ Job Complete!</div>
      <div style={{ color: C.textSec, fontSize:13 }}>{job.customerName} • ₹{job.dailyRate}</div>
      <div style={{ color: C.gold, fontSize:15, marginTop:8 }}>{'⭐'.repeat(job.rating)} Rating diya</div>
    </div>
  );

  if (job.paymentStatus === 'paid' && !job.rating) return (
    <div style={{ ...glassCard(), borderRadius:16, padding:16, border:`1px solid rgba(34,197,94,0.25)`, marginBottom:12 }}>
      <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>💰 Paid! Customer ko Rate Karo</div>
      <div style={{ color: C.textSec, fontSize:13, marginBottom:12 }}>{job.customerName} • ₹{job.dailyRate} via {job.paymentMethod}</div>
      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setRating(s)} style={{ fontSize:30, border:'none', background:'transparent', cursor:'pointer', filter: s<=rating ? 'none' : 'grayscale(1) opacity(0.4)', transition:'filter 0.15s' }}>⭐</button>
        ))}
      </div>
      <button onClick={() => store.addRating(job.id, rating)} disabled={!rating}
        style={{ width:'100%', padding:13, borderRadius:12, border:'none', background: rating ? `linear-gradient(135deg,${C.gold},#E8A800)` : 'rgba(255,255,255,0.05)', color: rating ? '#1A1A1A' : '#3A5080', fontWeight:800, cursor: rating ? 'pointer' : 'not-allowed', boxShadow: rating ? `0 4px 16px rgba(255,193,7,0.4)` : 'none' }}>
        Submit Rating
      </button>
    </div>
  );

  if (job.status === 'completed' && job.paymentStatus !== 'paid') return (
    <div style={{ ...glassCard(), borderRadius:16, padding:16, marginBottom:12 }}>
      <div style={{ fontSize:15, fontWeight:800, marginBottom:4 }}>💰 Payment Collect Karo</div>
      <div style={{ color: C.gold, fontSize:24, fontWeight:900, marginBottom:12, textShadow:`0 0 12px rgba(255,193,7,0.4)` }}>₹{job.dailyRate}</div>
      {!showPayment ? (
        <button onClick={() => setShowPayment(true)} style={{ width:'100%', padding:13, borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontWeight:800, cursor:'pointer', boxShadow:`0 4px 16px ${C.orangeGlow}` }}>
          Payment Method Choose Karo
        </button>
      ) : (
        <>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
            {payMethods.map(m => (
              <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                style={{ padding:'9px 13px', borderRadius:10, border:`2px solid ${selectedMethod===m.id ? C.orange : 'rgba(255,255,255,0.12)'}`, background: selectedMethod===m.id ? `rgba(255,138,0,0.18)` : 'rgba(255,255,255,0.04)', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 0.15s' }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <button onClick={() => { if (selectedMethod) store.markPaid(job.id, selectedMethod); }} disabled={!selectedMethod}
            style={{ width:'100%', padding:13, borderRadius:12, border:'none', background: selectedMethod ? C.green : 'rgba(255,255,255,0.05)', color: selectedMethod ? '#fff' : '#3A5080', fontWeight:800, cursor: selectedMethod ? 'pointer' : 'not-allowed', boxShadow: selectedMethod ? '0 4px 16px rgba(34,197,94,0.4)' : 'none' }}>
            ✅ Payment Received
          </button>
        </>
      )}
    </div>
  );

  const steps = [
    { label:'Job Accept', done:true, time:undefined as string|undefined },
    { label:'Kaam Shuru', done:!!job.startTime, time:job.startTime, action: job.status==='accepted' ? () => store.startWork(job.id) : undefined, actionLabel:'▶ Kaam Shuru Karo' },
    { label:'Lunch Break', done:!!job.lunchStart, time:job.lunchStart, action: job.status==='started' && !job.lunchStart ? () => store.startLunch(job.id) : undefined, actionLabel:'☕ Lunch Break' },
    { label:'Resume', done:!!job.lunchEnd, time:job.lunchEnd, action: job.status==='on-break' ? () => store.resumeWork(job.id) : undefined, actionLabel:'▶ Resume Karo' },
    { label:'Kaam Complete', done:!!job.endTime, time:job.endTime, action: job.status==='started' && job.startTime ? () => store.completeWork(job.id) : undefined, actionLabel:'🏁 Complete Karo' },
  ];

  return (
    <div style={{ ...glassCard(true), borderRadius:18, padding:'16px 18px', marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:900, fontSize:16 }}>{job.customerName}</div>
          <div style={{ color: C.textSec, fontSize:13, marginTop:3 }}>{job.workType} • {job.location}</div>
        </div>
        <div style={{ color: C.gold, fontWeight:900, fontSize:20, textShadow:`0 0 10px rgba(255,193,7,0.4)` }}>₹{job.dailyRate}</div>
      </div>
      <div style={{ position:'relative', paddingLeft:22 }}>
        <div style={{ position:'absolute', left:7, top:8, bottom:8, width:2, background:`rgba(255,138,0,0.2)`, borderRadius:1 }} />
        {steps.map((step, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14, position:'relative' }}>
            <div style={{ width:14, height:14, borderRadius:7, border:`2px solid ${step.done ? C.orange : 'rgba(255,255,255,0.15)'}`, background: step.done ? C.orange : 'transparent', flexShrink:0, marginTop:2, zIndex:1, boxShadow: step.done ? `0 0 10px ${C.orangeGlow}` : 'none', transition:'all 0.3s' }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color: step.done ? '#fff' : 'rgba(255,255,255,0.3)' }}>{step.label}</div>
              {step.time && <div style={{ fontSize:11, color: C.textSec, marginTop:2 }}>🕐 {step.time}</div>}
              {step.action && (
                <button onClick={step.action} style={{ marginTop:8, padding:'11px 18px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontWeight:800, fontSize:13, cursor:'pointer', boxShadow:`0 4px 14px ${C.orangeGlow}` }}>
                  {step.actionLabel}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Jobs Tab ──────────────────────────────────────────────────────────────────
function JobsTab({ store }: { store: StoreType }) {
  const [tab, setTab] = useState<'active'|'completed'>('active');
  const activeJobs    = store.jobs.filter(j => ['accepted','started','on-break','completed'].includes(j.status));
  const completedJobs = store.jobs.filter(j => j.status === 'completed');

  return (
    <div style={{ padding:'16px 16px 0' }}>
      <div style={{ fontSize:22, fontWeight:900, marginBottom:18 }}>My Jobs</div>
      <div style={{ display:'flex', gap:0, ...glassCard(), borderRadius:14, padding:4, marginBottom:22 }}>
        {(['active','completed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'11px 0', borderRadius:11, border:'none', background: tab===t ? `linear-gradient(135deg,${C.orange},#E06000)` : 'transparent', color: tab===t ? '#fff' : C.textSec, fontWeight:800, cursor:'pointer', fontSize:14, boxShadow: tab===t ? `0 2px 12px ${C.orangeGlow}` : 'none', transition:'all 0.2s' }}>
            {t==='active' ? `Active (${activeJobs.length})` : `Done (${completedJobs.length})`}
          </button>
        ))}
      </div>
      {tab==='active' && (
        activeJobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.2)' }}>
            <Briefcase size={48} style={{ marginBottom:12, opacity:0.2 }} />
            <div>Koi active job nahi hai</div>
            <div style={{ fontSize:13, marginTop:8 }}>Home pe jao — job accept karo</div>
          </div>
        ) : activeJobs.map(job => <WorkFlowTracker key={job.id} job={job} store={store} />)
      )}
      {tab==='completed' && (
        completedJobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🏁</div>
            <div>Abhi koi completed job nahi hai</div>
          </div>
        ) : completedJobs.map(job => (
          <div key={job.id} style={{ ...glassCard(), borderRadius:16, padding:'16px 18px', marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:800, fontSize:15 }}>{job.customerName}</div>
                <div style={{ color: C.textSec, fontSize:13 }}>{job.workType}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color: C.gold, fontWeight:900, fontSize:17, textShadow:`0 0 8px rgba(255,193,7,0.4)` }}>₹{job.dailyRate}</div>
                <div style={{ fontSize:11, color: job.paymentStatus==='paid' ? C.green : C.orange, marginTop:2 }}>
                  {job.paymentStatus==='paid' ? '✓ Paid' : '⏳ Pending'}
                </div>
              </div>
            </div>
            {job.rating && <div style={{ color: C.gold, fontSize:14, marginTop:8 }}>{'⭐'.repeat(job.rating)}</div>}
          </div>
        ))
      )}
    </div>
  );
}

// ── Earnings Tab ──────────────────────────────────────────────────────────────
function EarningsTab({ store }: { store: StoreType }) {
  const paid = store.earnings.filter(e => e.status === 'paid');
  const pending = store.earnings.filter(e => e.status === 'pending');
  const total = paid.reduce((s,e) => s+e.amount, 0);
  const pendingTotal = pending.reduce((s,e) => s+e.amount, 0);
  const chartData = [40,60,80,45,100,70,55];
  const days = ['M','T','W','T','F','S','S'];
  const maxH = Math.max(...chartData);

  return (
    <div style={{ padding:'16px 16px 0' }}>
      <div style={{ fontSize:22, fontWeight:900, marginBottom:20 }}>My Earnings</div>

      {/* Big earnings card */}
      <div style={{ background:`linear-gradient(135deg, rgba(255,138,0,0.22), rgba(255,193,7,0.08))`, borderRadius:22, padding:'24px 20px', marginBottom:18, border:`1px solid rgba(255,138,0,0.35)`, textAlign:'center', position:'relative', overflow:'hidden', boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(255,138,0,0.1)` }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, rgba(255,193,7,0.2) 0%, transparent 70%)` }} />
        <div style={{ fontSize:12, color: C.textSec, marginBottom:6, fontWeight:700, letterSpacing:1 }}>TOTAL EARNED</div>
        <div style={{ fontSize:46, fontWeight:900, color: C.gold, textShadow:`0 0 24px rgba(255,193,7,0.5)` }}>₹{total.toLocaleString('en-IN')}</div>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[
          { label:'Completed', value: paid.length.toString(), color: C.green },
          { label:'Pending', value:`₹${pendingTotal.toLocaleString('en-IN')}`, color: C.orange },
          { label:'Rating', value:'4.8⭐', color: C.gold },
        ].map(s => (
          <div key={s.label} style={{ flex:1, ...glassCard(), borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:900, color: s.color, textShadow: s.color===C.gold ? `0 0 10px rgba(255,193,7,0.4)` : 'none' }}>{s.value}</div>
            <div style={{ fontSize:10, color: C.textSec, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ ...glassCard(), borderRadius:18, padding:18, marginBottom:20 }}>
        <div style={{ fontWeight:800, marginBottom:14, fontSize:14 }}>This Week</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:80 }}>
          {chartData.map((h, i) => (
            <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ width:'100%', background:`linear-gradient(to top, ${C.orange}, ${C.gold})`, borderRadius:'4px 4px 0 0', height:`${(h/maxH)*60}px`, boxShadow:`0 0 8px ${C.orangeGlow}` }} />
              <span style={{ fontSize:10, color: C.textSec }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontWeight:800, marginBottom:12, fontSize:15 }}>Recent Transactions</div>
      {store.earnings.length === 0 ? (
        <div style={{ textAlign:'center', padding:'40px 20px', color:'rgba(255,255,255,0.2)' }}>Abhi koi transaction nahi hai</div>
      ) : store.earnings.map(e => (
        <div key={e.id} style={{ ...glassCard(), borderRadius:14, padding:'14px 16px', marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14 }}>{e.customerName}</div>
            <div style={{ color: C.textSec, fontSize:12, marginTop:2 }}>{e.workType} • {e.date}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:900, fontSize:16, color: e.status==='paid' ? C.green : C.orange }}>
              {e.status==='paid' ? '+' : '⏳ '}₹{e.amount}
            </div>
            <div style={{ fontSize:11, color: e.status==='paid' ? C.green : C.orange, marginTop:1 }}>{e.status==='paid' ? 'Paid' : 'Pending'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab({ store, onLogout }: { store: StoreType; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(store.profile?.name ?? '');
  const [city, setCity] = useState(store.profile?.city ?? '');
  const [charge, setCharge] = useState(String(store.profile?.dailyCharge ?? ''));
  const completed = store.jobs.filter(j => j.status === 'completed').length;

  const save = () => {
    if (store.profile) store.saveProfile({ ...store.profile, name, city, dailyCharge: Number(charge) });
    setEditing(false);
  };

  return (
    <div style={{ padding:'16px 16px 0' }}>
      {/* Profile hero */}
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ position:'relative', display:'inline-block', marginBottom:12 }}>
          <div style={{ width:84, height:84, borderRadius:42, background:`linear-gradient(135deg, rgba(255,138,0,0.2), rgba(255,193,7,0.1))`, border:`3px solid ${C.orange}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px ${C.orangeGlow}, 0 0 0 6px rgba(255,138,0,0.08)` }}>
            <User size={38} color={C.orange} />
          </div>
          {/* Animated ring */}
          <div style={{ position:'absolute', inset:-6, borderRadius:'50%', border:`1.5px solid rgba(255,138,0,0.3)`, animation:'livePulse 2.5s infinite' }} />
        </div>
        <div style={{ fontSize:22, fontWeight:900 }}>{store.profile?.name}</div>
        <div style={{ color: C.textSec, fontSize:13, marginTop:4 }}>📞 +91 {store.phone}</div>
        <div style={{ display:'inline-block', background:`rgba(255,138,0,0.15)`, color: C.orange, borderRadius:10, padding:'5px 16px', fontSize:12, fontWeight:800, marginTop:8, border:`1px solid rgba(255,138,0,0.3)` }}>
          {store.profile?.workerType === 'mistri' ? '🏗️ Tile Mistri' : '🔨 Labour Worker'}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {[{ label:'Rating', value:'4.8⭐', color: C.gold }, { label:'Jobs Done', value: String(completed), color: C.green }, { label:'Experience', value:`${store.profile?.experience}yr`, color: C.textSec }].map(s => (
          <div key={s.label} style={{ flex:1, ...glassCard(), borderRadius:14, padding:'13px 8px', textAlign:'center' }}>
            <div style={{ fontSize:18, fontWeight:900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color: C.textSec, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {!editing ? (
        <>
          <div style={{ ...glassCard(), borderRadius:18, padding:'4px 16px', marginBottom:12 }}>
            {[{ label:'City', value: store.profile?.city }, { label:'Daily Charge', value:`₹${store.profile?.dailyCharge}/day` }, { label:'Work Radius', value:`${store.profile?.workRadius} km` }].map(r => (
              <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: C.textSec, fontSize:13 }}>{r.label}</span>
                <span style={{ fontWeight:700, fontSize:13 }}>{r.value}</span>
              </div>
            ))}
          </div>
          <div style={{ ...glassCard(), borderRadius:18, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:12, color: C.textSec, marginBottom:10, fontWeight:700, letterSpacing:0.5 }}>SKILLS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {store.profile?.skills.map(s => (
                <span key={s} style={{ background:`rgba(255,138,0,0.12)`, color: C.orange, borderRadius:8, padding:'5px 11px', fontSize:12, fontWeight:700, border:`1px solid rgba(255,138,0,0.25)` }}>{s}</span>
              ))}
            </div>
          </div>
          <button onClick={() => setEditing(true)} style={{ width:'100%', padding:14, borderRadius:14, border:`1.5px solid ${C.orange}`, background:'rgba(255,138,0,0.08)', color: C.orange, fontWeight:800, cursor:'pointer', fontSize:14, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all 0.2s' }}>
            <Edit2 size={16} /> Profile Edit Karo
          </button>
        </>
      ) : (
        <div style={{ ...glassCard(), borderRadius:18, padding:18, marginBottom:12 }}>
          <div style={{ fontSize:15, fontWeight:800, marginBottom:16 }}>Profile Edit Karo</div>
          {[{ label:'Naam', value:name, set:setName }, { label:'Sheher', value:city, set:setCity }, { label:'Daily Charge (₹)', value:charge, set:setCharge }].map(f => (
            <div key={f.label} style={{ marginBottom:12 }}>
              <label style={{ fontSize:11, color: C.textSec, fontWeight:700, display:'block', marginBottom:6, letterSpacing:0.5 }}>{f.label.toUpperCase()}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)} style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, padding:'11px 13px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box' }} />
            </div>
          ))}
          <div style={{ display:'flex', gap:10, marginTop:18 }}>
            <button onClick={() => setEditing(false)} style={{ flex:1, padding:12, borderRadius:12, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', color: C.textSec, fontWeight:700, cursor:'pointer' }}>Cancel</button>
            <button onClick={save} style={{ flex:1, padding:12, borderRadius:12, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontWeight:800, cursor:'pointer', boxShadow:`0 4px 14px ${C.orangeGlow}` }}>Save Karo</button>
          </div>
        </div>
      )}

      <button onClick={onLogout} style={{ width:'100%', padding:14, borderRadius:14, border:'1.5px solid #ef4444', background:'rgba(239,68,68,0.07)', color:'#ef4444', fontWeight:800, cursor:'pointer', fontSize:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:24, transition:'all 0.2s' }}>
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

// ── Main App Shell ────────────────────────────────────────────────────────────
export function MainApp({ store, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home');
  const [notification, setNotification] = useState<Job | null>(null);
  const notifUsedIds = useRef<Set<string>>(new Set());
  const poolIndex = useRef(0);

  const availableCount = store.jobs.filter(j => j.status === 'available').length;

  const triggerNextJob = useCallback(() => {
    const pool = EXTRA_JOBS_POOL;
    const idx = poolIndex.current % pool.length;
    poolIndex.current = idx + 1;
    store.addNewJob(pool[idx]);
  }, [store]);

  useEffect(() => {
    if (!store.isOnline) return;
    const first = setTimeout(triggerNextJob, 8000);
    const interval = setInterval(() => { if (!notification) triggerNextJob(); }, 25000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [store.isOnline]);

  useEffect(() => {
    const newJob = store.jobs.find(j => j.postedAgo==='Abhi abhi' && j.status==='available' && !notifUsedIds.current.has(j.id));
    if (newJob && !notification) {
      notifUsedIds.current.add(newJob.id);
      setNotification(newJob);
      playNotificationSound();
    }
  }, [store.jobs, notification]);

  return (
    <div style={{ width:'100%', minHeight:'100dvh', background: C.bgGrad, color:'#fff', paddingBottom:80, overflowY:'auto' }}>
      {/* Tile pattern bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(255,138,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,138,0,0.04) 1px,transparent 1px)`, backgroundSize:'48px 48px', zIndex:0 }} />
      <div style={{ position:'relative', zIndex:1 }}>
        {tab==='home'     && <HomeTab store={store} notification={notification} onClearNotification={() => setNotification(null)} />}
        {tab==='jobs'     && <JobsTab store={store} />}
        {tab==='earnings' && <EarningsTab store={store} />}
        {tab==='profile'  && <ProfileTab store={store} onLogout={onLogout} />}
      </div>
      <BottomNav active={tab} onChange={setTab} jobCount={availableCount} />
    </div>
  );
}
