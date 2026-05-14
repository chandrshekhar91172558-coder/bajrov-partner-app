import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Home, Briefcase, IndianRupee, User, Bell, MapPin, LogOut, X, Check, Star, ChevronRight, Clock, Zap, Camera } from 'lucide-react';
import type { useAppStore } from './store';
import { EXTRA_JOBS_POOL } from './store';
import type { Job, PaymentMethod } from './store';

type Tab = 'home' | 'jobs' | 'earnings' | 'profile';
type StoreType = ReturnType<typeof useAppStore>;
interface Props { store: StoreType; onLogout: () => void; }

const P = {
  orange:    '#FF8A00',
  orangeD:   '#E06000',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#7A94C1',
  green:     '#22C55E',
  greenGlow: 'rgba(34,197,94,0.4)',
  red:       '#EF4444',
  navBg:     '#020B1E',
  bg:        '#050D24',
};

const BG = 'linear-gradient(170deg,#050D24 0%,#071630 45%,#091E45 100%)';

const card = (glow = false): React.CSSProperties => ({
  background: glow ? 'rgba(255,138,0,0.08)' : 'rgba(255,255,255,0.04)',
  border: `1px solid ${glow ? 'rgba(255,138,0,0.28)' : 'rgba(255,255,255,0.09)'}`,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  boxShadow: glow
    ? '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(255,138,0,0.12)'
    : '0 4px 24px rgba(0,0,0,0.4)',
});

function playNotificationSound() {
  try {
    const ctx = new AudioContext();
    [880, 1100, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + i * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.35);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.4);
    });
  } catch {}
}

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

  const dismiss = () => { setVisible(false); setTimeout(onDismiss, 350); };
  const accept  = () => { setVisible(false); setTimeout(onAccept, 250); };

  return (
    <div style={{ position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:440,zIndex:999,padding:'8px 12px 0' }}>
      <div style={{ ...card(true),borderRadius:22,overflow:'hidden',transform:visible?'translateY(0)':'translateY(-115%)',transition:'transform 0.42s cubic-bezier(0.34,1.4,0.64,1)',opacity:visible?1:0 }}>
        {/* Header bar */}
        <div style={{ background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:8,height:8,borderRadius:4,background:'#fff',animation:'livePulse 1.5s infinite' }} />
            <span style={{ color:'#fff',fontWeight:800,fontSize:13,letterSpacing:0.3 }}>🔔 NEW JOB ALERT!</span>
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <span style={{ background:'rgba(0,0,0,0.22)',borderRadius:10,padding:'2px 10px',color:'#fff',fontSize:11,fontWeight:700 }}>{countdown}s</span>
            <button onClick={dismiss} style={{ background:'rgba(0,0,0,0.22)',border:'none',color:'#fff',width:24,height:24,borderRadius:12,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <X size={12}/>
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ padding:'16px 18px' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
            <div>
              <div style={{ fontSize:18,fontWeight:800,color:'#fff',marginBottom:6 }}>{job.customerName}</div>
              <span style={{ background:'rgba(255,138,0,0.15)',color:P.orange,borderRadius:8,padding:'4px 12px',fontSize:12,fontWeight:700,border:'1px solid rgba(255,138,0,0.3)' }}>{job.workType}</span>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:26,fontWeight:800,color:P.gold,lineHeight:1 }}>₹{job.dailyRate}</div>
              <div style={{ fontSize:11,color:P.textSec,marginTop:2 }}>per day</div>
            </div>
          </div>
          <div style={{ display:'flex',gap:16,marginBottom:14,color:P.textSec,fontSize:13 }}>
            <span style={{ display:'flex',alignItems:'center',gap:4 }}><MapPin size={13} color={P.orange}/>{job.location}</span>
            <span>📍 {job.distance} km</span>
          </div>
          {/* Timer bar */}
          <div style={{ height:3,background:'rgba(255,255,255,0.08)',borderRadius:2,marginBottom:14,overflow:'hidden' }}>
            <div style={{ height:'100%',background:`linear-gradient(90deg,${P.orange},${P.gold})`,borderRadius:2,width:`${(countdown/20)*100}%`,transition:'width 1s linear' }} />
          </div>
          <div style={{ display:'flex',gap:10 }}>
            <button onClick={accept} style={{ flex:1,padding:'14px 0',borderRadius:14,border:'none',background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',fontWeight:800,fontSize:15,cursor:'pointer',boxShadow:`0 4px 18px ${P.orangeGlow}` }}>✓ Accept Karo</button>
            <button onClick={dismiss} style={{ flex:0.5,padding:'14px 0',borderRadius:14,border:'1px solid rgba(255,255,255,0.12)',background:'rgba(255,255,255,0.04)',color:P.textSec,fontWeight:600,fontSize:14,cursor:'pointer' }}>Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange, jobCount }: { active: Tab; onChange: (t: Tab) => void; jobCount: number }) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id:'home',     icon:<Home size={22}/>,        label:'Home' },
    { id:'jobs',     icon:<Briefcase size={22}/>,   label:'Jobs' },
    { id:'earnings', icon:<IndianRupee size={22}/>, label:'Earnings' },
    { id:'profile',  icon:<User size={22}/>,        label:'Profile' },
  ];
  return (
    <div style={{ position:'fixed',bottom:0,left:'50%',transform:'translateX(-50%)',width:'100%',maxWidth:440,background:P.navBg,borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',zIndex:100,paddingBottom:'env(safe-area-inset-bottom,0px)',boxShadow:'0 -4px 32px rgba(0,0,0,0.7)' }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{ flex:1,padding:'12px 0 10px',border:'none',background:'transparent',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:4,color:isActive?P.orange:'rgba(255,255,255,0.35)',position:'relative',transition:'color 0.2s',WebkitTapHighlightColor:'transparent' }}>
            {/* Active top indicator */}
            {isActive && (
              <div style={{ position:'absolute',top:0,left:'50%',transform:'translateX(-50%)',width:28,height:2.5,borderRadius:2,background:P.orange,boxShadow:`0 0 8px ${P.orangeGlow}` }} />
            )}
            <div style={{ position:'relative',transition:'transform 0.2s',transform:isActive?'translateY(-1px)':'none' }}>
              {t.icon}
              {t.id==='home' && jobCount > 0 && (
                <div style={{ position:'absolute',top:-5,right:-8,background:'#EF4444',borderRadius:8,minWidth:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,color:'#fff',padding:'0 4px',boxShadow:'0 2px 6px rgba(239,68,68,0.5)' }}>{jobCount}</div>
              )}
            </div>
            <span style={{ fontSize:10,fontWeight:isActive?700:500,letterSpacing:0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function JobCard({ job, onAccept, onReject }: { job: Job; onAccept: () => void; onReject: () => void }) {
  const isNew = job.postedAgo === 'Abhi abhi';
  return (
    <div style={{ ...card(isNew),borderRadius:20,padding:'16px 18px',marginBottom:12,position:'relative',overflow:'hidden',WebkitTapHighlightColor:'transparent' }}>
      {isNew && (
        <>
          <div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${P.orange},transparent)` }} />
          <div style={{ position:'absolute',top:12,right:14,background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,borderRadius:8,padding:'2px 10px',fontSize:10,fontWeight:800,color:'#fff' }}>NEW</div>
        </>
      )}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10,paddingRight:isNew?52:0 }}>
        <span style={{ background:'rgba(255,138,0,0.12)',color:P.orange,borderRadius:8,padding:'5px 12px',fontSize:12,fontWeight:700,border:'1px solid rgba(255,138,0,0.25)' }}>{job.workType}</span>
        <span style={{ color:P.gold,fontWeight:800,fontSize:21 }}>₹{job.dailyRate}<span style={{ fontSize:11,color:P.textSec,fontWeight:500 }}>/day</span></span>
      </div>
      <div style={{ fontSize:16,fontWeight:700,marginBottom:8,color:'#fff' }}>{job.customerName}</div>
      <div style={{ display:'flex',gap:16,marginBottom:14,color:P.textSec,fontSize:13,flexWrap:'wrap' }}>
        <span style={{ display:'flex',alignItems:'center',gap:4 }}><MapPin size={13} color={P.orange}/>{job.location}</span>
        <span style={{ display:'flex',alignItems:'center',gap:4 }}><Clock size={12}/>{job.postedAgo}</span>
        <span>📍 {job.distance} km</span>
      </div>
      <div style={{ display:'flex',gap:10 }}>
        <button onClick={onAccept} style={{ flex:1,padding:'13px 0',borderRadius:12,border:'none',background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',fontWeight:700,fontSize:14,cursor:'pointer',boxShadow:`0 4px 16px ${P.orangeGlow}` }}>✓ Accept</button>
        <button onClick={onReject} style={{ flex:0.5,padding:'13px 0',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:P.textSec,fontWeight:600,fontSize:14,cursor:'pointer' }}>Skip</button>
      </div>
    </div>
  );
}

function StatusToggle({ isOnline, onToggle }: { isOnline: boolean; onToggle: () => void }) {
  const [toast, setToast] = useState<string|null>(null);
  const [pressing, setPressing] = useState(false);
  const handle = () => {
    onToggle();
    setToast(isOnline ? 'You are now offline' : 'You are now visible to clients! 🎉');
    setTimeout(() => setToast(null), 2800);
  };
  return (
    <div style={{ marginBottom:18,position:'relative' }}>
      {/* Toast */}
      <div style={{ position:'absolute',top:-46,left:0,right:0,display:'flex',justifyContent:'center',pointerEvents:'none',zIndex:10,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(-8px)',transition:'all 0.28s' }}>
        <div style={{ background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',backdropFilter:'blur(16px)',borderRadius:20,padding:'7px 18px',fontSize:12,fontWeight:600,color:'#fff',whiteSpace:'nowrap',boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      </div>
      {/* Toggle card */}
      <div onClick={handle} onMouseDown={()=>setPressing(true)} onMouseUp={()=>setPressing(false)}
        style={{ ...card(),borderRadius:18,padding:'16px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',border:`1px solid ${isOnline?'rgba(34,197,94,0.28)':'rgba(255,255,255,0.09)'}`,transition:'all 0.25s',transform:pressing?'scale(0.98)':'scale(1)',WebkitTapHighlightColor:'transparent' }}>
        <div style={{ display:'flex',alignItems:'center',gap:14 }}>
          <div style={{ width:44,height:44,borderRadius:22,background:isOnline?'rgba(34,197,94,0.12)':'rgba(255,255,255,0.05)',border:`1px solid ${isOnline?'rgba(34,197,94,0.3)':'rgba(255,255,255,0.1)'}`,display:'flex',alignItems:'center',justifyContent:'center',transition:'all 0.25s' }}>
            <div style={{ width:12,height:12,borderRadius:6,background:isOnline?P.green:'#475569',animation:isOnline?'livePulse 2s infinite':'none',transition:'background 0.25s' }} />
          </div>
          <div>
            <div style={{ fontSize:14,fontWeight:700,color:isOnline?'#fff':'#64748b',transition:'color 0.25s' }}>{isOnline?'Available for Work':'Currently Offline'}</div>
            <div style={{ fontSize:12,color:isOnline?'#86efac':'#475569',marginTop:2,transition:'color 0.25s' }}>{isOnline?'Receiving new job requests':'Not accepting new jobs'}</div>
          </div>
        </div>
        {/* Toggle switch */}
        <div style={{ width:56,height:30,borderRadius:15,background:isOnline?`linear-gradient(135deg,${P.green},#16a34a)`:'rgba(255,255,255,0.08)',border:`1.5px solid ${isOnline?'rgba(34,197,94,0.5)':'rgba(255,255,255,0.12)'}`,position:'relative',transition:'all 0.32s',boxShadow:isOnline?`0 0 18px ${P.greenGlow}`:'none',flexShrink:0 }}>
          <div style={{ position:'absolute',top:4,left:isOnline?28:4,width:20,height:20,borderRadius:10,background:'#fff',boxShadow:'0 2px 8px rgba(0,0,0,0.35)',transition:'left 0.28s cubic-bezier(0.34,1.4,0.64,1)' }} />
        </div>
      </div>
    </div>
  );
}

function EarningsCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ flex:1,...card(),borderRadius:16,padding:'14px 12px',textAlign:'center' }}>
      <div style={{ fontSize:18,fontWeight:800,color:color??'#fff',marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:11,color:P.textSec,fontWeight:500 }}>{label}</div>
      {sub && <div style={{ fontSize:10,color:P.textSec,marginTop:2,opacity:0.7 }}>{sub}</div>}
    </div>
  );
}

function HomeTab({ store, notification, onClearNotification }: { store: StoreType; notification: Job|null; onClearNotification: () => void }) {
  const paidEarnings  = store.earnings.filter(e => e.status === 'paid');
  const todayTotal    = store.earnings.slice(0,1).reduce((s,e) => s+e.amount, 0);
  const weekTotal     = paidEarnings.reduce((s,e) => s+e.amount, 0);
  const availableJobs = store.jobs.filter(j => j.status === 'available');
  const acceptedJobs  = store.jobs.filter(j => ['accepted','started','on-break'].includes(j.status));

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div style={{ padding:'16px 16px 0' }}>
      {notification && (
        <JobNotification job={notification}
          onAccept={() => { store.acceptJob(notification.id); onClearNotification(); }}
          onDismiss={onClearNotification} />
      )}

      {/* Header */}
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
        <div style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:46,height:46,borderRadius:23,background:'rgba(255,138,0,0.12)',border:`2px solid rgba(255,138,0,0.4)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px rgba(255,138,0,0.2)' }}>
            <User size={22} color={P.orange}/>
          </div>
          <div>
            <div style={{ fontSize:12,color:P.textSec,fontWeight:500 }}>{greet} 👷</div>
            <div style={{ fontSize:17,fontWeight:700,color:'#fff',letterSpacing:-0.3 }}>{store.profile?.name||'Worker'}</div>
          </div>
        </div>
        <div style={{ width:42,height:42,borderRadius:21,...card(),display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Bell size={18} color={P.textSec}/>
        </div>
      </div>

      {/* Status toggle */}
      <StatusToggle isOnline={store.isOnline} onToggle={store.toggleOnline} />

      {/* Earnings banner */}
      <div style={{ background:'linear-gradient(135deg,rgba(255,138,0,0.18) 0%,rgba(255,138,0,0.06) 100%)',borderRadius:22,padding:'20px 20px',marginBottom:18,border:'1px solid rgba(255,138,0,0.3)',boxShadow:'0 8px 32px rgba(0,0,0,0.4), 0 0 24px rgba(255,138,0,0.08)',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:-40,right:-40,width:160,height:160,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,193,7,0.12) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ fontSize:12,color:P.textSec,fontWeight:500,marginBottom:4 }}>Today's Earnings</div>
        <div style={{ fontSize:42,fontWeight:800,color:P.gold,marginBottom:18,letterSpacing:-1,textShadow:`0 0 24px rgba(255,193,7,0.4)` }}>
          ₹{todayTotal.toLocaleString('en-IN')}
        </div>
        <div style={{ display:'flex',gap:0 }}>
          <div style={{ flex:1,borderRight:'1px solid rgba(255,255,255,0.1)',paddingRight:16 }}>
            <div style={{ fontSize:11,color:P.textSec,marginBottom:2 }}>This Week</div>
            <div style={{ fontSize:18,fontWeight:700,color:'#fff' }}>₹{weekTotal.toLocaleString('en-IN')}</div>
          </div>
          <div style={{ flex:1,paddingLeft:16 }}>
            <div style={{ fontSize:11,color:P.textSec,marginBottom:2 }}>Completed</div>
            <div style={{ fontSize:18,fontWeight:700,color:'#fff' }}>{paidEarnings.length} jobs</div>
          </div>
        </div>
      </div>

      {/* Active job alert */}
      {acceptedJobs.length > 0 && (
        <div style={{ ...card(),borderRadius:18,padding:'14px 16px',marginBottom:18,border:'1px solid rgba(34,197,94,0.25)',display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:10,height:10,borderRadius:5,background:P.green,animation:'livePulse 2s infinite',flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:700,fontSize:14,color:'#fff' }}>{acceptedJobs[0].customerName}</div>
            <div style={{ color:P.textSec,fontSize:12,marginTop:2 }}>{acceptedJobs[0].workType} · {acceptedJobs[0].location}</div>
          </div>
          <div style={{ fontSize:12,color:P.green,fontWeight:600 }}>
            {acceptedJobs[0].status==='accepted'?'Ready to Start':'In Progress'}
          </div>
        </div>
      )}

      {/* Nearby jobs */}
      <div style={{ marginBottom:8 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <Zap size={16} color={P.orange}/>
            <span style={{ fontSize:15,fontWeight:700,color:'#fff' }}>Nearby Jobs</span>
          </div>
          {availableJobs.length > 0 && (
            <span style={{ background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',borderRadius:10,padding:'3px 12px',fontSize:12,fontWeight:800,boxShadow:`0 2px 10px ${P.orangeGlow}` }}>{availableJobs.length}</span>
          )}
        </div>
        {availableJobs.length === 0 ? (
          <div style={{ textAlign:'center',padding:'48px 20px',...card(),borderRadius:20 }}>
            <Briefcase size={44} color="rgba(255,255,255,0.12)" style={{ marginBottom:12 }}/>
            <div style={{ fontWeight:600,color:'rgba(255,255,255,0.3)',fontSize:14 }}>No jobs available right now</div>
            <div style={{ fontSize:12,marginTop:6,color:'rgba(255,255,255,0.18)' }}>Stay online — new jobs will appear shortly</div>
          </div>
        ) : availableJobs.map(job => (
          <JobCard key={job.id} job={job} onAccept={()=>store.acceptJob(job.id)} onReject={()=>store.rejectJob(job.id)} />
        ))}
      </div>
    </div>
  );
}

function WorkFlowTracker({ job, store }: { job: Job; store: StoreType }) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod|null>(null);
  const [rating, setRating] = useState(0);
  const payMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    {id:'cash',label:'Cash',icon:'💵'},{id:'upi',label:'UPI',icon:'📱'},
    {id:'phonepe',label:'PhonePe',icon:'🟣'},{id:'googlepay',label:'GPay',icon:'🔵'},{id:'paytm',label:'Paytm',icon:'🔷'},
  ];

  if (job.rating) return (
    <div style={{ ...card(),borderRadius:18,padding:16,border:'1px solid rgba(34,197,94,0.22)',marginBottom:12 }}>
      <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>✅ Job Complete!</div>
      <div style={{ color:P.textSec,fontSize:13 }}>{job.customerName} · ₹{job.dailyRate}</div>
      <div style={{ color:P.gold,fontSize:16,marginTop:8,letterSpacing:2 }}>{'⭐'.repeat(job.rating)}</div>
    </div>
  );

  if (job.paymentStatus === 'paid' && !job.rating) return (
    <div style={{ ...card(),borderRadius:18,padding:16,border:'1px solid rgba(34,197,94,0.22)',marginBottom:12 }}>
      <div style={{ fontWeight:700,fontSize:15,marginBottom:4 }}>💰 Payment Done! Rate Your Client</div>
      <div style={{ color:P.textSec,fontSize:13,marginBottom:14 }}>{job.customerName} · ₹{job.dailyRate} via {job.paymentMethod}</div>
      <div style={{ display:'flex',gap:6,marginBottom:14 }}>
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={()=>setRating(s)} style={{ fontSize:32,border:'none',background:'transparent',cursor:'pointer',filter:s<=rating?'none':'grayscale(1) opacity(0.35)',transition:'filter 0.15s' }}>⭐</button>
        ))}
      </div>
      <button onClick={()=>store.addRating(job.id,rating)} disabled={!rating}
        style={{ width:'100%',padding:13,borderRadius:12,border:'none',background:rating?`linear-gradient(135deg,${P.gold},#E8A800)`:'rgba(255,255,255,0.05)',color:rating?'#1A1A1A':'#3A5080',fontWeight:700,cursor:rating?'pointer':'not-allowed',transition:'all 0.2s' }}>
        Submit Rating
      </button>
    </div>
  );

  if (job.status === 'completed' && job.paymentStatus !== 'paid') return (
    <div style={{ ...card(),borderRadius:18,padding:16,marginBottom:12 }}>
      <div style={{ fontSize:15,fontWeight:700,marginBottom:4 }}>💰 Collect Payment</div>
      <div style={{ color:P.gold,fontSize:26,fontWeight:800,marginBottom:14 }}>₹{job.dailyRate}</div>
      {!showPayment ? (
        <button onClick={()=>setShowPayment(true)} style={{ width:'100%',padding:13,borderRadius:12,border:'none',background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',fontWeight:700,cursor:'pointer',boxShadow:`0 4px 16px ${P.orangeGlow}` }}>
          Choose Payment Method
        </button>
      ) : (
        <>
          <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:12 }}>
            {payMethods.map(m => (
              <button key={m.id} onClick={()=>setSelectedMethod(m.id)}
                style={{ padding:'9px 13px',borderRadius:10,border:`2px solid ${selectedMethod===m.id?P.orange:'rgba(255,255,255,0.1)'}`,background:selectedMethod===m.id?'rgba(255,138,0,0.15)':'rgba(255,255,255,0.04)',color:'#fff',cursor:'pointer',fontSize:13,fontWeight:600,transition:'all 0.18s' }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <button onClick={()=>{ if(selectedMethod) store.markPaid(job.id,selectedMethod); }} disabled={!selectedMethod}
            style={{ width:'100%',padding:13,borderRadius:12,border:'none',background:selectedMethod?P.green:'rgba(255,255,255,0.05)',color:selectedMethod?'#fff':'#3A5080',fontWeight:700,cursor:selectedMethod?'pointer':'not-allowed',transition:'all 0.2s' }}>
            ✅ Payment Received
          </button>
        </>
      )}
    </div>
  );

  const steps = [
    { label:'Job Accepted',   done:true,          time:undefined as string|undefined },
    { label:'Work Started',   done:!!job.startTime, time:job.startTime, action:job.status==='accepted'?()=>store.startWork(job.id):undefined, actionLabel:'▶ Start Work' },
    { label:'Lunch Break',    done:!!job.lunchStart, time:job.lunchStart, action:job.status==='started'&&!job.lunchStart?()=>store.startLunch(job.id):undefined, actionLabel:'☕ Take Lunch Break' },
    { label:'Resumed',        done:!!job.lunchEnd, time:job.lunchEnd, action:job.status==='on-break'?()=>store.resumeWork(job.id):undefined, actionLabel:'▶ Resume Work' },
    { label:'Work Complete',  done:!!job.endTime, time:job.endTime, action:job.status==='started'&&job.startTime?()=>store.completeWork(job.id):undefined, actionLabel:'🏁 Mark Complete' },
  ];

  return (
    <div style={{ ...card(true),borderRadius:20,padding:'16px 18px',marginBottom:14 }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16 }}>
        <div>
          <div style={{ fontWeight:800,fontSize:16,color:'#fff' }}>{job.customerName}</div>
          <div style={{ color:P.textSec,fontSize:13,marginTop:3 }}>{job.workType} · {job.location}</div>
        </div>
        <div style={{ color:P.gold,fontWeight:800,fontSize:22 }}>₹{job.dailyRate}</div>
      </div>
      <div style={{ position:'relative',paddingLeft:24 }}>
        <div style={{ position:'absolute',left:8,top:8,bottom:8,width:2,background:'rgba(255,138,0,0.15)',borderRadius:1 }} />
        {steps.map((step, i) => (
          <div key={i} style={{ display:'flex',alignItems:'flex-start',gap:14,marginBottom:16,position:'relative' }}>
            <div style={{ width:14,height:14,borderRadius:7,border:`2px solid ${step.done?P.orange:'rgba(255,255,255,0.14)'}`,background:step.done?P.orange:'transparent',flexShrink:0,marginTop:2,zIndex:1,boxShadow:step.done?`0 0 10px ${P.orangeGlow}`:'none',display:'flex',alignItems:'center',justifyContent:'center' }}>
              {step.done && <Check size={8} color="#fff" strokeWidth={3}/>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13,fontWeight:600,color:step.done?'#fff':'rgba(255,255,255,0.28)' }}>{step.label}</div>
              {step.time && <div style={{ fontSize:11,color:P.textSec,marginTop:2 }}>🕐 {step.time}</div>}
              {step.action && (
                <button onClick={step.action} style={{ marginTop:8,padding:'10px 18px',borderRadius:10,border:'none',background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',fontWeight:700,fontSize:13,cursor:'pointer',boxShadow:`0 4px 14px ${P.orangeGlow}` }}>
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

function JobsTab({ store }: { store: StoreType }) {
  const [tab, setTab] = useState<'active'|'completed'>('active');
  const activeJobs    = store.jobs.filter(j => ['accepted','started','on-break','completed'].includes(j.status));
  const completedJobs = store.jobs.filter(j => j.status === 'completed');
  return (
    <div style={{ padding:'16px 16px 0' }}>
      <div style={{ fontSize:22,fontWeight:800,marginBottom:18,letterSpacing:-0.5 }}>My Jobs</div>
      <div style={{ display:'flex',gap:0,...card(),borderRadius:16,padding:4,marginBottom:22 }}>
        {(['active','completed'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:'11px 0',borderRadius:13,border:'none',background:tab===t?`linear-gradient(135deg,${P.orange},${P.orangeD})`:'transparent',color:tab===t?'#fff':P.textSec,fontWeight:700,cursor:'pointer',fontSize:14,boxShadow:tab===t?`0 2px 12px ${P.orangeGlow}`:'none',transition:'all 0.22s',WebkitTapHighlightColor:'transparent' }}>
            {t==='active'?`Active (${activeJobs.length})`:`Done (${completedJobs.length})`}
          </button>
        ))}
      </div>
      {tab==='active' && (
        activeJobs.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 20px',...card(),borderRadius:22 }}>
            <Briefcase size={48} color="rgba(255,255,255,0.1)" style={{ marginBottom:14 }}/>
            <div style={{ color:'rgba(255,255,255,0.25)',fontWeight:600 }}>No active jobs right now</div>
            <div style={{ fontSize:13,marginTop:8,color:'rgba(255,255,255,0.15)' }}>Go to Home tab to accept new jobs</div>
          </div>
        ) : activeJobs.map(job => <WorkFlowTracker key={job.id} job={job} store={store} />)
      )}
      {tab==='completed' && (
        completedJobs.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 20px',...card(),borderRadius:22 }}>
            <div style={{ fontSize:48,marginBottom:14 }}>🏁</div>
            <div style={{ color:'rgba(255,255,255,0.25)',fontWeight:600 }}>No completed jobs yet</div>
          </div>
        ) : completedJobs.map(job => (
          <div key={job.id} style={{ ...card(),borderRadius:18,padding:'16px 18px',marginBottom:12 }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
              <div>
                <div style={{ fontWeight:700,fontSize:15,color:'#fff',marginBottom:4 }}>{job.customerName}</div>
                <div style={{ color:P.textSec,fontSize:13 }}>{job.workType}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:P.gold,fontWeight:800,fontSize:18 }}>₹{job.dailyRate}</div>
                <div style={{ fontSize:11,color:job.paymentStatus==='paid'?P.green:P.orange,marginTop:3,fontWeight:600 }}>
                  {job.paymentStatus==='paid'?'✓ Paid':'⏳ Pending'}
                </div>
              </div>
            </div>
            {job.rating && <div style={{ color:P.gold,fontSize:15,marginTop:10,letterSpacing:2 }}>{'⭐'.repeat(job.rating)}</div>}
          </div>
        ))
      )}
    </div>
  );
}

function EarningsTab({ store }: { store: StoreType }) {
  const paid    = store.earnings.filter(e => e.status === 'paid');
  const pending = store.earnings.filter(e => e.status === 'pending');
  const total   = paid.reduce((s,e) => s+e.amount, 0);
  const pendingTotal = pending.reduce((s,e) => s+e.amount, 0);
  const chartData = [40,60,80,45,100,70,55];
  const days = ['M','T','W','T','F','S','S'];
  const maxH = Math.max(...chartData);
  return (
    <div style={{ padding:'16px 16px 0' }}>
      <div style={{ fontSize:22,fontWeight:800,marginBottom:20,letterSpacing:-0.5 }}>My Earnings</div>

      {/* Total card */}
      <div style={{ background:'linear-gradient(135deg,rgba(255,193,7,0.16) 0%,rgba(255,138,0,0.08) 100%)',borderRadius:24,padding:'24px 22px',marginBottom:16,border:'1px solid rgba(255,193,7,0.25)',textAlign:'center',position:'relative',overflow:'hidden',boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
        <div style={{ position:'absolute',top:-50,right:-50,width:180,height:180,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,193,7,0.15) 0%,transparent 70%)',pointerEvents:'none' }} />
        <div style={{ fontSize:11,color:P.textSec,fontWeight:700,marginBottom:8,letterSpacing:1.5 }}>TOTAL EARNED</div>
        <div style={{ fontSize:48,fontWeight:800,color:P.gold,letterSpacing:-1.5,textShadow:`0 0 28px rgba(255,193,7,0.45)` }}>
          ₹{total.toLocaleString('en-IN')}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display:'flex',gap:10,marginBottom:18 }}>
        <EarningsCard label="Completed" value={paid.length.toString()} color={P.green} />
        <EarningsCard label="Pending" value={`₹${pendingTotal.toLocaleString('en-IN')}`} color={P.orange} />
        <EarningsCard label="Rating" value="4.8" sub="⭐⭐⭐⭐⭐" color={P.gold} />
      </div>

      {/* Bar chart */}
      <div style={{ ...card(),borderRadius:20,padding:'18px 18px',marginBottom:18 }}>
        <div style={{ fontWeight:700,marginBottom:16,fontSize:14,color:'#fff' }}>This Week</div>
        <div style={{ display:'flex',alignItems:'flex-end',gap:6,height:90 }}>
          {chartData.map((h,i) => (
            <div key={i} style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
              <div style={{ width:'100%',background:`linear-gradient(to top,${P.orange},${P.gold})`,borderRadius:'4px 4px 0 0',height:`${(h/maxH)*68}px`,boxShadow:`0 0 8px ${P.orangeGlow}`,opacity:i===6?1:0.7+i*0.05 }} />
              <span style={{ fontSize:10,color:P.textSec,fontWeight:500 }}>{days[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ fontWeight:700,marginBottom:12,fontSize:15,color:'#fff' }}>Recent Transactions</div>
      {store.earnings.length === 0 ? (
        <div style={{ textAlign:'center',padding:'40px 20px',color:'rgba(255,255,255,0.2)' }}>No transactions yet</div>
      ) : store.earnings.map(e => (
        <div key={e.id} style={{ ...card(),borderRadius:16,padding:'14px 16px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ display:'flex',alignItems:'center',gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:20,background:e.status==='paid'?'rgba(34,197,94,0.12)':'rgba(255,138,0,0.12)',display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${e.status==='paid'?'rgba(34,197,94,0.25)':'rgba(255,138,0,0.25)'}` }}>
              <IndianRupee size={16} color={e.status==='paid'?P.green:P.orange}/>
            </div>
            <div>
              <div style={{ fontWeight:600,fontSize:14,color:'#fff' }}>{e.customerName}</div>
              <div style={{ color:P.textSec,fontSize:12,marginTop:2 }}>{e.workType} · {e.date}</div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:800,fontSize:16,color:e.status==='paid'?P.green:P.orange }}>{e.status==='paid'?'+':''}₹{e.amount}</div>
            <div style={{ fontSize:11,color:e.status==='paid'?P.green:P.orange,marginTop:2,fontWeight:600 }}>{e.status==='paid'?'Paid':'Pending'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileTab({ store, onLogout }: { store: StoreType; onLogout: () => void }) {
  const [editing, setEditing] = useState(false);
  const [name,  setName]   = useState(store.profile?.name ?? '');
  const [city,  setCity]   = useState(store.profile?.city ?? '');
  const [charge,setCharge] = useState(String(store.profile?.dailyCharge ?? ''));
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const completed = store.jobs.filter(j => j.status==='completed').length;

  const save = () => {
    if (store.profile) store.saveProfile({ ...store.profile, name, city, dailyCharge: Number(charge) });
    setEditing(false);
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !store.profile) return;
    setPhotoLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      store.saveProfile({ ...store.profile!, photoUrl: dataUrl });
      setPhotoLoading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const inputStyle: React.CSSProperties = {
    width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.07)',border:'1.5px solid rgba(255,255,255,0.14)',borderRadius:12,padding:'13px 14px',color:'#fff',fontSize:14,outline:'none',fontFamily:'inherit',
  };

  return (
    <div style={{ padding:'16px 16px 0' }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display:'none' }}
        onChange={handlePhotoChange}
      />

      {/* Avatar */}
      <div style={{ textAlign:'center',marginBottom:24 }}>
        <div style={{ position:'relative',display:'inline-block',marginBottom:14 }}>
          {/* Pulse ring */}
          <div className="live-pulse" style={{ position:'absolute',inset:-6,borderRadius:'50%',border:`1.5px solid rgba(255,138,0,0.28)`,zIndex:0 }} />

          {/* Avatar circle — tappable */}
          <button
            onClick={handlePhotoClick}
            style={{ width:90,height:90,borderRadius:45,border:`3px solid ${P.orange}`,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,138,0,0.1)',boxShadow:`0 0 28px ${P.orangeGlow}, 0 0 0 6px rgba(255,138,0,0.08)`,cursor:'pointer',padding:0,position:'relative',zIndex:1,WebkitTapHighlightColor:'transparent' }}
          >
            {photoLoading ? (
              <div style={{ width:30,height:30,borderRadius:15,border:`3px solid ${P.orange}`,borderTopColor:'transparent',animation:'spin 0.7s linear infinite' }} />
            ) : store.profile?.photoUrl ? (
              <img src={store.profile.photoUrl} alt="Profile" style={{ width:'100%',height:'100%',objectFit:'cover' }} />
            ) : (
              <User size={38} color={P.orange}/>
            )}
          </button>

          {/* Camera badge */}
          <button
            onClick={handlePhotoClick}
            style={{ position:'absolute',bottom:2,right:2,zIndex:2,width:28,height:28,borderRadius:14,background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,border:`2px solid #050D24`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',boxShadow:`0 2px 8px ${P.orangeGlow}`,WebkitTapHighlightColor:'transparent' }}
          >
            <Camera size={13} color="#fff" strokeWidth={2.5}/>
          </button>
        </div>

        <div style={{ fontSize:22,fontWeight:800,color:'#fff',marginBottom:4 }}>{store.profile?.name}</div>
        <div style={{ color:P.textSec,fontSize:13 }}>📞 +91 {store.phone}</div>
        <div style={{ display:'inline-block',background:'rgba(255,138,0,0.12)',color:P.orange,borderRadius:10,padding:'5px 16px',fontSize:12,fontWeight:700,marginTop:10,border:'1px solid rgba(255,138,0,0.25)' }}>
          {store.profile?.workerType==='mistri'?'🏗️ Tile Expert':'🔨 Labour Partner'}
        </div>

        {/* Change photo hint */}
        <div style={{ marginTop:8,fontSize:11,color:'rgba(255,138,0,0.6)',fontWeight:600,letterSpacing:0.3 }}>
          Tap photo to change
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex',gap:10,marginBottom:22 }}>
        {[
          { label:'Jobs Done',  value:completed.toString(),          color:P.green },
          { label:'Rating',     value:'4.8 ⭐',                      color:P.gold },
          { label:'Daily Rate', value:`₹${store.profile?.dailyCharge||0}`, color:P.orange },
        ].map(s => (
          <div key={s.label} style={{ flex:1,...card(),borderRadius:16,padding:'14px 10px',textAlign:'center' }}>
            <div style={{ fontSize:16,fontWeight:800,color:s.color,marginBottom:4 }}>{s.value}</div>
            <div style={{ fontSize:10,color:P.textSec }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div style={{ ...card(),borderRadius:20,padding:'18px 18px',marginBottom:14 }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16 }}>
          <div style={{ fontWeight:700,fontSize:15,color:'#fff' }}>Profile Info</div>
          {!editing && (
            <button onClick={()=>setEditing(true)} style={{ background:'rgba(255,138,0,0.12)',border:'1px solid rgba(255,138,0,0.25)',color:P.orange,borderRadius:10,padding:'6px 14px',fontSize:12,fontWeight:700,cursor:'pointer' }}>Edit</button>
          )}
        </div>
        {editing ? (
          <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
            <div>
              <div style={{ fontSize:11,color:P.textSec,fontWeight:600,marginBottom:6,letterSpacing:0.5 }}>NAME</div>
              <input value={name} onChange={e=>setName(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:11,color:P.textSec,fontWeight:600,marginBottom:6,letterSpacing:0.5 }}>CITY</div>
              <input value={city} onChange={e=>setCity(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:11,color:P.textSec,fontWeight:600,marginBottom:6,letterSpacing:0.5 }}>DAILY CHARGE (₹)</div>
              <input value={charge} onChange={e=>setCharge(e.target.value.replace(/\D/g,''))} type="tel" style={inputStyle} />
            </div>
            <div style={{ display:'flex',gap:10,marginTop:4 }}>
              <button onClick={save} style={{ flex:1,padding:'13px',borderRadius:12,border:'none',background:`linear-gradient(135deg,${P.orange},${P.orangeD})`,color:'#fff',fontWeight:700,cursor:'pointer',boxShadow:`0 4px 16px ${P.orangeGlow}` }}>Save</button>
              <button onClick={()=>setEditing(false)} style={{ flex:0.6,padding:'13px',borderRadius:12,border:'1px solid rgba(255,255,255,0.1)',background:'rgba(255,255,255,0.04)',color:P.textSec,fontWeight:600,cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {[
              { label:'Name',       value:store.profile?.name||'—' },
              { label:'City',       value:store.profile?.city||'—' },
              { label:'Experience', value:store.profile?.experience||'—' },
              { label:'Daily Charge',value:`₹${store.profile?.dailyCharge||0}` },
            ].map(r => (
              <div key={r.label} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize:13,color:P.textSec,fontWeight:500 }}>{r.label}</span>
                <span style={{ fontSize:14,color:'#fff',fontWeight:600 }}>{r.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button onClick={onLogout} style={{ width:'100%',padding:'15px',borderRadius:16,border:'1.5px solid rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.07)',color:'#EF4444',fontWeight:700,cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:32,WebkitTapHighlightColor:'transparent' }}>
        <LogOut size={16}/> Logout
      </button>
    </div>
  );
}

export function MainApp({ store, onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('home');
  const [notification, setNotification] = useState<Job|null>(null);
  const availableJobs = store.jobs.filter(j => j.status === 'available');

  const scheduleNotification = useCallback(() => {
    const pool = EXTRA_JOBS_POOL.filter(j => store.jobs.every(sj => sj.id !== j.id));
    if (pool.length === 0 || !store.isOnline) return;
    const job = pool[Math.floor(Math.random() * pool.length)];
    playNotificationSound();
    store.addJobFromPool(job);
    setNotification(job);
  }, [store]);

  useEffect(() => {
    if (!store.isOnline) return;
    const delay = 8000 + Math.random() * 10000;
    const t = setTimeout(scheduleNotification, delay);
    return () => clearTimeout(t);
  }, [store.isOnline, scheduleNotification, notification]);

  const tabs: Record<Tab, React.ReactNode> = {
    home:     <HomeTab store={store} notification={notification} onClearNotification={()=>setNotification(null)} />,
    jobs:     <JobsTab store={store} />,
    earnings: <EarningsTab store={store} />,
    profile:  <ProfileTab store={store} onLogout={onLogout} />,
  };

  return (
    <div style={{ width:'100%',height:'100dvh',background:BG,display:'flex',flexDirection:'column',overflow:'hidden',position:'relative',maxWidth:440,margin:'0 auto' }}>
      {/* Dot bg */}
      <div style={{ position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)',backgroundSize:'28px 28px',pointerEvents:'none',zIndex:0 }} />

      {/* Scroll area */}
      <div style={{ flex:1,overflowY:'auto',overflowX:'hidden',paddingTop:12,paddingBottom:80,position:'relative',zIndex:1 }}>
        {tabs[tab]}
      </div>

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab} jobCount={availableJobs.length} />

      <style>{`
        @keyframes livePulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          60%  { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
