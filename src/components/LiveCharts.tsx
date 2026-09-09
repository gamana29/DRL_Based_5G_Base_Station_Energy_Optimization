import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid,
} from 'recharts';
import type { HistoryPoint } from '../types';

interface Props {
  history: HistoryPoint[];
}

const CHARTS = [
  { key: 'energy',    label: 'Energy (kW)',        color: '#ef4444', domain: [0, 60] as [number, number] },
  { key: 'activeBSs', label: 'Active BSs',          color: '#00d4ff', domain: [0, 7] as [number, number] },
  { key: 'throughput',label: 'Throughput (Mbps)',   color: '#a78bfa', domain: [0, 300] as [number, number] },
  { key: 'qos',       label: 'QoS Satisfaction (%)',color: '#00ff88', domain: [0, 100] as [number, number] },
  { key: 'reward',    label: 'DRL Reward',           color: '#f59e0b', domain: [-20, 120] as [number, number] },
  { key: 'traffic',   label: 'Traffic Load (Gbps)', color: '#64748b', domain: [0, 5] as [number, number] },
] as const;

function MiniChart({ data, dataKey, color, domain }: {
  data: HistoryPoint[]; dataKey: keyof HistoryPoint; color: string; domain: [number, number];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 2, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#0e2a42" vertical={false} />
        <XAxis dataKey="t" hide />
        <YAxis domain={domain} tick={{ fontSize: 8, fill: '#334155', fontFamily: 'Space Mono' }} tickCount={3} />
        <Tooltip
          contentStyle={{ background: '#04111f', border: '1px solid #0e2a42', borderRadius: 2, fontFamily: 'Space Mono', fontSize: 9 }}
          labelStyle={{ color: '#64748b' }}
          itemStyle={{ color }}
          formatter={(v) => [typeof v === 'number' ? v.toFixed(1) : v, '']}
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LiveCharts({ history }: Props) {
  const [active, setActive] = useState<string>('energy');
  const recent = history.slice(-60);

  return (
    <div className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}>
        <span style={{ marginRight: 12 }}>LIVE TELEMETRY</span>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {CHARTS.map(c => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              style={{
                padding: '2px 8px', fontSize: 9, fontFamily: 'Space Mono',
                background: active === c.key ? `${c.color}22` : 'transparent',
                border: `1px solid ${active === c.key ? c.color : '#0e2a42'}`,
                color: active === c.key ? c.color : '#64748b',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {c.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
      {CHARTS.map(c => (
        <div key={c.key} style={{ height: 120, padding: '8px 4px', display: active === c.key ? 'block' : 'none' }}>
          <div style={{ fontSize: 9, color: c.color, fontFamily: 'Space Mono', marginBottom: 4, paddingLeft: 8 }}>{c.label}</div>
          {recent.length > 1
            ? <MiniChart data={recent} dataKey={c.key as keyof HistoryPoint} color={c.color} domain={c.domain} />
            : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80, color: '#334155', fontSize: 10, fontFamily: 'Space Mono' }}>Awaiting data…</div>
          }
        </div>
      ))}
    </div>
  );
}

export function MiniSparkline({ data, dataKey, color }: { data: HistoryPoint[]; dataKey: keyof HistoryPoint; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data.slice(-30)} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
