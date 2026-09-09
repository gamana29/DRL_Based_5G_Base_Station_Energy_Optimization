import React from 'react';
import type { SimState } from '../types';

type Page = 'simulation' | 'drl' | 'architecture' | 'model' | 'results';

interface Props {
  page: Page;
  onNavigate: (p: Page) => void;
  state: SimState;
}

const TABS: { key: Page; label: string }[] = [
  { key: 'simulation', label: 'NETWORK SIMULATION' },
  { key: 'drl', label: 'DRL ENGINE' },
  { key: 'architecture', label: 'ARCHITECTURE' },
  { key: 'model', label: 'MODEL' },
  { key: 'results', label: 'RESULTS' },
];

export function Nav({ page, onNavigate, state }: Props) {
  const simTime = `${String(Math.floor(state.time / 60)).padStart(2, '0')}:${String(state.time % 60).padStart(2, '0')}`;

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      background: '#020c18',
      borderBottom: '1px solid #0e2a42',
      padding: '0 12px',
      gap: 0,
      flexShrink: 0,
      height: 44,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20, flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <polygon points="12,2 22,8 22,16 12,22 2,16 2,8" fill="none" stroke="#00d4ff" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="#00d4ff" />
          <line x1="12" y1="2" x2="12" y2="9" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
          <line x1="12" y1="15" x2="12" y2="22" stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
        </svg>
        <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          5G DRL OPT
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`nav-tab${page === tab.key ? ' active' : ''}`}
            onClick={() => onNavigate(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: state.running ? '#00ff88' : '#334155',
            boxShadow: state.running ? '0 0 6px #00ff88' : 'none',
            animation: state.running ? 'blink 1.2s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 9, fontFamily: 'Space Mono', color: state.running ? '#00ff88' : '#64748b' }}>
            {state.running ? 'SYSTEM ONLINE' : 'SYSTEM IDLE'}
          </span>
        </div>

        {[
          { label: 'Time', value: simTime },
          { label: 'Env', value: '5G RAN' },
          { label: 'Agent', value: 'DRL' },
          { label: 'Opt', value: 'ENERGY' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', gap: 4, alignItems: 'baseline' }}>
            <span style={{ fontSize: 8.5, color: '#334155', fontFamily: 'Space Mono' }}>{item.label}:</span>
            <span className="font-mono" style={{ fontSize: 9, color: '#94a3b8' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}
