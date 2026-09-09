import React from 'react';
import type { SimState, SimControls } from '../types';
import { DRLPanel } from '../components/DRLPanel';
import { LiveCharts } from '../components/LiveCharts';
import { EventLog } from '../components/EventLog';

interface Props {
  state: SimState;
  controls: SimControls;
}

export function DRLEngine({ state, controls }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, height: '100%', overflow: 'hidden', padding: 10 }}>
      <div style={{ width: 260, flexShrink: 0, overflow: 'auto' }}>
        <DRLPanel metrics={state.metrics} baseStations={state.baseStations} controls={controls} running={state.running} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        {/* DRL training status */}
        <div className="panel">
          <div className="panel-header">DRL AGENT STATUS</div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Episode', value: state.running ? `${Math.floor(state.time / 30) + 1}` : '—', color: '#00d4ff' },
              { label: 'Steps', value: state.running ? `${state.time * 7}` : '—', color: '#a78bfa' },
              { label: 'Exploration ε', value: state.running ? `${Math.max(0.01, 0.3 - state.time * 0.001).toFixed(3)}` : '—', color: '#f59e0b' },
              { label: 'Avg Reward', value: state.history.length > 5 ? `${(state.history.slice(-10).reduce((a, h) => a + h.reward, 0) / Math.min(10, state.history.length)).toFixed(1)}` : '—', color: '#00ff88' },
            ].map(item => (
              <div key={item.label} className="kpi-card">
                <div style={{ fontSize: 8.5, color: '#64748b', fontFamily: 'Space Mono', marginBottom: 4 }}>{item.label}</div>
                <div className="font-mono" style={{ fontSize: 20, color: item.color, fontWeight: 700 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <LiveCharts history={state.history} />
        </div>

        <div style={{ height: 180 }}>
          <EventLog events={state.events} />
        </div>
      </div>
    </div>
  );
}
