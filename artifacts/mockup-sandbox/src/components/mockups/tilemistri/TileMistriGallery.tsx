import React, { useState } from 'react';
import { SplashWelcome } from './SplashWelcome';
import { LoginOTP } from './LoginOTP';
import { ProfileSetup } from './ProfileSetup';
import { HomeScreen } from './HomeScreen';
import { JobsScreen } from './JobsScreen';
import { EarningsScreen } from './EarningsScreen';

const screens = [
  { label: 'Splash', component: SplashWelcome },
  { label: 'Login', component: LoginOTP },
  { label: 'Profile', component: ProfileSetup },
  { label: 'Home', component: HomeScreen },
  { label: 'Jobs', component: JobsScreen },
  { label: 'Earnings', component: EarningsScreen },
];

export function TileMistriGallery() {
  const [active, setActive] = useState(0);
  const Screen = screens[active].component;

  return (
    <div style={{ background: '#05101F', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FF7A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>TileMistri Partner</div>
            <div style={{ color: '#FFB800', fontSize: 11, fontWeight: 600 }}>App Preview</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
          {screens.map((s, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                transition: 'all 0.2s',
                background: active === i ? '#FF7A1A' : '#1A2E4A',
                color: active === i ? '#fff' : '#A8C4E0',
                boxShadow: active === i ? '0 0 12px rgba(255,122,26,0.5)' : 'none',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        width: 390,
        maxWidth: '100vw',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 0 0 2px #1A2E4A, 0 8px 40px rgba(0,0,0,0.6)',
        background: '#0A1628',
      }}>
        <Screen />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, marginBottom: 24 }}>
        {screens.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: active === i ? 24 : 8,
              height: 8,
              borderRadius: 4,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background: active === i ? '#FF7A1A' : '#1A2E4A',
              padding: 0,
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => setActive(i => Math.max(0, i - 1))}
          disabled={active === 0}
          style={{
            padding: '10px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: '#1A2E4A',
            color: active === 0 ? '#4A6A8A' : '#A8C4E0',
            fontWeight: 700, fontSize: 14,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setActive(i => Math.min(screens.length - 1, i + 1))}
          disabled={active === screens.length - 1}
          style={{
            padding: '10px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: active === screens.length - 1 ? '#1A2E4A' : '#FF7A1A',
            color: active === screens.length - 1 ? '#4A6A8A' : '#fff',
            fontWeight: 700, fontSize: 14,
            boxShadow: active === screens.length - 1 ? 'none' : '0 0 12px rgba(255,122,26,0.4)',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
