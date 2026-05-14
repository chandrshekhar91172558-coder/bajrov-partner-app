import React from 'react';
import { Home, Briefcase, IndianRupee, User, Clock, Download } from 'lucide-react';

export function EarningsScreen() {
  const chartHeights = [40, 60, 30, 80, 100, 50, 70];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white pb-24">
      <div className="pt-6 px-6 pb-4">
        <h1 className="text-2xl font-bold mb-4">My Earnings</h1>
        <div className="bg-[#122340] rounded-xl p-1 flex items-center border border-[#2A4365]">
          <button className="flex-1 py-2 rounded-lg text-sm text-[#A8C4E0]">Week</button>
          <button className="flex-1 py-2 rounded-lg text-sm font-bold bg-[#FF7A1A] text-white shadow-sm">Month</button>
          <button className="flex-1 py-2 rounded-lg text-sm text-[#A8C4E0]">Year</button>
        </div>
      </div>

      <div className="px-6 mb-8 mt-2 flex flex-col items-center">
        <p className="text-[#A8C4E0] text-sm mb-1 uppercase tracking-wider font-medium">October Earnings</p>
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A8C4E0] mb-6">
          ₹18,600
        </h2>

        <div className="w-full flex gap-3">
          <div className="flex-1 bg-[#122340] rounded-2xl p-4 border border-[#2A4365] text-center">
            <p className="text-2xl font-bold text-[#FFC107]">12</p>
            <p className="text-xs text-[#A8C4E0] mt-1">Jobs Done</p>
          </div>
          <div className="flex-1 bg-[#122340] rounded-2xl p-4 border border-[#2A4365] text-center">
            <p className="text-2xl font-bold text-[#FF7A1A]">₹2k</p>
            <p className="text-xs text-[#A8C4E0] mt-1">Pending</p>
          </div>
          <div className="flex-1 bg-[#122340] rounded-2xl p-4 border border-[#2A4365] text-center">
            <p className="text-2xl font-bold text-[#FFC107]">4.8★</p>
            <p className="text-xs text-[#A8C4E0] mt-1">Rating</p>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-[#122340] rounded-2xl p-5 border border-[#2A4365]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Daily Breakdown</h3>
            <button className="text-[#FF7A1A] text-xs font-bold flex items-center gap-1"><Download size={14}/> Report</button>
          </div>
          
          <div className="h-40 flex items-end justify-between gap-2 px-2 relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full h-px bg-[#2A4365]/30"></div>
              <div className="w-full h-px bg-[#2A4365]/30"></div>
              <div className="w-full h-px bg-[#2A4365]/30"></div>
            </div>
            
            {chartHeights.map((h, i) => (
              <div key={i} className="flex flex-col items-center w-full z-10">
                <div 
                  className={`w-full max-w-[24px] rounded-t-sm transition-all duration-500 ${i === 4 ? 'bg-[#FF7A1A] shadow-[0_0_10px_rgba(255,107,0,0.4)]' : 'bg-[#2A4365]'}`}
                  style={{ height: `${h}%` }}
                ></div>
                <span className={`text-[10px] mt-2 ${i === 4 ? 'text-[#FF7A1A] font-bold' : 'text-[#A8C4E0]'}`}>{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          
          <div className="bg-[#122340] rounded-xl p-4 border border-[#2A4365] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A1A]/10 text-[#FF7A1A] flex items-center justify-center">
                <IndianRupee size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Sunil Mehta</h4>
                <p className="text-xs text-[#A8C4E0]">Marble Fitting • Today</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#4CAF50]">+₹1,200</p>
              <p className="text-[10px] text-[#A8C4E0]">Paid via UPI</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#122340] to-[#2A1612] rounded-xl p-4 border border-[#FF7A1A]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A1A]/20 text-[#FF7A1A] flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Priya Sharma</h4>
                <p className="text-xs text-[#A8C4E0]">Bathroom Work • Yesterday</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="font-bold text-[#FF7A1A]">₹800</p>
              <button className="mt-1 text-[10px] bg-[#FF7A1A] text-white px-2 py-0.5 rounded font-bold">Remind</button>
            </div>
          </div>

          <div className="bg-[#122340] rounded-xl p-4 border border-[#2A4365] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FF7A1A]/10 text-[#FF7A1A] flex items-center justify-center">
                <IndianRupee size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm">Vikram Singh</h4>
                <p className="text-xs text-[#A8C4E0]">Kitchen Tile • 14 Oct</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#4CAF50]">+₹950</p>
              <p className="text-[10px] text-[#A8C4E0]">Paid via Cash</p>
            </div>
          </div>

        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-[390px] mx-auto bg-[#0A1628]/90 backdrop-blur-md border-t border-[#2A4365] pb-safe pt-2 z-20">
        <div className="flex justify-around items-center px-2 py-2">
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <Briefcase size={24} />
            <span className="text-[10px] font-medium">Jobs</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#FF7A1A]">
            <IndianRupee size={24} className="drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
            <span className="text-[10px] font-bold">Earnings</span>
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
