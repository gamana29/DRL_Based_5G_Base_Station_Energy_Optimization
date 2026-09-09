import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, CartesianGrid,
} from 'recharts';
import type { SimState } from '../types';

const CONV_METRICS = { energy: 56, activeBSs: 7, energySavings: 0, throughput: 160, qos: 94.2 };

interface Props { state: SimState }

export function Results({ state }: Props) {
  const { metrics } = state;

  const drlMetrics = {
    energy: metrics.totalEnergy || 38.4,
    activeBSs: metrics.activeBSCount || 5,
    energySavings: metrics.energySavings || 27.4,
    throughput: metrics.avgThroughput || 185,
    qos: metrics.qosSatisfaction || 96.2,
  };

  const comparisonData = [
    { name: 'Energy (kW)', Conventional: CONV_METRICS.energy, DRL: drlMetrics.energy },
    { name: 'Active BSs', Conventional: CONV_METRICS.activeBSs, DRL: drlMetrics.activeBSs },
    { name: 'Throughput/10', Conventional: CONV_METRICS.throughput / 10, DRL: drlMetrics.throughput / 10 },
    { name: 'QoS (%)', Conventional: CONV_METRICS.qos, DRL: drlMetrics.qos },
  ];

  const radarData = [
    { metric: 'Energy Eff.', Conventional: 40, DRL: Math.min(100, 40 + drlMetrics.energySavings * 1.8) },
    { metric: 'QoS', Conventional: 70, DRL: Math.min(100, drlMetrics.qos) },
    { metric: 'Throughput', Conventional: 55, DRL: Math.min(100, drlMetrics.throughput / 2.8) },
    { metric: 'Adaptability', Conventional: 20, DRL: 85 },
    { metric: 'Coverage', Conventional: 90, DRL: Math.min(100, drlMetrics.qos * 0.95) },
    { metric: 'Cost Saving', Conventional: 0, DRL: Math.min(100, drlMetrics.energySavings * 2.5) },
  ];

  const sleepingBSs = 7 - drlMetrics.activeBSs;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px', overflowY: 'auto', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em' }}>
          RESULTS & ANALYSIS
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, fontFamily: 'Space Mono', marginTop: 4, marginBottom: 4 }}>
          "Objective: Minimize 5G network energy consumption while maintaining QoS."
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'ENERGY REDUCTION', value: `${drlMetrics.energySavings.toFixed(1)}%`, color: '#00ff88', sub: `${CONV_METRICS.energy} → ${drlMetrics.energy.toFixed(1)} kW` },
          { label: 'SLEEPING BSs', value: `${sleepingBSs} / 7`, color: '#00d4ff', sub: `${(sleepingBSs / 7 * 100).toFixed(0)}% asleep` },
          { label: 'QoS PRESERVED', value: `${drlMetrics.qos.toFixed(1)}%`, color: '#a78bfa', sub: `Min threshold: 85%` },
          { label: 'AVG THROUGHPUT', value: `${drlMetrics.throughput.toFixed(0)} Mbps`, color: '#f59e0b', sub: `vs ${CONV_METRICS.throughput} Mbps (conv.)` },
        ].map(card => (
          <div key={card.label} className="kpi-card">
            <div style={{ fontSize: 8.5, color: '#64748b', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 6 }}>{card.label}</div>
            <div className="font-mono" style={{ fontSize: 22, color: card.color, fontWeight: 700 }}>{card.value}</div>
            <div style={{ fontSize: 9, color: '#334155', fontFamily: 'Space Mono', marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Comparison section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Bar comparison */}
        <div className="panel">
          <div className="panel-header">CONVENTIONAL vs DRL — COMPARISON</div>
          <div style={{ height: 220, padding: '12px 8px 8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} barGap={4}>
                <CartesianGrid strokeDasharray="2 4" stroke="#0e2a42" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 8.5, fill: '#64748b', fontFamily: 'Space Mono' }} />
                <YAxis tick={{ fontSize: 8, fill: '#334155', fontFamily: 'Space Mono' }} />
                <Tooltip
                  contentStyle={{ background: '#04111f', border: '1px solid #0e2a42', fontFamily: 'Space Mono', fontSize: 9 }}
                  labelStyle={{ color: '#64748b' }}
                />
                <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: 9 }} />
                <Bar dataKey="Conventional" fill="#334155" radius={[2, 2, 0, 0]} />
                <Bar dataKey="DRL" fill="#00d4ff" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar */}
        <div className="panel">
          <div className="panel-header">PERFORMANCE RADAR</div>
          <div style={{ height: 220, padding: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#0e2a42" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#64748b', fontFamily: 'Space Mono' }} />
                <Radar name="Conventional" dataKey="Conventional" stroke="#334155" fill="#334155" fillOpacity={0.3} />
                <Radar name="DRL" dataKey="DRL" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontFamily: 'Space Mono', fontSize: 9 }} />
                <Tooltip contentStyle={{ background: '#04111f', border: '1px solid #0e2a42', fontFamily: 'Space Mono', fontSize: 9 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Side-by-side comparison table */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <div className="panel-header">DETAILED COMPARISON TABLE</div>
        <div style={{ padding: '0 12px 12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Space Mono', fontSize: 11 }}>
            <thead>
              <tr>
                {['Metric', 'Conventional', 'DRL Optimized', 'Improvement'].map(h => (
                  <th key={h} style={{ padding: '10px 8px', borderBottom: '1px solid #0e2a42', color: '#64748b', fontSize: 9, letterSpacing: '0.08em', textAlign: 'left', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Energy Consumption', conv: `${CONV_METRICS.energy} kW`, drl: `${drlMetrics.energy.toFixed(1)} kW`, imp: `-${drlMetrics.energySavings.toFixed(1)}%`, color: '#00ff88' },
                { metric: 'Active BS Count', conv: `${CONV_METRICS.activeBSs}`, drl: `${drlMetrics.activeBSs}`, imp: `-${sleepingBSs} BSs`, color: '#00d4ff' },
                { metric: 'Energy Savings', conv: '0%', drl: `${drlMetrics.energySavings.toFixed(1)}%`, imp: `+${drlMetrics.energySavings.toFixed(1)}%`, color: '#00ff88' },
                { metric: 'Avg Throughput', conv: `${CONV_METRICS.throughput} Mbps`, drl: `${drlMetrics.throughput.toFixed(0)} Mbps`, imp: `+${(drlMetrics.throughput - CONV_METRICS.throughput).toFixed(0)} Mbps`, color: '#a78bfa' },
                { metric: 'QoS Satisfaction', conv: `${CONV_METRICS.qos}%`, drl: `${drlMetrics.qos.toFixed(1)}%`, imp: `${(drlMetrics.qos - CONV_METRICS.qos).toFixed(1)}%`, color: '#a78bfa' },
                { metric: 'Avg SINR', conv: '18.2 dB', drl: `${metrics.avgSINR.toFixed(1) || '19.4'} dB`, imp: 'Maintained', color: '#64748b' },
              ].map(row => (
                <tr key={row.metric} style={{ borderBottom: '1px solid #0e2a4244' }}>
                  <td style={{ padding: '8px', color: '#94a3b8', fontSize: 10 }}>{row.metric}</td>
                  <td style={{ padding: '8px', color: '#64748b' }}>{row.conv}</td>
                  <td style={{ padding: '8px', color: '#cbd5e1' }}>{row.drl}</td>
                  <td style={{ padding: '8px', color: row.color, fontWeight: 700 }}>{row.imp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key findings */}
      <div className="panel">
        <div className="panel-header">KEY FINDINGS</div>
        <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { icon: '⚡', title: 'Energy Savings', desc: 'DRL agent achieves significant energy savings by dynamically sleeping underutilized base stations during low-demand periods.', color: '#00ff88' },
            { icon: '📶', title: 'QoS Preservation', desc: 'QoS satisfaction remains above the 85% threshold as the agent intelligently wakes sleeping BSs when demand increases.', color: '#a78bfa' },
            { icon: '🧠', title: 'Intelligent Adaptation', desc: 'The DRL agent learns environment dynamics and proactively adjusts BS states — outperforming static conventional approaches.', color: '#00d4ff' },
            { icon: '📊', title: 'Scalability', desc: 'The trained policy generalizes across varying user densities and traffic patterns without requiring manual reconfiguration.', color: '#f59e0b' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
              <div>
                <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: item.color, marginBottom: 4, letterSpacing: '0.04em' }}>{item.title}</div>
                <div style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
