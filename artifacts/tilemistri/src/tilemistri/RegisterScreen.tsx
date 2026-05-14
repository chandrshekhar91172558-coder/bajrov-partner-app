import React, { useState, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, Camera, MapPin, Minus, Plus } from 'lucide-react';
import { REGISTER_SKILLS, isPhoneRegistered, type Skill, type WorkerType, type UserProfile } from './store';

const C = {
  bg:        '#071B5A',
  bgGrad:    'linear-gradient(160deg, #040F35 0%, #071B5A 50%, #0A2070 100%)',
  orange:    '#FF8A00',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#8BA5D4',
  cardBorder:'rgba(255,138,0,0.22)',
  red:       '#ef4444',
};

const glass = (error?: boolean) => ({
  background: 'rgba(10,28,90,0.7)',
  border: `1.5px solid ${error ? C.red : C.cardBorder}`,
  backdropFilter: 'blur(8px)',
});

const inputStyle = (error?: boolean): React.CSSProperties => ({
  width: '100%', boxSizing: 'border-box',
  ...glass(error),
  borderRadius: 13, padding: '14px 16px',
  color: '#fff', fontSize: 15, outline: 'none',
  fontFamily: 'inherit',
});

const labelStyle: React.CSSProperties = {
  fontSize: 11, color: C.textSec, fontWeight: 700,
  display: 'block', marginBottom: 7, letterSpacing: 0.6,
};

export interface RegisterFormData {
  name: string;
  phone: string;
  password: string;
  city: string;
  workerType: WorkerType;
  skills: Skill[];
  experience: number;
  dailyCharge: string;
  workRadius: number;
}

interface Props {
  onSubmit: (data: RegisterFormData, profile: UserProfile) => void;
  onBack: () => void;
}

export function RegisterScreen({ onSubmit, onBack }: Props) {
  const [step, setStep] = useState(1);

  // Step 1
  const [name,    setName]    = useState('');
  const [phone,   setPhone]   = useState('');
  const [pass,    setPass]    = useState('');
  const [confirm, setConfirm] = useState('');
  const [city,    setCity]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const photoRef = useRef<HTMLInputElement>(null);

  // Step 2
  const [workerType,  setWorkerType]  = useState<WorkerType>('mistri');
  const [skills,      setSkills]      = useState<Skill[]>([]);
  const [experience,  setExperience]  = useState(1);
  const [dailyCharge, setDailyCharge] = useState('');
  const [workRadius,  setWorkRadius]  = useState(10);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const err = (field: string, msg: string) => setErrors(p => ({ ...p, [field]: msg }));
  const clearErr = (field: string) => setErrors(p => { const n = { ...p }; delete n[field]; return n; });

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!name.trim())             e.name    = 'Naam zaroori hai';
    if (phone.length !== 10 || isNaN(Number(phone))) e.phone = '10 digit ka mobile number daalo';
    else if (isPhoneRegistered(phone)) e.phone = 'Yeh number pehle se registered hai. Login karo.';
    if (pass.length < 6)          e.pass    = 'Password kam se kam 6 characters ka hona chahiye';
    if (pass !== confirm)         e.confirm = 'Password match nahi kar raha';
    if (!city.trim())             e.city    = 'Sheher zaroori hai';
    if (Object.keys(e).length) { setErrors(e); return false; }
    setErrors({});
    return true;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (skills.length === 0) e.skills = 'Kam se kam 1 skill select karo';
    if (!dailyCharge || isNaN(Number(dailyCharge)) || Number(dailyCharge) <= 0) e.dailyCharge = 'Daily charge sahi daalo';
    if (Object.keys(e).length) { setErrors(e); return false; }
    setErrors({});
    return true;
  };

  const handleStep1Next = () => { if (validateStep1()) setStep(2); };

  const handleSubmit = () => {
    if (!validateStep2()) return;
    const formData: RegisterFormData = {
      name: name.trim(), phone, password: pass,
      city: city.trim(), workerType, skills,
      experience, dailyCharge, workRadius,
    };
    const profile: UserProfile = {
      name: name.trim(), city: city.trim(), workerType,
      experience, dailyCharge: Number(dailyCharge), skills,
      aboutMe: '', workRadius, photoUrl: photo,
    };
    onSubmit(formData, profile);
  };

  const toggleSkill = (s: Skill) => {
    clearErr('skills');
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ width:'100%', minHeight:'100dvh', background: C.bgGrad, color:'#fff', overflowY:'auto', paddingBottom:40, position:'relative' }}>
      {/* Tile grid bg */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(255,138,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,138,0,0.04) 1px,transparent 1px)`, backgroundSize:'48px 48px', zIndex:0 }} />

      {/* Header */}
      <div style={{ background:'rgba(4,15,53,0.92)', backdropFilter:'blur(12px)', padding:'16px 18px', borderBottom:`1px solid rgba(255,138,0,0.12)`, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', gap:6, marginBottom:16 }}>
          {[1,2].map(n => (
            <div key={n} style={{ flex:1, height:4, borderRadius:2, background: n<=step ? `linear-gradient(90deg,${C.orange},#E06000)` : 'rgba(255,255,255,0.1)', boxShadow: n<=step ? `0 0 8px ${C.orangeGlow}` : 'none', transition:'all 0.3s' }} />
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={step === 1 ? onBack : () => { setStep(1); setErrors({}); }}
            style={{ width:40, height:40, borderRadius:20, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div>
            <div style={{ fontSize:11, color: C.gold, fontWeight:700, letterSpacing:1 }}>STEP {step} OF 2</div>
            <div style={{ fontSize:20, fontWeight:900 }}>{step === 1 ? 'Basic Information' : 'Professional Details'}</div>
          </div>
        </div>
      </div>

      <div style={{ padding:'20px 18px', display:'flex', flexDirection:'column', gap:16, position:'relative', zIndex:1 }}>

        {step === 1 && (
          <>
            {/* Photo */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
              <div onClick={() => photoRef.current?.click()}
                style={{ width:82, height:82, borderRadius:41, border:`2.5px solid ${C.orange}`, background:'rgba(10,28,90,0.8)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', boxShadow:`0 0 18px ${C.orangeGlow}`, overflow:'hidden' }}>
                {photo ? (
                  <img src={photo} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <Camera size={28} color={C.textSec} />
                )}
                <div style={{ position:'absolute', bottom:0, right:0, width:26, height:26, borderRadius:13, background:`linear-gradient(135deg,${C.orange},#E06000)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:900 }}>+</div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange} />
            </div>
            <div style={{ textAlign:'center', fontSize:12, color: C.textSec, marginTop:-8 }}>Profile Photo (Optional)</div>

            {/* Name */}
            <div>
              <label style={labelStyle}>FULL NAME *</label>
              <input value={name} onChange={e => { setName(e.target.value); clearErr('name'); }}
                placeholder="Apna poora naam"
                style={{ ...inputStyle(!!errors.name), border: `1.5px solid ${errors.name ? C.red : C.cardBorder}` }} />
              {errors.name && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.name}</div>}
            </div>

            {/* Phone */}
            <div>
              <label style={labelStyle}>MOBILE NUMBER *</label>
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.textSec, fontWeight:700, fontSize:13, borderRight:'1px solid rgba(255,255,255,0.15)', paddingRight:10, display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
                  +91
                </div>
                <input value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g,'').slice(0,10)); clearErr('phone'); }}
                  type="tel" maxLength={10} placeholder="00000 00000"
                  style={{ ...inputStyle(!!errors.phone), paddingLeft:54, letterSpacing:2, border: `1.5px solid ${errors.phone ? C.red : C.cardBorder}` }} />
              </div>
              {errors.phone && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.phone}</div>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>PASSWORD *</label>
              <div style={{ position:'relative' }}>
                <input value={pass} onChange={e => { setPass(e.target.value); clearErr('pass'); }}
                  type={showPass ? 'text' : 'password'} placeholder="Kam se kam 6 characters"
                  style={{ ...inputStyle(!!errors.pass), paddingRight:50, border: `1.5px solid ${errors.pass ? C.red : C.cardBorder}` }} />
                <button onClick={() => setShowPass(p => !p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color: C.textSec, display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.pass && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.pass}</div>}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD *</label>
              <div style={{ position:'relative' }}>
                <input value={confirm} onChange={e => { setConfirm(e.target.value); clearErr('confirm'); }}
                  type={showConfirm ? 'text' : 'password'} placeholder="Password dobara daalo"
                  style={{ ...inputStyle(!!errors.confirm), paddingRight:50, border: `1.5px solid ${errors.confirm ? C.red : C.cardBorder}` }} />
                <button onClick={() => setShowConfirm(p => !p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color: C.textSec, display:'flex', alignItems:'center' }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirm && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.confirm}</div>}
            </div>

            {/* City */}
            <div>
              <label style={labelStyle}>CITY *</label>
              <div style={{ position:'relative' }}>
                <MapPin size={15} color={C.orange} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input value={city} onChange={e => { setCity(e.target.value); clearErr('city'); }}
                  placeholder="Jaipur, Delhi, Mumbai..."
                  style={{ ...inputStyle(!!errors.city), paddingLeft:38, border: `1.5px solid ${errors.city ? C.red : C.cardBorder}` }} />
              </div>
              {errors.city && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.city}</div>}
            </div>

            <button onClick={handleStep1Next}
              style={{ width:'100%', padding:'17px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontSize:16, fontWeight:900, cursor:'pointer', boxShadow:`0 6px 24px ${C.orangeGlow}`, marginTop:4 }}>
              Aage Jao →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Worker Type */}
            <div>
              <label style={labelStyle}>KAAM KA TYPE *</label>
              <div style={{ display:'flex', gap:12 }}>
                {([
                  { val:'mistri' as WorkerType, icon:'🏗️', label:'Tile Mistri' },
                  { val:'labour' as WorkerType, icon:'🔨', label:'Labour' },
                ]).map(opt => (
                  <button key={opt.val} onClick={() => setWorkerType(opt.val)}
                    style={{ flex:1, padding:'14px 10px', borderRadius:14, border:`2px solid ${workerType===opt.val ? C.orange : 'rgba(255,255,255,0.1)'}`, background: workerType===opt.val ? 'rgba(255,138,0,0.18)' : 'rgba(10,28,90,0.5)', color:'#fff', cursor:'pointer', fontWeight:800, fontSize:14, display:'flex', flexDirection:'column', alignItems:'center', gap:6, boxShadow: workerType===opt.val ? `0 0 18px rgba(255,138,0,0.25)` : 'none', transition:'all 0.18s' }}>
                    <span style={{ fontSize:28 }}>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>
                SKILLS * {skills.length > 0 && <span style={{ color: C.orange }}>({skills.length} selected)</span>}
              </label>
              {errors.skills && <div style={{ color: C.red, fontSize:12, marginBottom:8 }}>{errors.skills}</div>}
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {REGISTER_SKILLS.map(s => {
                  const sel = skills.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSkill(s)}
                      style={{ padding:'9px 14px', borderRadius:20, border:`1.5px solid ${sel ? C.orange : 'rgba(255,255,255,0.12)'}`, background: sel ? 'rgba(255,138,0,0.2)' : 'rgba(255,255,255,0.04)', color: sel ? C.orange : C.textSec, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow: sel ? `0 0 10px rgba(255,138,0,0.22)` : 'none', transition:'all 0.15s' }}>
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label style={labelStyle}>EXPERIENCE (SAAL)</label>
              <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                <button onClick={() => setExperience(Math.max(0, experience-1))}
                  style={{ width:44, height:44, borderRadius:22, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Minus size={18} />
                </button>
                <span style={{ fontSize:30, fontWeight:900, color: C.orange, minWidth:50, textAlign:'center' }}>{experience}</span>
                <button onClick={() => setExperience(experience+1)}
                  style={{ width:44, height:44, borderRadius:22, background:`linear-gradient(135deg,${C.orange},#E06000)`, border:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 12px ${C.orangeGlow}` }}>
                  <Plus size={18} />
                </button>
                <span style={{ color: C.textSec, fontSize:14 }}>saal</span>
              </div>
            </div>

            {/* Daily Charge */}
            <div>
              <label style={labelStyle}>DAILY CHARGE *</label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color: C.gold, fontWeight:900, fontSize:20 }}>₹</span>
                <input value={dailyCharge} onChange={e => { setDailyCharge(e.target.value); clearErr('dailyCharge'); }}
                  type="number" placeholder="800"
                  style={{ ...inputStyle(!!errors.dailyCharge), paddingLeft:36, color: C.gold, fontSize:22, fontWeight:900, border:`2px solid ${errors.dailyCharge ? C.red : C.orange}`, boxShadow:`0 0 10px rgba(255,138,0,0.18)` }} />
              </div>
              {errors.dailyCharge && <div style={{ color: C.red, fontSize:12, marginTop:5 }}>{errors.dailyCharge}</div>}
            </div>

            {/* Work Radius */}
            <div>
              <label style={labelStyle}>
                KAAM KA AREA: <span style={{ color: C.orange, fontSize:14 }}>{workRadius} km</span>
              </label>
              <input type="range" min={1} max={50} value={workRadius} onChange={e => setWorkRadius(Number(e.target.value))}
                style={{ width:'100%', accentColor: C.orange, height:6 }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color: C.textSec, marginTop:5 }}>
                <span>1 km</span><span>25 km</span><span>50 km</span>
              </div>
            </div>

            <button onClick={handleSubmit}
              style={{ width:'100%', padding:'17px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${C.orange},#E06000)`, color:'#fff', fontSize:16, fontWeight:900, cursor:'pointer', boxShadow:`0 6px 24px ${C.orangeGlow}`, marginTop:4 }}>
              📲 OTP se Verify Karo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
