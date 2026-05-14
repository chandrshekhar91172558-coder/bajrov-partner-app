import React, { useState } from 'react';
import { MapPin, Camera, Minus, Plus, ChevronRight } from 'lucide-react';
import { ALL_SKILLS, type Skill, type UserProfile, type WorkerType } from './store';

const C = {
  bg:        '#071B5A',
  bgGrad:    'linear-gradient(160deg, #040F35 0%, #071B5A 50%, #0A2070 100%)',
  orange:    '#FF8A00',
  orangeGlow:'rgba(255,138,0,0.45)',
  gold:      '#FFC107',
  textSec:   '#8BA5D4',
  cardBorder:'rgba(255,138,0,0.22)',
};

const glassCard = {
  background: 'rgba(10,28,90,0.7)',
  border: `1px solid ${C.cardBorder}`,
  backdropFilter: 'blur(8px)',
};

interface Props {
  workerType: WorkerType;
  onComplete: (profile: UserProfile) => void;
}

export function ProfileSetupScreen({ workerType, onComplete }: Props) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState(1);
  const [dailyCharge, setDailyCharge] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [aboutMe, setAboutMe] = useState('');
  const [workRadius, setWorkRadius] = useState(10);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const toggleSkill = (skill: Skill) =>
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim()) e.name = 'Naam daalna zaroori hai';
    if (!city.trim()) e.city = 'Sheher daalna zaroori hai';
    if (!dailyCharge || isNaN(Number(dailyCharge)) || Number(dailyCharge) <= 0) e.dailyCharge = 'Daily charge sahi daalo';
    if (skills.length === 0) e.skills = 'Kam se kam 1 skill select karo';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onComplete({ name: name.trim(), city: city.trim(), workerType, experience, dailyCharge: Number(dailyCharge), skills, aboutMe, workRadius });
  };

  const isValid = name.trim() && city.trim() && dailyCharge && Number(dailyCharge) > 0 && skills.length > 0;

  return (
    <div style={{ width:'100%', minHeight:'100dvh', background: C.bgGrad, color:'#fff', overflowY:'auto', paddingBottom:100 }}>
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', backgroundImage:`linear-gradient(rgba(255,138,0,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,138,0,0.05) 1px,transparent 1px)`, backgroundSize:'48px 48px', zIndex:0 }} />
      <div style={{ background:'rgba(4,15,53,0.9)', backdropFilter:'blur(12px)', padding:'20px 20px 18px', position:'relative', zIndex:1, borderBottom:`1px solid rgba(255,138,0,0.15)` }}>
        <div style={{ display:'flex', gap:6, marginBottom:18 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ flex:1, height:4, borderRadius:2, background: n<=2 ? `linear-gradient(90deg,${C.orange},#E06000)` : 'rgba(255,255,255,0.1)', boxShadow: n<=2 ? `0 0 8px ${C.orangeGlow}` : 'none' }} />
          ))}
        </div>
        <div style={{ fontSize:11, color: C.gold, marginBottom:4, fontWeight:700, letterSpacing:1 }}>STEP 1 OF 3</div>
        <div style={{ fontSize:23, fontWeight:900 }}>Complete Your Profile</div>
        <div style={{ fontSize:13, color: C.textSec, marginTop:5 }}>
          {workerType === 'mistri' ? '🏗️ Tile Mistri — Professional Setup' : '🔨 Labour Worker — Quick Setup'}
        </div>
      </div>

      <div style={{ padding:'24px 18px', display:'flex', flexDirection:'column', gap:18, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
          <div style={{ width:88, height:88, borderRadius:44, border:`2.5px solid ${C.orange}`, background:'rgba(10,28,90,0.8)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', boxShadow:`0 0 20px ${C.orangeGlow}` }}>
            <Camera size={30} color={C.textSec} />
            <div style={{ position:'absolute', bottom:0, right:0, width:28, height:28, borderRadius:14, background:`linear-gradient(135deg,${C.orange},#E06000)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, boxShadow:`0 2px 8px ${C.orangeGlow}` }}>+</div>
          </div>
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:8, display:'block', letterSpacing:0.5 }}>FULL NAME *</label>
          <input value={name} onChange={e => { setName(e.target.value); setErrors(p=>({...p,name:''})); }}
            placeholder="Apna poora naam likho"
            style={{ width:'100%', ...glassCard, borderRadius:13, padding:'14px 16px', color:'#fff', fontSize:15, outline:'none', boxSizing:'border-box', border: errors.name ? '1.5px solid #ef4444' : `1px solid ${C.cardBorder}` }} />
          {errors.name && <div style={{ color:'#ef4444', fontSize:12, marginTop:5 }}>{errors.name}</div>}
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:8, display:'block', letterSpacing:0.5 }}>CITY / LOCATION *</label>
          <div style={{ position:'relative' }}>
            <MapPin size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color: C.orange }} />
            <input value={city} onChange={e => { setCity(e.target.value); setErrors(p=>({...p,city:''})); }}
              placeholder="Jaipur, Delhi, Mumbai..."
              style={{ width:'100%', ...glassCard, borderRadius:13, padding:'14px 16px 14px 38px', color:'#fff', fontSize:15, outline:'none', boxSizing:'border-box', border: errors.city ? '1.5px solid #ef4444' : `1px solid ${C.cardBorder}` }} />
          </div>
          {errors.city && <div style={{ color:'#ef4444', fontSize:12, marginTop:5 }}>{errors.city}</div>}
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:10, display:'block', letterSpacing:0.5 }}>YEARS OF EXPERIENCE</label>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <button onClick={() => setExperience(Math.max(0, experience-1))} style={{ width:44, height:44, borderRadius:22, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Minus size={18} />
            </button>
            <span style={{ fontSize:28, fontWeight:900, color: C.orange, minWidth:48, textAlign:'center', textShadow:`0 0 16px ${C.orangeGlow}` }}>{experience}</span>
            <button onClick={() => setExperience(experience+1)} style={{ width:44, height:44, borderRadius:22, background:`linear-gradient(135deg,${C.orange},#E06000)`, border:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 12px ${C.orangeGlow}` }}>
              <Plus size={18} />
            </button>
            <span style={{ color: C.textSec, fontSize:14 }}>saal ka anubhav</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:8, display:'block', letterSpacing:0.5 }}>DAILY CHARGE (per day) *</label>
          <div style={{ position:'relative' }}>
            <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color: C.gold, fontWeight:900, fontSize:18 }}>₹</span>
            <input value={dailyCharge} onChange={e => { setDailyCharge(e.target.value); setErrors(p=>({...p,dailyCharge:''})); }}
              type="number" placeholder="800"
              style={{ width:'100%', ...glassCard, border: errors.dailyCharge ? '2px solid #ef4444' : `2px solid ${C.orange}`, borderRadius:13, padding:'14px 16px 14px 36px', color: C.gold, fontSize:22, fontWeight:900, outline:'none', boxSizing:'border-box', boxShadow:`0 0 12px rgba(255,138,0,0.2)` }} />
          </div>
          {errors.dailyCharge && <div style={{ color:'#ef4444', fontSize:12, marginTop:5 }}>{errors.dailyCharge}</div>}
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:10, display:'block', letterSpacing:0.5 }}>
            WORK RADIUS: <span style={{ color: C.orange, fontSize:15 }}>{workRadius} km</span>
          </label>
          <input type="range" min={1} max={50} value={workRadius} onChange={e => setWorkRadius(Number(e.target.value))}
            style={{ width:'100%', accentColor: C.orange, height:6 }} />
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color: C.textSec, marginTop:6 }}>
            <span>1 km</span><span>25 km</span><span>50 km</span>
          </div>
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:10, display:'block', letterSpacing:0.5 }}>
            SKILLS * {skills.length > 0 && <span style={{ color: C.orange }}>({skills.length} selected)</span>}
          </label>
          {errors.skills && <div style={{ color:'#ef4444', fontSize:12, marginBottom:8 }}>{errors.skills}</div>}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {ALL_SKILLS.map(skill => {
              const sel = skills.includes(skill);
              return (
                <button key={skill} onClick={() => { toggleSkill(skill); setErrors(p=>({...p,skills:''})); }}
                  style={{ padding:'8px 15px', borderRadius:20, border:`1.5px solid ${sel?C.orange:'rgba(255,255,255,0.12)'}`, background: sel ? `rgba(255,138,0,0.18)` : 'rgba(255,255,255,0.04)', color: sel ? C.orange : C.textSec, fontSize:12, fontWeight:700, cursor:'pointer', boxShadow: sel ? `0 0 10px rgba(255,138,0,0.25)` : 'none', transition:'all 0.15s' }}>
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label style={{ fontSize:12, color: C.textSec, fontWeight:700, marginBottom:8, display:'block', letterSpacing:0.5 }}>ABOUT ME (optional)</label>
          <textarea value={aboutMe} onChange={e => setAboutMe(e.target.value)}
            placeholder="Apne baare mein likho — experience, kaam ki quality..."
            rows={3}
            style={{ width:'100%', ...glassCard, borderRadius:13, padding:'14px 16px', color:'#fff', fontSize:14, outline:'none', boxSizing:'border-box', resize:'none', fontFamily:'inherit' }} />
        </div>

        <button onClick={handleSubmit} disabled={!isValid}
          style={{ width:'100%', padding:'18px', borderRadius:14, border:'none', fontSize:16, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:10, transition:'all 0.2s',
            background: isValid ? `linear-gradient(135deg, ${C.orange}, #E06000)` : 'rgba(255,255,255,0.05)',
            color: isValid ? '#fff' : '#3A5080',
            boxShadow: isValid ? `0 6px 28px ${C.orangeGlow}` : 'none',
            cursor: isValid ? 'pointer' : 'not-allowed',
          }}>
          Profile Save Karo <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
