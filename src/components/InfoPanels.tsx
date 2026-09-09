import React from 'react';
import type { BaseStation, User, HistoryPoint } from '../types';
import { MiniSparkline } from './LiveCharts';

const BS_STATE_COLOR: Record<string, string> = {
  active: '#00d4ff', 'high-load': '#ef4444', 'low-load': '#00ff88', sleep: '#334155',
};

interface BSPanelProps {
  bs: BaseStation;
  history: HistoryPoint[];
  onClose: () => void;
}

export function BSInfoPanel({ bs, history, onClose }: BSPanelProps) {
  const rows = [
    { label: 'State', value: bs.state.toUpperCase(), color: BS_STATE_COLOR[bs.state] },
    { label: 'Tx Power', value: `${bs.energy.toFixed(2)} kW` },
    { label: 'Load', value: `${(bs.load * 100).toFixed(1)}%` },
    { label: 'Connected Users', value: String(bs.connectedUsers.length) },
    { label: 'Energy Consumption', value: `${bs.energy.toFixed(2)} kW` },
    { label: 'Coverage Radius', value: `${bs.coverageRadius} m (norm.)` },
    { label: 'Avg SINR', value: `${bs.sinr.toFixed(1)} dB` },
    { label: 'Throughput', value: `${bs.throughput.toFixed(0)} Mbps` },
    { label: 'DRL Action', value: bs.drlAction, color: '#00d4ff' },
    { label: 'Current Reward', value: `${bs.reward > 0 ? '+' : ''}${bs.reward.toFixed(1)}`, color: bs.reward > 0 ? '#00ff88' : '#ef4444' },
  ];

  return (
    <div className="panel animate-slide-in" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 220, zIndex: 10, overflowY: 'auto' }}>
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center' }}>
        <span>{bs.id} DETAILS</span>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>
      <div style={{ padding: '8px 12px' }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #0e2a4233' }}>
            <span style={{ fontSize: 10, color: '#64748b' }}>{r.label}</span>
            <span className="font-mono" style={{ fontSize: 10, color: r.color ?? '#cbd5e1' }}>{r.value}</span>
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'Space Mono', marginBottom: 4 }}>ENERGY TREND</div>
          <MiniSparkline data={history} dataKey="energy" color="#ef4444" />
        </div>
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'Space Mono', marginBottom: 4 }}>THROUGHPUT TREND</div>
          <MiniSparkline data={history} dataKey="throughput" color="#a78bfa" />
        </div>
      </div>
    </div>
  );
}

interface UserPanelProps {
  user: User;
  onClose: () => void;
}

export function UserInfoPanel({ user, onClose }: UserPanelProps) {
  const qosColor = user.qosStatus === 'satisfied' ? '#00ff88' : user.qosStatus === 'degraded' ? '#f59e0b' : '#ef4444';
  const rows = [
    { label: 'Position', value: `(${Math.round(user.x)}, ${Math.round(user.y)})` },
    { label: 'Connected BS', value: user.connectedBS ?? 'NONE', color: user.connectedBS ? '#00d4ff' : '#ef4444' },
    { label: 'Traffic Demand', value: `${user.trafficDemand.toFixed(1)} Mbps` },
    { label: 'SINR', value: `${user.sinr.toFixed(1)} dB` },
    { label: 'Data Rate', value: `${user.dataRate.toFixed(0)} Mbps` },
    { label: 'QoS Status', value: user.qosStatus.toUpperCase(), color: qosColor },
  ];

  return (
    <div className="panel animate-slide-in" style={{ position: 'absolute', right: 0, top: 0, width: 200, zIndex: 10 }}>
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center' }}>
        <span>{user.id} DETAILS</span>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}>✕</button>
      </div>
      <div style={{ padding: '8px 12px' }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #0e2a4233' }}>
            <span style={{ fontSize: 10, color: '#64748b' }}>{r.label}</span>
            <span className="font-mono" style={{ fontSize: 10, color: r.color ?? '#cbd5e1' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
