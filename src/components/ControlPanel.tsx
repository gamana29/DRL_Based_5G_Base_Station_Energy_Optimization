import React from 'react';
import type { SimControls } from '../types';

interface Props {
  controls: SimControls;
  running: boolean;
  onUpdate: (u: Partial<SimControls>) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const SPEEDS: SimControls['speed'][] = [0.5, 1, 2, 5];
const TRAFFIC: SimControls['trafficLoad'][] = ['low', 'medium', 'high'];
const OBJECTIVES: { key: SimControls['objective']; label: string }[] = [
  { key: 'energy', label: 'Energy Saving' },
  { key: 'qos', label: 'QoS Priority' },
  { key: 'balanced', label: 'Balanced' },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
      {children}
    </div>
  );
}

function BtnGroup<T extends string | number>({ options, value, onSelect, labelFn }: {
  options: T[]; value: T; onSelect: (v: T) => void; labelFn?: (v: T) => string;
}) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {options.map(opt => (
        <button
          key={String(opt)}
          className={`btn-primary${value === opt ? ' active' : ''}`}
          style={{ flex: 1, padding: '4px 0', fontSize: 11 }}
          onClick={() => onSelect(opt)}
        >
          {labelFn ? labelFn(opt) : String(opt)}
        </button>
      ))}
    </div>
  );
}

export function ControlPanel({ controls, running, onUpdate, onStart, onStop, onReset }: Props) {
  return (
    <div className="panel" style={{ padding: '0 0 8px' }}>
      <div className="panel-header">SIMULATION CONTROLS</div>
      <div style={{ padding: '12px 12px 4px' }}>

        {/* Start/Stop */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <button
            className="btn-primary"
            style={{ flex: 2, padding: '8px 0', fontSize: 13, background: running ? '#00d4ff' : '#00d4ff22', color: running ? '#020c18' : '#00d4ff' }}
            onClick={running ? onStop : onStart}
          >
            {running ? '⏹ STOP' : '▶ START SIMULATION'}
          </button>
          <button className="btn-danger" style={{ flex: 1, padding: '8px 0', fontSize: 11 }} onClick={onReset}>
            RESET
          </button>
        </div>

        <Row label="Traffic Load">
          <BtnGroup
            options={TRAFFIC}
            value={controls.trafficLoad}
            onSelect={v => onUpdate({ trafficLoad: v })}
            labelFn={v => v.charAt(0).toUpperCase() + v.slice(1)}
          />
        </Row>

        <Row label={`Users: ${controls.userCount}`}>
          <input
            type="range" min="10" max="100" step="5"
            value={controls.userCount}
            onChange={e => onUpdate({ userCount: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <span style={{ fontSize: 9, color: '#334155', fontFamily: 'Space Mono' }}>10</span>
            <span style={{ fontSize: 9, color: '#334155', fontFamily: 'Space Mono' }}>100</span>
          </div>
        </Row>

        <Row label="Simulation Speed">
          <BtnGroup
            options={SPEEDS}
            value={controls.speed}
            onSelect={v => onUpdate({ speed: v })}
            labelFn={v => `${v}x`}
          />
        </Row>

        <Row label="DRL Mode">
          <div style={{ display: 'flex', gap: 4 }}>
            {[true, false].map(v => (
              <button
                key={String(v)}
                className={`btn-primary${controls.drlEnabled === v ? ' active' : ''}`}
                style={{ flex: 1, padding: '4px 0', fontSize: 11 }}
                onClick={() => onUpdate({ drlEnabled: v })}
              >
                {v ? 'DRL ON' : 'CONVENTIONAL'}
              </button>
            ))}
          </div>
        </Row>

        <Row label="Optimization Objective">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {OBJECTIVES.map(obj => (
              <button
                key={obj.key}
                className={`btn-primary${controls.objective === obj.key ? ' active' : ''}`}
                style={{ padding: '4px 8px', fontSize: 11, textAlign: 'left' }}
                onClick={() => onUpdate({ objective: obj.key })}
              >
                {obj.label}
              </button>
            ))}
          </div>
        </Row>
      </div>
    </div>
  );
}
