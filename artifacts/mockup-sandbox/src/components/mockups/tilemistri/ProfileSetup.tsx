import React, { useState } from 'react';
import { Camera, MapPin, Minus, Plus } from 'lucide-react';

export function ProfileSetup() {
  const [experience, setExperience] = useState(5);
  const [selectedSkills, setSelectedSkills] = useState(['Tile Fitting', 'Ceramic Tiles']);

  const skills = [
    'Tile Fitting', 'Tile Polish', 'Tile Cutting', 'Pithal Work', 
    'Marble Work', 'Granite Work', 'Ceramic Tiles', 'Vitrified Tiles', 
    'Mosaic Tiles', 'Stone Work', 'Terrace Work', 'Swimming Pool Tiles', 
    'Outdoor Paving', 'Glass Tiles', 'Anti-Skid Tiles', 'Material Loading', 
    'Cement Mixing', 'Helper Work'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white">
      <div className="w-full h-1 bg-[#122340]">
        <div className="w-2/3 h-full bg-[#FF7A1A]"></div>
      </div>

      <div className="p-6 pb-24">
        <h2 className="text-2xl font-bold mb-8 text-white">Complete Your Profile</h2>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#FF7A1A] flex items-center justify-center bg-[#122340]">
            <Camera size={32} className="text-[#FF7A1A]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FF7A1A] flex items-center justify-center border-2 border-[#0A1628]">
              <Plus size={16} className="text-white" />
            </div>
          </div>
          <p className="mt-3 text-sm text-[#A8C4E0]">Add Photo</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#A8C4E0] mb-2">Full Name</label>
            <input type="text" defaultValue="Ramesh Kumar" className="w-full h-14 bg-[#122340] border border-[#2A4365] rounded-xl px-4 text-white focus:border-[#FF7A1A] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A8C4E0] mb-2">City/Location</label>
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8C4E0]" />
              <input type="text" defaultValue="Jaipur, Rajasthan" className="w-full h-14 bg-[#122340] border border-[#2A4365] rounded-xl pl-12 pr-4 text-white focus:border-[#FF7A1A] outline-none" />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#A8C4E0] mb-2">Worker Type</label>
              <select className="w-full h-14 bg-[#122340] border border-[#2A4365] rounded-xl px-4 text-white focus:border-[#FF7A1A] outline-none appearance-none">
                <option>Tile Mistri</option>
                <option>Labour</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#A8C4E0] mb-2">Daily Charge</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FFC107] font-bold">₹</span>
                <input type="number" defaultValue="800" className="w-full h-14 bg-[#122340] border border-[#2A4365] rounded-xl pl-8 pr-4 text-[#FFC107] font-bold focus:border-[#FF7A1A] outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A8C4E0] mb-2">Years of Experience</label>
            <div className="flex items-center justify-between bg-[#122340] border border-[#2A4365] rounded-xl h-14 px-4">
              <button onClick={() => setExperience(Math.max(0, experience - 1))} className="w-8 h-8 rounded-full bg-[#1A2E4A] flex items-center justify-center text-[#A8C4E0]">
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold">{experience} Years</span>
              <button onClick={() => setExperience(experience + 1)} className="w-8 h-8 rounded-full bg-[#FF7A1A] flex items-center justify-center text-white">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A8C4E0] mb-3">Skills & Expertise</label>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-[#FF7A1A]/20 text-[#FF7A1A] border border-[#FF7A1A] shadow-[0_0_10px_rgba(255,107,0,0.2)]'
                      : 'bg-[#122340] text-[#A8C4E0] border border-[#2A4365]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-[390px] mx-auto p-4 bg-gradient-to-t from-[#0A1628] via-[#0A1628] to-transparent">
        <button className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#E65A00] font-bold text-lg shadow-[0_4px_15px_rgba(255,107,0,0.3)]">
          Continue
        </button>
      </div>
    </div>
  );
}
