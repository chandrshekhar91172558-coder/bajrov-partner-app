import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

export function LoginOTP() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="w-[390px] h-[844px] max-h-[100dvh] overflow-y-auto bg-[#0A1628] text-white relative">
      <div className="p-6">
        <button className="w-10 h-10 rounded-full bg-[#122340] flex items-center justify-center mb-8 border border-[#1E3A5F]">
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2 text-white">Enter Mobile Number</h2>
          <p className="text-[#A8C4E0]">We'll send an OTP to verify</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-medium border-r border-[#2A4365] pr-3">
                +91
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                maxLength={10}
                className="w-full h-14 bg-[#122340] border border-[#2A4365] rounded-xl pl-[72px] pr-4 text-lg font-medium text-white focus:outline-none focus:border-[#FF7A1A] focus:ring-1 focus:ring-[#FF7A1A] transition-all"
                placeholder="00000 00000"
              />
            </div>

            <button 
              type="submit"
              disabled={phone.length !== 10}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#E65A00] font-bold text-lg shadow-[0_4px_15px_rgba(255,107,0,0.3)] disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="tel"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className={`w-12 h-14 rounded-xl bg-[#122340] border ${error ? 'border-red-500 animate-[shake_0.4s_ease-in-out]' : 'border-[#2A4365]'} text-center text-xl font-bold text-white focus:outline-none focus:border-[#FF7A1A] focus:ring-1 focus:ring-[#FF7A1A] transition-all`}
                />
              ))}
            </div>
            
            {error && <p className="text-red-400 text-sm text-center -mt-2">Invalid OTP. Please try again.</p>}

            <p className="text-center text-[#A8C4E0] text-sm">
              Resend OTP in <span className="text-[#FF7A1A] font-bold">30s</span>
            </p>

            <button 
              onClick={() => setError(true)}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-[#FF7A1A] to-[#E65A00] font-bold text-lg shadow-[0_4px_15px_rgba(255,107,0,0.3)] transition-all active:scale-[0.98] mt-4"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
