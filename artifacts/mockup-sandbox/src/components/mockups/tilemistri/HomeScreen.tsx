import React, { useState } from 'react';
import { Bell, MapPin, Clock, Home, Briefcase, IndianRupee, User } from 'lucide-react';

export function HomeScreen() {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white pb-24">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#1A2E4A] border-2 border-[#FF7A1A] overflow-hidden flex items-center justify-center">
            <User size={24} className="text-[#A8C4E0]" />
          </div>
          <div>
            <p className="text-sm text-[#A8C4E0]">Good Morning 👋</p>
            <h2 className="text-lg font-bold">Ramesh Kumar</h2>
          </div>
        </div>
        <div className="relative w-10 h-10 rounded-full bg-[#122340] flex items-center justify-center border border-[#2A4365]">
          <Bell size={20} className="text-[#A8C4E0]" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#122340]"></span>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-[#122340] rounded-2xl p-1 flex items-center border border-[#2A4365]">
          <button 
            onClick={() => setIsOnline(true)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isOnline ? 'bg-[#FF7A1A] text-white shadow-[0_0_15px_rgba(255,107,0,0.3)]' : 'text-[#A8C4E0]'}`}
          >
            Online
          </button>
          <button 
            onClick={() => setIsOnline(false)}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isOnline ? 'bg-[#1A2E4A] text-white' : 'text-[#A8C4E0]'}`}
          >
            Offline
          </button>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-gradient-to-br from-[#1A2E4A] to-[#122340] rounded-2xl p-5 border border-[#2A4365] shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-[#FFC107] font-medium mb-1">Today's Earnings</p>
              <h3 className="text-3xl font-bold">₹0</h3>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#A8C4E0] mb-1">This Week</p>
              <p className="text-lg font-semibold">₹2,450</p>
            </div>
          </div>
          <div className="h-px w-full bg-[#2A4365] my-4"></div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#A8C4E0]">This Month</span>
            <span className="font-bold text-[#FFC107]">₹18,600</span>
          </div>
        </div>
      </div>

      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            Nearby Jobs 
            <span className="bg-[#FF7A1A] text-xs px-2 py-0.5 rounded-full text-white">2</span>
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-[#122340] rounded-2xl p-5 border border-[#2A4365] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF7A1A] opacity-5 rounded-bl-full blur-xl"></div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-3 py-1 bg-[#FF7A1A]/10 text-[#FF7A1A] border border-[#FF7A1A]/20 rounded-md text-xs font-bold mb-2">Tile Fitting</span>
                <h4 className="font-bold">Suresh Patel</h4>
              </div>
              <div className="text-right">
                <p className="text-[#FFC107] font-bold text-lg">₹800<span className="text-xs font-normal text-[#A8C4E0]">/day</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-[#A8C4E0] mb-5">
              <span className="flex items-center gap-1"><MapPin size={14}/> 2.5 km</span>
              <span className="flex items-center gap-1"><Clock size={14}/> 10m ago</span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-[#FF7A1A] text-white font-bold rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)]">Accept Job</button>
              <button className="px-5 py-3 border border-[#2A4365] text-[#A8C4E0] font-bold rounded-xl hover:bg-[#1A2E4A]">Reject</button>
            </div>
          </div>

          <div className="bg-[#122340] rounded-2xl p-5 border border-[#2A4365]">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block px-3 py-1 bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20 rounded-md text-xs font-bold mb-2">Marble Work</span>
                <h4 className="font-bold">Rajesh Sharma</h4>
              </div>
              <div className="text-right">
                <p className="text-[#FFC107] font-bold text-lg">₹1000<span className="text-xs font-normal text-[#A8C4E0]">/day</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-[#A8C4E0] mb-5">
              <span className="flex items-center gap-1"><MapPin size={14}/> 4.1 km</span>
              <span className="flex items-center gap-1"><Clock size={14}/> 1h ago</span>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 bg-[#FF7A1A] text-white font-bold rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)]">Accept Job</button>
              <button className="px-5 py-3 border border-[#2A4365] text-[#A8C4E0] font-bold rounded-xl hover:bg-[#1A2E4A]">Reject</button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-[390px] mx-auto bg-[#0A1628]/90 backdrop-blur-md border-t border-[#2A4365] pb-safe pt-2">
        <div className="flex justify-around items-center px-2 py-2">
          <div className="flex flex-col items-center gap-1 text-[#FF7A1A]">
            <Home size={24} className="drop-shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
            <span className="text-[10px] font-bold">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-[#A8C4E0]">
            <Briefcase size={24} />
            <span className="text-[10px] font-medium">Jobs</span>
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
