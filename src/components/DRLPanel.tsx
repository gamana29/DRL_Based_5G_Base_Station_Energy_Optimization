import React from 'react';
import type { BaseStation, Metrics, SimControls } from '../types';

interface Props {
  metrics: Metrics;
  baseStations: BaseStation[];
  controls: SimControls;
  running: boolean;
}

const PIPELINE = [
  'Network State',
  'State Representation',
  'DRL Agent',
  'Action Selection',
  'BS Control',
  'Network Reward',
];

const ACTIONS = ['Keep BS Active', 'Put BS to Sleep', 'Wake BS', 'Adjust Tx Power'];

export function DRLPanel({ metrics, baseStations, controls, running }: Props) {
  const activeBSs = baseStations.filter(b => b.state !== 'sleep');
  const conUsers = baseStations.reduce((a, b) => a + b.connectedUsers.length, 0);
  const avgLoad = activeBSs.length ? activeBSs.reduce((a, b) => a + b.load, 0) / activeBSs.length : 0;

  const stateVars = [
    { label: 'Active BSs', value: `${metrics.activeBSCount} / 7` },
    { label: 'User Density', value: `${conUsers} UEs` },
    { label: 'Traffic Load', value: controls.trafficLoad.toUpperCase() },
    { label: 'Avg SINR', value: `${metrics.avgSINR.toFixed(1)} dB` },
    { label: 'Avg Throughput', value: `${metrics.avgThroughput.toFixed(0)} Mbps` },
    { label: 'Energy', value: `${metrics.totalEnergy.toFixed(1)} kW` },
    { label: 'QoS Violation', value: `${(100 - metrics.qosSatisfaction).toFixed(1)}%` },
  ];

  const rewardQoS = (metrics.qosSatisfaction / 100 * 50).toFixed(1);
  const rewardEnergy = (metrics.totalEnergy / 56 * 30).toFixed(1);
  const rewardCoverage = ((100 - metrics.qosSatisfaction) / 100 * 15).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', overflow: 'auto' }}>

      {/* DRL Mode indicator */}
      <div className="panel" style={{ padding: '8px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: controls.drlEnabled ? '#00ff88' : '#334155',
            boxShadow: controls.drlEnabled ? '0 0 6px #00ff88' : 'none',
            animation: controls.drlEnabled && running ? 'blink 1.2s ease-in-out infinite' : 'none',
          }} />
          <span className="font-display" style={{ fontSize: 11, letterSpacing: '0.1em', color: controls.drlEnabled ? '#00ff88' : '#64748b' }}>
            DRL {controls.drlEnabled ? 'ONLINE' : 'OFFLINE'}
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: 'Space Mono', fontSize: 10, color: '#64748b' }}>
            {controls.objective.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Pipeline */}
      <div className="panel" style={{ flex: 'none' }}>
        <div className="panel-header">DRL DECISION ENGINE</div>
        <div style={{ padding: '8px 12px' }}>
          {PIPELINE.map((step, i) => (
            <React.Fragment key={step}>
              <div style={{
                padding: '5px 10px',
                background: i === 2 ? '#00d4ff18' : 'transparent',
                border: i === 2 ? '1px solid #00d4ff44' : '1px solid transparent',
                borderRadius: 2,
                fontFamily: i === 2 ? 'Rajdhani' : 'Inter',
                fontWeight: i === 2 ? 700 : 400,
                fontSize: i === 2 ? 12 : 11,
                color: i === 2 ? '#00d4ff' : '#94a3b8',
                letterSpacing: i === 2 ? '0.06em' : 0,
              }}>
                {step}
              </div>
              {i < PIPELINE.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                  <svg width="16" height="12">
                    <line x1="8" y1="0" x2="8" y2="8" stroke="#00d4ff" strokeWidth="1.5"
                      style={running ? { animation: 'flow 1s linear infinite' } : undefined}
                      strokeDasharray={running ? '4 2' : undefined} />
                    <polygon points="4,7 8,12 12,7" fill="#00d4ff" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* State variables */}
      <div className="panel" style={{ flex: 'none' }}>
        <div className="panel-header">STATE VECTOR S(t)</div>
        <div style={{ padding: '6px 12px' }}>
          {stateVars.map(v => (
            <div key={v.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: '1px solid #0e2a4244' }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>{v.label}</span>
              <span className="font-mono" style={{ fontSize: 10, color: '#cbd5e1' }}>{v.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="panel" style={{ flex: 'none' }}>
        <div className="panel-header">ACTION SPACE A</div>
        <div style={{ padding: '6px 12px' }}>
          {ACTIONS.map((a, i) => {
            const recentAction = baseStations.find(bs => bs.drlAction.toLowerCase().includes(a.toLowerCase().split(' ')[0]))?.drlAction;
            const isActive = !!recentAction;
            return (
              <div key={a} style={{
                padding: '4px 8px', marginBottom: 4,
                background: isActive && running ? '#00d4ff12' : '#020c18',
                border: `1px solid ${isActive && running ? '#00d4ff44' : '#0e2a42'}`,
                borderRadius: 2,
                fontSize: 10,
                color: isActive && running ? '#00d4ff' : '#64748b',
                fontFamily: 'Space Mono',
                transition: 'all 0.3s',
              }}>
                {isActive && running ? `▶ ${a}` : `○ ${a}`}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reward breakdown */}
      <div className="panel" style={{ flex: 'none' }}>
        <div className="panel-header">REWARD FUNCTION R(t)</div>
        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#64748b', marginBottom: 8, lineHeight: 1.6 }}>
            R = QoS − Energy − Coverage_Penalty
          </div>
          {[
            { label: '+ QoS Satisfaction', value: `+${rewardQoS}`, color: '#00ff88' },
            { label: '− Energy Cost', value: `-${rewardEnergy}`, color: '#ef4444' },
            { label: '− Coverage Penalty', value: `-${rewardCoverage}`, color: '#f59e0b' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #0e2a4244' }}>
              <span style={{ fontSize: 10, color: '#64748b' }}>{item.label}</span>
              <span className="font-mono" style={{ fontSize: 10, color: item.color }}>{item.value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0 2px', marginTop: 4, borderTop: '1px solid #0e2a42' }}>
            <span style={{ fontSize: 11, fontFamily: 'Rajdhani', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.06em' }}>TOTAL REWARD</span>
            <span className="font-mono" style={{ fontSize: 12, color: metrics.drlReward > 0 ? '#00d4ff' : '#ef4444', fontWeight: 700 }}>
              {metrics.drlReward > 0 ? '+' : ''}{metrics.drlReward.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* BS decisions */}
      <div className="panel" style={{ flex: 1 }}>
        <div className="panel-header">BS DECISIONS</div>
        <div style={{ padding: '6px 12px', overflow: 'auto' }}>
          {baseStations.map(bs => (
            <div key={bs.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', borderBottom: '1px solid #0e2a4233' }}>
              <span className="font-mono" style={{ fontSize: 9, color: '#64748b', width: 36 }}>{bs.id}</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: bs.state === 'sleep' ? '#334155' : bs.state === 'high-load' ? '#ef4444' : bs.state === 'low-load' ? '#00ff88' : '#00d4ff', flexShrink: 0 }} />
              <span style={{ fontSize: 9, color: '#94a3b8', flex: 1, fontFamily: 'Space Mono', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bs.drlAction}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
