import React, { useMemo } from 'react';
import type { BaseStation, User } from '../types';

interface Props {
  baseStations: BaseStation[];
  users: User[];
  running: boolean;
  onBSClick: (bs: BaseStation) => void;
  onUserClick: (u: User) => void;
  selectedBS?: string | null;
  selectedUser?: string | null;
}

const BS_COLORS = {
  active:    '#00d4ff',
  'high-load': '#ef4444',
  'low-load':  '#00ff88',
  sleep:     '#334155',
};

const BS_GLOW = {
  active:    '0 0 12px #00d4ff66',
  'high-load': '0 0 14px #ef444466',
  'low-load':  '0 0 10px #00ff8844',
  sleep:     'none',
};

function TowerIcon({ x, y, state, selected, onClick }: {
  x: number; y: number; state: BaseStation['state']; selected: boolean; onClick: () => void;
}) {
  const color = BS_COLORS[state];
  const isSleep = state === 'sleep';

  return (
    <g
      transform={`translate(${x},${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      opacity={isSleep ? 0.35 : 1}
    >
      {/* Tower base */}
      <polygon points="0,-18 -6,10 6,10" fill={color} opacity={0.9} />
      <rect x="-8" y="10" width="16" height="3" rx="1" fill={color} opacity={0.7} />
      {/* Dish */}
      <circle cx="0" cy="-22" r="4" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="0" y1="-18" x2="0" y2="-22" stroke={color} strokeWidth="1.2" />
      {/* Side arms */}
      <line x1="-6" y1="-10" x2="-12" y2="-6" stroke={color} strokeWidth="1" opacity={0.7} />
      <line x1="6"  y1="-10" x2="12"  y2="-6" stroke={color} strokeWidth="1" opacity={0.7} />
      {/* Selection ring */}
      {selected && <circle cx="0" cy="0" r="22" fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 2" />}
    </g>
  );
}

function RadioWaves({ x, y, state }: { x: number; y: number; state: BaseStation['state'] }) {
  if (state === 'sleep') return null;
  const color = BS_COLORS[state];
  return (
    <g transform={`translate(${x},${y})`} opacity={0.4}>
      {[0, 1, 2].map(i => (
        <circle key={i} cx="0" cy="0" r="0" fill="none" stroke={color} strokeWidth="1.2"
          style={{ animation: `radio-pulse 3s ease-out ${i}s infinite` }} />
      ))}
    </g>
  );
}

export function NetworkMap({ baseStations, users, running, onBSClick, onUserClick, selectedBS, selectedUser }: Props) {
  const bsById = useMemo(() => Object.fromEntries(baseStations.map(bs => [bs.id, bs])), [baseStations]);

  return (
    <svg
      viewBox="0 0 800 500"
      style={{ width: '100%', height: '100%', background: '#020c18' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0e2a42" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#030d1a" />
          <stop offset="100%" stopColor="#010810" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#bgGrad)" />
      <rect width="800" height="500" fill="url(#grid)" />

      {/* Coverage circles */}
      {baseStations.map(bs => {
        const color = BS_COLORS[bs.state];
        const isSleep = bs.state === 'sleep';
        return (
          <circle key={`cov-${bs.id}`}
            cx={bs.x} cy={bs.y} r={bs.coverageRadius}
            fill={isSleep ? 'transparent' : `${color}08`}
            stroke={isSleep ? '#334155' : color}
            strokeWidth={isSleep ? 0.5 : 1}
            strokeDasharray={isSleep ? '6 4' : undefined}
            opacity={isSleep ? 0.3 : 0.6}
          />
        );
      })}

      {/* Radio waves */}
      {running && baseStations.map(bs => <RadioWaves key={`rw-${bs.id}`} x={bs.x} y={bs.y} state={bs.state} />)}

      {/* Connection lines */}
      {users.map(u => {
        if (!u.connectedBS) return null;
        const bs = bsById[u.connectedBS];
        if (!bs || bs.state === 'sleep') return null;
        const color = u.qosStatus === 'satisfied' ? '#00d4ff' : u.qosStatus === 'degraded' ? '#f59e0b' : '#ef4444';
        return (
          <line key={`conn-${u.id}`}
            x1={u.x} y1={u.y} x2={bs.x} y2={bs.y}
            stroke={color} strokeWidth="0.8" opacity="0.25"
            strokeDasharray={running ? '6 4' : undefined}
            style={running ? { animation: 'flow 1.5s linear infinite' } : undefined}
          />
        );
      })}

      {/* Tower icons */}
      {baseStations.map(bs => (
        <TowerIcon
          key={bs.id}
          x={bs.x} y={bs.y}
          state={bs.state}
          selected={selectedBS === bs.id}
          onClick={() => onBSClick(bs)}
        />
      ))}

      {/* BS labels */}
      {baseStations.map(bs => (
        <text key={`lbl-${bs.id}`}
          x={bs.x} y={bs.y + 28}
          textAnchor="middle"
          fill={BS_COLORS[bs.state]}
          fontSize="8"
          fontFamily="'Space Mono', monospace"
          opacity={bs.state === 'sleep' ? 0.4 : 0.9}
        >
          {bs.id}
        </text>
      ))}

      {/* BS state badges */}
      {baseStations.map(bs => (
        <text key={`st-${bs.id}`}
          x={bs.x} y={bs.y + 37}
          textAnchor="middle"
          fill={BS_COLORS[bs.state]}
          fontSize="6.5"
          fontFamily="'Rajdhani', sans-serif"
          fontWeight="700"
          opacity={bs.state === 'sleep' ? 0.4 : 0.7}
          letterSpacing="0.08em"
        >
          {bs.state === 'high-load' ? 'HIGH LOAD' : bs.state === 'low-load' ? 'LOW LOAD' : bs.state.toUpperCase()}
        </text>
      ))}

      {/* Load bars */}
      {baseStations.filter(bs => bs.state !== 'sleep').map(bs => (
        <g key={`load-${bs.id}`} transform={`translate(${bs.x - 15},${bs.y + 40})`}>
          <rect width="30" height="3" rx="1.5" fill="#0e2a42" />
          <rect width={30 * bs.load} height="3" rx="1.5" fill={BS_COLORS[bs.state]} opacity="0.8" />
        </g>
      ))}

      {/* Users */}
      {users.map(u => {
        const color = u.qosStatus === 'satisfied' ? '#a78bfa' : u.qosStatus === 'degraded' ? '#f59e0b' : '#ef4444';
        const isSelected = selectedUser === u.id;
        return (
          <g key={u.id} transform={`translate(${u.x},${u.y})`} onClick={() => onUserClick(u)} style={{ cursor: 'pointer' }}>
            <circle cx="0" cy="0" r={isSelected ? 7 : 5} fill={color} opacity="0.85" />
            <circle cx="0" cy="0" r="3" fill="#020c18" opacity="0.6" />
            {isSelected && <circle cx="0" cy="0" r="9" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(10,10)">
        {[
          { label: 'ACTIVE', color: '#00d4ff' },
          { label: 'HIGH LOAD', color: '#ef4444' },
          { label: 'LOW LOAD', color: '#00ff88' },
          { label: 'SLEEP', color: '#334155' },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(0,${i * 14})`}>
            <rect width="8" height="8" rx="1" fill={item.color} opacity="0.8" />
            <text x="12" y="7" fill="#94a3b8" fontSize="7.5" fontFamily="'Space Mono', monospace">{item.label}</text>
          </g>
        ))}
      </g>

      {/* User legend */}
      <g transform="translate(10,80)">
        {[
          { label: 'SATISFIED', color: '#a78bfa' },
          { label: 'DEGRADED', color: '#f59e0b' },
          { label: 'VIOLATED', color: '#ef4444' },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(0,${i * 14})`}>
            <circle cx="4" cy="4" r="4" fill={item.color} opacity="0.8" />
            <text x="12" y="7" fill="#94a3b8" fontSize="7.5" fontFamily="'Space Mono', monospace">{item.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
