import { useState, useCallback } from 'react';

export type WorkerType = 'mistri' | 'labour';
export type JobStatus = 'available' | 'accepted' | 'started' | 'on-break' | 'completed';
export type PaymentStatus = 'pending' | 'paid';
export type PaymentMethod = 'cash' | 'upi' | 'phonepe' | 'googlepay' | 'paytm';

export const ALL_SKILLS = [
  'Tile Fitting','Tile Polish','Tile Cutting','Pithal Work','Marble Work',
  'Granite Work','Ceramic Tiles','Vitrified Tiles','Mosaic Tiles','Stone Work',
  'Terrace Work','Swimming Pool Tiles','Outdoor Paving','Glass Tiles',
  'Anti-Skid Tiles','Material Loading','Cement Mixing','Helper Work',
] as const;
export type Skill = typeof ALL_SKILLS[number];

export interface UserProfile {
  name: string;
  city: string;
  workerType: WorkerType;
  experience: number;
  dailyCharge: number;
  skills: Skill[];
  aboutMe: string;
  workRadius: number;
}

export interface Job {
  id: string;
  customerName: string;
  workType: string;
  location: string;
  dailyRate: number;
  distance: number;
  postedAgo: string;
  status: JobStatus;
  startTime?: string;
  lunchStart?: string;
  lunchEnd?: string;
  endTime?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  rating?: number;
}

export interface Earning {
  id: string;
  customerName: string;
  workType: string;
  date: string;
  amount: number;
  status: PaymentStatus;
}

// Platform-wide job listings (available to any logged-in worker)
const PLATFORM_JOBS: Job[] = [
  { id:'pj1', customerName:'Suresh Patel',  workType:'Tile Fitting',   location:'Malviya Nagar, Jaipur',  dailyRate:800,  distance:2.5, postedAgo:'10 min ago', status:'available' },
  { id:'pj2', customerName:'Rajesh Sharma', workType:'Marble Work',     location:'Vaishali Nagar, Jaipur', dailyRate:1000, distance:4.2, postedAgo:'25 min ago', status:'available' },
  { id:'pj3', customerName:'Amit Verma',    workType:'Ceramic Tiles',   location:'Civil Lines, Jaipur',    dailyRate:750,  distance:1.8, postedAgo:'1 hr ago',   status:'available' },
  { id:'pj4', customerName:'Priya Singh',   workType:'Granite Work',    location:'Mansarovar, Jaipur',     dailyRate:900,  distance:3.5, postedAgo:'2 hr ago',   status:'available' },
  { id:'pj5', customerName:'Vikram Gupta',  workType:'Pithal Work',     location:'Tonk Road, Jaipur',      dailyRate:1200, distance:5.0, postedAgo:'3 hr ago',   status:'available' },
];

export const EXTRA_JOBS_POOL: Omit<Job, 'id' | 'status' | 'postedAgo'>[] = [
  { customerName:'Deepak Agarwal', workType:'Vitrified Tiles',     location:'Sindhi Camp, Jaipur',    dailyRate:950,  distance:3.1 },
  { customerName:'Kavita Meena',   workType:'Anti-Skid Tiles',     location:'Pratap Nagar, Jaipur',   dailyRate:700,  distance:2.0 },
  { customerName:'Ramesh Joshi',   workType:'Outdoor Paving',      location:'Shyam Nagar, Jaipur',    dailyRate:1100, distance:6.2 },
  { customerName:'Sunita Bansal',  workType:'Swimming Pool Tiles', location:'C-Scheme, Jaipur',       dailyRate:1500, distance:4.8 },
  { customerName:'Harish Chand',   workType:'Stone Work',          location:'Bajaj Nagar, Jaipur',    dailyRate:850,  distance:1.5 },
  { customerName:'Pooja Gupta',    workType:'Glass Tiles',         location:'Gandhi Nagar, Jaipur',   dailyRate:1300, distance:3.7 },
  { customerName:'Anil Sharma',    workType:'Terrace Work',        location:'Murlipura, Jaipur',      dailyRate:900,  distance:5.5 },
  { customerName:'Meena Devi',     workType:'Mosaic Tiles',        location:'Jagatpura, Jaipur',      dailyRate:780,  distance:7.0 },
  { customerName:'Sanjay Trivedi', workType:'Marble Work',         location:'Durgapura, Jaipur',      dailyRate:1050, distance:2.8 },
  { customerName:'Rekha Singh',    workType:'Tile Polish',         location:'Sanganer, Jaipur',       dailyRate:650,  distance:8.3 },
];

// ── Storage keys ────────────────────────────────────────────────────────────
const SESSION_KEY = 'tm_session';
const userKey = (phone: string) => `tm_user_${phone}`;

interface SessionData {
  phone: string;
  workerType: WorkerType;
}

interface UserData {
  profile: UserProfile | null;
  jobs: Job[];
  earnings: Earning[];
  isOnline: boolean;
}

function freshUserData(): UserData {
  return {
    profile: null,
    jobs: PLATFORM_JOBS.map(j => ({ ...j })),
    earnings: [],
    isOnline: true,
  };
}

function loadSession(): SessionData | null {
  try { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; } catch { return null; }
}

function loadUserData(phone: string): UserData {
  try {
    const s = localStorage.getItem(userKey(phone));
    if (s) return JSON.parse(s) as UserData;
  } catch {}
  return freshUserData();
}

function persistSession(data: SessionData) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch {}
}

function persistUserData(phone: string, data: UserData) {
  try { localStorage.setItem(userKey(phone), JSON.stringify(data)); } catch {}
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch {}
}

// ── App state ───────────────────────────────────────────────────────────────
interface AppState {
  isLoggedIn: boolean;
  phone: string;
  workerType: WorkerType;
  profile: UserProfile | null;
  jobs: Job[];
  earnings: Earning[];
  isOnline: boolean;
}

const LOGGED_OUT_STATE: AppState = {
  isLoggedIn: false,
  phone: '',
  workerType: 'mistri',
  profile: null,
  jobs: [],
  earnings: [],
  isOnline: true,
};

function buildInitialState(): AppState {
  const session = loadSession();
  if (!session) return { ...LOGGED_OUT_STATE };
  const userData = loadUserData(session.phone);
  return { isLoggedIn: true, phone: session.phone, workerType: session.workerType, ...userData };
}

// ── Store hook ──────────────────────────────────────────────────────────────
export function useAppStore() {
  const [state, setState] = useState<AppState>(buildInitialState);

  const commit = useCallback((next: AppState) => {
    setState(next);
    if (next.isLoggedIn && next.phone) {
      persistSession({ phone: next.phone, workerType: next.workerType });
      persistUserData(next.phone, {
        profile: next.profile,
        jobs: next.jobs,
        earnings: next.earnings,
        isOnline: next.isOnline,
      });
    }
  }, []);

  const login = (phone: string, workerType: WorkerType): boolean => {
    const userData = loadUserData(phone);
    const next: AppState = { isLoggedIn: true, phone, workerType, ...userData };
    setState(next);
    persistSession({ phone, workerType });
    persistUserData(phone, userData);
    return userData.profile !== null;
  };

  const logout = () => {
    clearSession();
    setState({ ...LOGGED_OUT_STATE });
  };

  const saveProfile  = (profile: UserProfile)       => commit({ ...state, profile });
  const toggleOnline = ()                            => commit({ ...state, isOnline: !state.isOnline });
  const acceptJob    = (id: string)                  => commit({ ...state, jobs: state.jobs.map(j => j.id===id ? {...j, status:'accepted' as JobStatus} : j) });
  const rejectJob    = (id: string)                  => commit({ ...state, jobs: state.jobs.filter(j => j.id!==id) });

  const startWork  = (id: string) => { const t = now(); commit({ ...state, jobs: state.jobs.map(j => j.id===id ? {...j, status:'started'   as JobStatus, startTime: t}  : j) }); };
  const startLunch = (id: string) => { const t = now(); commit({ ...state, jobs: state.jobs.map(j => j.id===id ? {...j, status:'on-break'  as JobStatus, lunchStart: t} : j) }); };
  const resumeWork = (id: string) => { const t = now(); commit({ ...state, jobs: state.jobs.map(j => j.id===id ? {...j, status:'started'   as JobStatus, lunchEnd: t}   : j) }); };

  const completeWork = (id: string) => {
    const t = now();
    const jobs = state.jobs.map(j => j.id===id ? {...j, status:'completed' as JobStatus, endTime:t, paymentStatus:'pending' as PaymentStatus} : j);
    const done = state.jobs.find(j => j.id===id);
    const newEarning: Earning = {
      id: `e${Date.now()}`,
      customerName: done?.customerName ?? 'Customer',
      workType:     done?.workType     ?? 'Work',
      date:  new Date().toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'}),
      amount: done?.dailyRate ?? 0,
      status: 'pending',
    };
    commit({ ...state, jobs, earnings: [newEarning, ...state.earnings] });
  };

  const markPaid = (id: string, method: PaymentMethod) => {
    const job  = state.jobs.find(j => j.id===id);
    const jobs = state.jobs.map(j => j.id===id ? {...j, paymentStatus:'paid' as PaymentStatus, paymentMethod:method} : j);
    const earnings = state.earnings.map(e =>
      (job && e.customerName===job.customerName && e.status==='pending') ? {...e, status:'paid' as PaymentStatus} : e
    );
    commit({ ...state, jobs, earnings });
  };

  const addRating = (id: string, rating: number) =>
    commit({ ...state, jobs: state.jobs.map(j => j.id===id ? {...j, rating} : j) });

  const addNewJob = (job: Omit<Job,'id'|'status'|'postedAgo'>) =>
    commit({ ...state, jobs: [{ ...job, id:`jn${Date.now()}`, status:'available', postedAgo:'Abhi abhi' }, ...state.jobs] });

  return {
    ...state,
    login, logout,
    saveProfile, toggleOnline,
    acceptJob, rejectJob,
    startWork, startLunch, resumeWork, completeWork,
    markPaid, addRating, addNewJob,
  };
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}
