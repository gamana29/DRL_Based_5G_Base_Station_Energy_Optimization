import React from 'react';

function NeuralNet() {
  const layers = [
    { label: 'INPUT', nodes: 7, color: '#a78bfa' },
    { label: 'HIDDEN 1', nodes: 6, color: '#00d4ff' },
    { label: 'HIDDEN 2', nodes: 6, color: '#00d4ff' },
    { label: 'OUTPUT', nodes: 4, color: '#00ff88' },
  ];
  const W = 500, H = 260;
  const layerX = layers.map((_, i) => 60 + i * (W - 120) / (layers.length - 1));

  // Node positions
  const nodePositions = layers.map((layer, li) => {
    const spacing = (H - 40) / (layer.nodes + 1);
    return Array.from({ length: layer.nodes }, (_, ni) => ({
      x: layerX[li],
      y: 20 + spacing * (ni + 1),
    }));
  });

  const inputLabels = ['BS Count', 'UE Density', 'Traffic', 'SINR', 'Throughput', 'Energy', 'QoS Viol.'];
  const outputLabels = ['ON', 'SLEEP', 'WAKE', 'PWR CTRL'];

  return (
    <svg width={W} height={H} style={{ maxWidth: '100%' }}>
      <defs>
        <filter id="nodeGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Connections */}
      {nodePositions.slice(0, -1).map((layer, li) =>
        layer.map((from, fi) =>
          nodePositions[li + 1].map((to, ti) => (
            <line key={`${li}-${fi}-${ti}`}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={layers[li + 1].color}
              strokeWidth="0.4"
              opacity={0.2}
            />
          ))
        )
      )}

      {/* Nodes */}
      {nodePositions.map((layer, li) =>
        layer.map((pos, ni) => (
          <circle key={`${li}-${ni}`}
            cx={pos.x} cy={pos.y} r={7}
            fill={`${layers[li].color}22`}
            stroke={layers[li].color}
            strokeWidth="1.5"
            filter="url(#nodeGlow)"
            style={{ animation: `nn-pulse 2s ease-in-out ${(li * 0.3 + ni * 0.15) % 2}s infinite` }}
          />
        ))
      )}

      {/* Input labels */}
      {nodePositions[0].map((pos, ni) => (
        <text key={`in-${ni}`} x={pos.x - 14} y={pos.y + 4}
          textAnchor="end" fill="#64748b" fontSize="8" fontFamily="Space Mono">
          {inputLabels[ni]}
        </text>
      ))}

      {/* Output labels */}
      {nodePositions[3].map((pos, ni) => (
        <text key={`out-${ni}`} x={pos.x + 14} y={pos.y + 4}
          textAnchor="start" fill="#00ff88" fontSize="9" fontFamily="Space Mono" fontWeight="700">
          {outputLabels[ni]}
        </text>
      ))}

      {/* Layer labels */}
      {layers.map((layer, li) => (
        <text key={layer.label} x={layerX[li]} y={H - 4}
          textAnchor="middle" fill={layer.color} fontSize="8" fontFamily="Rajdhani" fontWeight="700" letterSpacing="0.08em">
          {layer.label}
        </text>
      ))}
    </svg>
  );
}

function DRLLoop() {
  const states = ['STATE', 'AGENT', 'ACTION', 'ENV', 'REWARD'];
  const colors = ['#a78bfa', '#00d4ff', '#f59e0b', '#64748b', '#00ff88'];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center' }}>
      {states.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{
            padding: '8px 14px',
            background: `${colors[i]}18`,
            border: `1px solid ${colors[i]}66`,
            fontFamily: 'Rajdhani',
            fontWeight: 700,
            fontSize: 13,
            color: colors[i],
            letterSpacing: '0.08em',
          }}>
            {s}
          </div>
          {i < states.length - 1 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="16">
                <line x1="2" y1="8" x2="26" y2="8" stroke={colors[i + 1]} strokeWidth="1.5" strokeDasharray="4 2"
                  style={{ animation: 'flow 1.2s linear infinite' }} />
                <polygon points="22,4 30,8 22,12" fill={colors[i + 1]} />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
      {/* Loop back arrow */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>
        <svg width="300" height="24">
          <path d="M 260 4 Q 150 24 40 4" fill="none" stroke="#33415588" strokeWidth="1.5" strokeDasharray="4 2"
            style={{ animation: 'flow 2s linear infinite' }} />
          <polygon points="44,0 36,4 44,8" fill="#334155" />
          <text x="150" y="20" textAnchor="middle" fill="#334155" fontSize="8" fontFamily="Space Mono">next state feedback</text>
        </svg>
      </div>
    </div>
  );
}

export function DRLModel() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', overflowY: 'auto', height: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em' }}>
          DRL MODEL
        </h1>
        <p style={{ color: '#64748b', fontSize: 12, fontFamily: 'Space Mono', marginTop: 8 }}>
          Deep Q-Network for 5G energy optimization
        </p>
      </div>

      {/* MDP formulation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          {
            title: 'STATE S(t)',
            content: 'S = { user_density, traffic_load, SINR, BS_load, energy_consumption, QoS_rate }',
            color: '#a78bfa',
          },
          {
            title: 'ACTION A(t)',
            content: 'A = { ON ∀ BS_i, SLEEP ∀ BS_i, WAKE ∀ BS_i, POWER_CTRL ∀ BS_i }',
            color: '#f59e0b',
          },
          {
            title: 'REWARD R(t)',
            content: 'R = α·QoS_satisfaction − β·Energy_cost − γ·Coverage_penalty',
            color: '#00ff88',
          },
        ].map(card => (
          <div key={card.title} className="panel">
            <div className="panel-header" style={{ color: card.color }}>{card.title}</div>
            <div style={{ padding: '10px 12px', fontFamily: 'Space Mono', fontSize: 9.5, color: '#94a3b8', lineHeight: 1.7 }}>
              {card.content}
            </div>
          </div>
        ))}
      </div>

      {/* DRL Loop */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">DRL CONTROL LOOP</div>
        <div style={{ padding: 20 }}>
          <DRLLoop />
        </div>
      </div>

      {/* Neural Network */}
      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="panel-header">NEURAL NETWORK ARCHITECTURE</div>
        <div style={{ padding: 20, display: 'flex', justifyContent: 'center' }}>
          <NeuralNet />
        </div>
      </div>

      {/* Algorithm details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="panel">
          <div className="panel-header">DQN HYPERPARAMETERS</div>
          <div style={{ padding: '8px 12px' }}>
            {[
              ['Algorithm', 'Deep Q-Network (DQN)'],
              ['Input Neurons', '7 (state features)'],
              ['Hidden Layer 1', '64 neurons + ReLU'],
              ['Hidden Layer 2', '64 neurons + ReLU'],
              ['Output Neurons', '4 (actions)'],
              ['Learning Rate', '0.001'],
              ['Discount γ', '0.95'],
              ['Exploration ε', '0.1 → 0.01'],
              ['Batch Size', '32'],
              ['Memory Size', '10,000'],
              ['Target Update', 'Every 100 steps'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: '1px solid #0e2a4233' }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>{k}</span>
                <span className="font-mono" style={{ fontSize: 10, color: '#cbd5e1' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">OPTIMIZATION OBJECTIVE</div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: '#00d4ff', marginBottom: 16, lineHeight: 1.8 }}>
              minimize: E[∑ Energy(t)]<br />
              subject to: QoS(t) ≥ QoS_min
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.8 }}>
              The DRL agent learns a policy π(s) → a that minimizes total network energy consumption across all episodes while maintaining user quality of service above a defined threshold.
            </div>
            <div style={{ marginTop: 14, padding: '10px 12px', background: '#00d4ff0a', border: '1px solid #00d4ff22' }}>
              <div style={{ fontFamily: 'Space Mono', fontSize: 9, color: '#00d4ff', letterSpacing: '0.06em', marginBottom: 6 }}>KEY INSIGHT</div>
              <div style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.6 }}>
                By dynamically sleeping low-utilization base stations, the DRL agent achieves 25–40% energy savings with &lt;5% QoS degradation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
