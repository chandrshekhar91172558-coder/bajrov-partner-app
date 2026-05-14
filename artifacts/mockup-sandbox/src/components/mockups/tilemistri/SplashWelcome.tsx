import React from 'react';
import { Hammer } from 'lucide-react';

export function SplashWelcome() {
  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white flex flex-col relative"
         style={{
           background: 'radial-gradient(circle at 50% 30%, #152B4D 0%, #0A1628 100%)',
         }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0V0zm20 20h20v20H20V20z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
             backgroundSize: '40px 40px'
           }} />

      <div className="flex-1 flex flex-col items-center justify-center pt-20 px-6 z-10">
        <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-[#FF7A1A] to-[#E65A00] flex items-center justify-center shadow-[0_0_30px_rgba(255,107,0,0.4)]">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></svg>
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-center">TileMistri<br/><span className="text-2xl font-semibold">Partner</span></h1>
        <p className="text-[#FFC107] font-medium text-sm tracking-wide uppercase mt-2">India's #1 Tile Worker Platform</p>
      </div>

      <div className="px-6 pb-12 flex flex-col gap-4 z-10 mt-auto">
        <div className="flex gap-4">
          <button className="flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-[#FF7A1A] to-[#E65A00] shadow-[0_8px_20px_rgba(255,107,0,0.3)] transition-transform active:scale-95 border border-[#FF8A33]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <span className="font-bold">I am Tile Mistri</span>
          </button>
          
          <button className="flex-1 flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-[#122340] border border-[#2A4365] shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-transform active:scale-95 hover:border-[#FF7A1A]">
            <Hammer size={32} className="text-[#A8C4E0]" />
            <span className="font-bold text-[#A8C4E0]">I am Labour</span>
          </button>
        </div>

        <p className="text-center text-[#A8C4E0] mt-6 text-sm">
          Already have an account? <span className="text-[#FF7A1A] font-bold cursor-pointer hover:underline">Login</span>
        </p>
      </div>
    </div>
  );
}
