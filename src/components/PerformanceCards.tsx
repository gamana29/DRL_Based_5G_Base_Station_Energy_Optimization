import React from 'react';
import type { Metrics } from '../types';

interface Props {
  metrics: Metrics;
  running: boolean;
}

interface CardDef {
  label: string;
  value: string;
  sub?: string;
  color: string;
  pulse?: boolean;
}

export function PerformanceCards({ metrics, running }: Props) {
  const cards: CardDef[] = [
    {
      label: 'ACTIVE BASE STATIONS',
      value: `${metrics.activeBSCount} / 7`,
      color: '#00d4ff',
      pulse: running,
    },
    {
      label: 'TOTAL ENERGY',
      value: `${metrics.totalEnergy.toFixed(1)} kW`,
      sub: `Max: 56 kW`,
      color: metrics.totalEnergy < 35 ? '#00ff88' : metrics.totalEnergy < 50 ? '#f59e0b' : '#ef4444',
      pulse: running,
    },
    {
      label: 'ENERGY SAVINGS',
      value: `${metrics.energySavings.toFixed(1)}%`,
      color: metrics.energySavings > 20 ? '#00ff88' : metrics.energySavings > 10 ? '#f59e0b' : '#94a3b8',
      pulse: running && metrics.energySavings > 5,
    },
    {
      label: 'AVG THROUGHPUT',
      value: `${metrics.avgThroughput.toFixed(0)} Mbps`,
      color: '#a78bfa',
    },
    {
      label: 'AVERAGE SINR',
      value: `${metrics.avgSINR.toFixed(1)} dB`,
      color: metrics.avgSINR > 15 ? '#00ff88' : metrics.avgSINR > 8 ? '#f59e0b' : '#ef4444',
    },
    {
      label: 'QoS SATISFACTION',
      value: `${metrics.qosSatisfaction.toFixed(1)}%`,
      color: metrics.qosSatisfaction > 90 ? '#00ff88' : metrics.qosSatisfaction > 70 ? '#f59e0b' : '#ef4444',
    },
    {
      label: 'DRL REWARD',
      value: `${metrics.drlReward > 0 ? '+' : ''}${metrics.drlReward.toFixed(1)}`,
      color: metrics.drlReward > 0 ? '#00d4ff' : '#ef4444',
      pulse: running,
    },
  ];

  return (
    <div className="panel" style={{ padding: 0 }}>
      <div className="panel-header">PERFORMANCE METRICS</div>
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cards.map(card => (
          <div key={card.label} className="kpi-card">
            <div style={{ fontSize: 8.5, color: '#64748b', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 4, textTransform: 'uppercase' }}>
              {card.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="font-mono" style={{
                fontSize: 18,
                color: card.color,
                fontWeight: 700,
                animation: card.pulse && running ? 'none' : undefined,
                transition: 'color 0.5s',
              }}>
                {card.value}
              </span>
              {card.sub && (
                <span style={{ fontSize: 9, color: '#334155', fontFamily: 'Space Mono' }}>{card.sub}</span>
              )}
            </div>
            {/* mini bar for energy */}
            {card.label === 'TOTAL ENERGY' && (
              <div style={{ marginTop: 4, height: 2, background: '#0e2a42', borderRadius: 1 }}>
                <div style={{ height: 2, borderRadius: 1, background: card.color, width: `${(metrics.totalEnergy / 56) * 100}%`, transition: 'width 0.5s' }} />
              </div>
            )}
            {card.label === 'QoS SATISFACTION' && (
              <div style={{ marginTop: 4, height: 2, background: '#0e2a42', borderRadius: 1 }}>
                <div style={{ height: 2, borderRadius: 1, background: card.color, width: `${metrics.qosSatisfaction}%`, transition: 'width 0.5s' }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
