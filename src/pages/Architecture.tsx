import React from 'react';

const ARCH_NODES = [
  { label: '5G USERS', sub: 'UE Devices', color: '#a78bfa', icon: '📱' },
  { label: 'TRAFFIC GENERATOR', sub: 'Demand Model', color: '#64748b', icon: '📊' },
  { label: '5G BASE STATIONS', sub: '7× gNB', color: '#00d4ff', icon: '📡' },
  { label: 'NETWORK ENVIRONMENT', sub: 'State Space', color: '#0088aa', icon: '🌐' },
  { label: 'STATE OBSERVATION', sub: 'S = {load, SINR, UE density…}', color: '#334155', icon: '👁' },
  { label: 'DRL AGENT', sub: 'Deep Q-Network', color: '#00d4ff', icon: '🤖', highlight: true },
  { label: 'ACTION OUTPUT', sub: 'A = {ON, SLEEP, WAKE, POWER}', color: '#f59e0b', icon: '⚡' },
  { label: 'BS ON/OFF + POWER', sub: 'Control Execution', color: '#00d4ff', icon: '🔧' },
  { label: 'NETWORK RESPONSE', sub: 'Updated State S\'', color: '#0088aa', icon: '📶' },
  { label: 'REWARD COMPUTATION', sub: 'R = QoS − Energy − Penalty', color: '#00ff88', icon: '💯' },
  { label: 'DRL TRAINING', sub: 'Experience Replay + Update', color: '#ef4444', icon: '🧠' },
];

export function Architecture() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', overflowY: 'auto', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em', margin: 0 }}>
          SYSTEM ARCHITECTURE
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, fontFamily: 'Space Mono', marginTop: 8 }}>
          End-to-end DRL pipeline for 5G base station energy optimization
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {ARCH_NODES.map((node, i) => (
          <React.Fragment key={node.label}>
            <div style={{
              width: '100%', maxWidth: 460,
              padding: '12px 20px',
              background: node.highlight ? '#00d4ff18' : '#04111f',
              border: `1px solid ${node.highlight ? '#00d4ff' : node.color + '44'}`,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              boxShadow: node.highlight ? '0 0 20px #00d4ff22' : 'none',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${node.color}18`, border: `1px solid ${node.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                {node.icon}
              </div>
              <div>
                <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: node.highlight ? '#00d4ff' : '#cbd5e1', letterSpacing: '0.06em' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'Space Mono', marginTop: 2 }}>
                  {node.sub}
                </div>
              </div>
              {node.highlight && (
                <div style={{ marginLeft: 'auto', fontFamily: 'Space Mono', fontSize: 9, color: '#00d4ff', border: '1px solid #00d4ff44', padding: '2px 8px' }}>
                  CORE
                </div>
              )}
            </div>
            {i < ARCH_NODES.length - 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0' }}>
                <div style={{
                  width: 1, height: 20,
                  background: `linear-gradient(to bottom, ${node.color}88, ${ARCH_NODES[i+1].color}88)`,
                  animation: 'arch-flow 2s ease-in-out infinite',
                }} />
                <svg width="12" height="8" style={{ marginTop: -2 }}>
                  <polygon points="0,0 12,0 6,8" fill={ARCH_NODES[i+1].color} opacity="0.6" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Side explanation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 40 }}>
        {[
          { title: 'STATE SPACE', items: ['Number of active BSs', 'User density per cell', 'Traffic load per BS', 'Average SINR', 'QoS violation rate', 'Energy consumption'] },
          { title: 'ACTION SPACE', items: ['Turn BS ON (wake from sleep)', 'Put BS to SLEEP', 'Keep BS ACTIVE', 'Adjust Transmission Power'] },
          { title: 'REWARD SIGNAL', items: ['+ QoS satisfaction rate', '+ Coverage maintained', '− Energy consumption', '− Coverage penalty', '− QoS violations'] },
          { title: 'DRL ALGORITHM', items: ['Deep Q-Network (DQN)', 'Experience replay buffer', 'Target network updates', 'ε-greedy exploration', 'Batch gradient descent'] },
        ].map(box => (
          <div key={box.title} className="panel">
            <div className="panel-header">{box.title}</div>
            <ul style={{ margin: 0, padding: '8px 12px', listStyle: 'none' }}>
              {box.items.map(item => (
                <li key={item} style={{ fontSize: 11, color: '#94a3b8', padding: '3px 0', borderBottom: '1px solid #0e2a4233', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#00d4ff', fontSize: 8 }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
