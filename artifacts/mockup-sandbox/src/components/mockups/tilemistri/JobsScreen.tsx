import React from 'react';
import { Home, Briefcase, IndianRupee, User, CheckCircle2, Star, MapPin } from 'lucide-react';

export function JobsScreen() {
  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white pb-24">
      <div className="pt-6 px-6 pb-4 bg-[#122340] border-b border-[#2A4365] sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">My Jobs</h1>
        <div className="flex justify-between text-sm font-medium">
          <button className="text-[#A8C4E0] pb-2">All</button>
          <button className="text-[#FF7A1A] border-b-2 border-[#FF7A1A] pb-2">Active</button>
          <button className="text-[#A8C4E0] pb-2">Completed</button>
          <button className="text-[#A8C4E0] pb-2">Pending</button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-b from-[#1A2E4A] to-[#122340] rounded-2xl border border-[#2A4365] shadow-[0_8px_20px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="p-5 border-b border-[#2A4365]/50 flex justify-between items-start">
            <div>
              <span className="inline-block px-3 py-1 bg-[#4CAF50]/20 text-[#4CAF50] border border-[#4CAF50]/30 rounded-full text-xs font-bold mb-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse"></span> Active Now
              </span>
              <h3 className="font-bold text-lg">Bathroom Tile Fitting</h3>
              <p className="text-sm text-[#A8C4E0] flex items-center gap-1 mt-1"><MapPin size={12} /> Amit Verma, Vaishali Nagar</p>
            </div>
            <div className="text-right">
              <span className="text-[#FFC107] font-bold text-xl">₹850</span>
              <p className="text-xs text-[#A8C4E0]">Daily Rate</p>
            </div>
          </div>

          <div className="p-5 bg-[#122340]">
            <h4 className="text-sm font-bold text-[#A8C4E0] mb-4">Today's Progress</h4>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#2A4365]">
              
              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center z-10 shadow-[0_0_10px_rgba(76,175,80,0.3)]">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Job Accepted</p>
                  <p className="text-xs text-[#A8C4E0]">08:30 AM</p>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#4CAF50] flex items-center justify-center z-10 shadow-[0_0_10px_rgba(76,175,80,0.3)]">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Work Started</p>
                  <p className="text-xs text-[#A8C4E0]">09:15 AM</p>
                </div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF7A1A] flex items-center justify-center z-10 shadow-[0_0_10px_rgba(255,107,0,0.5)] border-2 border-[#122340]">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#FF7A1A]">Working...</p>
                  <p className="text-xs text-[#A8C4E0]">Current Status</p>
                </div>
              </div>

              <div className="relative flex items-center gap-4 opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#1A2E4A] border-2 border-[#2A4365] flex items-center justify-center z-10"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Lunch Break</p>
                </div>
              </div>

              <div className="relative flex items-center gap-4 opacity-50">
                <div className="w-6 h-6 rounded-full bg-[#1A2E4A] border-2 border-[#2A4365] flex items-center justify-center z-10"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Completed</p>
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 border-t border-[#2A4365]/50">
            <button className="w-full py-3 bg-transparent border border-[#FF7A1A] text-[#FF7A1A] font-bold rounded-xl hover:bg-[#FF7A1A]/10 transition-colors">
              Take Break
            </button>
          </div>
        </div>

        <div className="bg-[#122340] rounded-2xl p-5 border border-[#2A4365] opacity-75">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-block px-2 py-0.5 bg-[#A8C4E0]/10 text-[#A8C4E0] border border-[#A8C4E0]/20 rounded text-[10px] font-bold mb-2">Completed</span>
              <h4 className="font-bold">Kitchen Floor Tiling</h4>
              <p className="text-xs text-[#A8C4E0] mt-1">Neha Gupta • 12 Oct</p>
            </div>
            <div className="text-right">
              <span className="text-[#FFC107] font-bold">₹1,200</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#FFC107] mt-2">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <span className="text-white text-xs ml-2 font-medium">5.0</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-[390px] mx-auto bg-[#0A1628]/90 backdrop-blur-md border-t border-[#2A4365] pb-safe pt-2 z-20">
        <div className="flex justify-around items-center px-2 py-2">
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#FF7A1A]">
            <Briefcase size={24} className="drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
            <span className="text-[10px] font-bold">Jobs</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <IndianRupee size={24} />
            <span className="text-[10px] font-medium">Earnings</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <User size={24} />
            <span className="text-[10px] font-medium">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
