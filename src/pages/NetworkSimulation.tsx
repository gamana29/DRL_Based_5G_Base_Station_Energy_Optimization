import React, { useState } from 'react';
import type { BaseStation, User, SimState, SimControls, HistoryPoint } from '../types';
import { NetworkMap } from '../components/NetworkMap';
import { DRLPanel } from '../components/DRLPanel';
import { ControlPanel } from '../components/ControlPanel';
import { PerformanceCards } from '../components/PerformanceCards';
import { EventLog } from '../components/EventLog';
import { LiveCharts } from '../components/LiveCharts';
import { BSInfoPanel, UserInfoPanel } from '../components/InfoPanels';


interface Props {
  state: SimState;
  controls: SimControls;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onUpdateControls: (u: Partial<SimControls>) => void;
}

export function NetworkSimulation({ state, controls, onStart, onStop, onReset, onUpdateControls }: Props) {
  const [selectedBS, setSelectedBS] = useState<BaseStation | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleBSClick = (bs: BaseStation) => {
    setSelectedUser(null);
    setSelectedBS(prev => prev?.id === bs.id ? null : bs);
  };
  const handleUserClick = (u: User) => {
    setSelectedBS(null);
    setSelectedUser(prev => prev?.id === u.id ? null : u);
  };

  // Keep selectedBS in sync with simulation updates
  const syncedBS = selectedBS ? state.baseStations.find(b => b.id === selectedBS.id) ?? null : null;
  const syncedUser = selectedUser ? state.users.find(u => u.id === selectedUser.id) ?? null : null;

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', overflow: 'hidden', padding: 8 }}>

      {/* Left: DRL Panel */}
      <div style={{ width: 230, flexShrink: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <DRLPanel
          metrics={state.metrics}
          baseStations={state.baseStations}
          controls={controls}
          running={state.running}
        />
      </div>

      {/* Center: Map + Charts + Log */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Network map */}
        <div style={{ flex: 2, minHeight: 0, position: 'relative', border: '1px solid #0e2a42', overflow: 'hidden' }}>
          <NetworkMap
            baseStations={state.baseStations}
            users={state.users}
            running={state.running}
            onBSClick={handleBSClick}
            onUserClick={handleUserClick}
            selectedBS={syncedBS?.id ?? null}
            selectedUser={syncedUser?.id ?? null}
          />
          {syncedBS && (
            <BSInfoPanel bs={syncedBS} history={state.history} onClose={() => setSelectedBS(null)} />
          )}
          {syncedUser && !syncedBS && (
            <UserInfoPanel user={syncedUser} onClose={() => setSelectedUser(null)} />
          )}
          {/* Sim time overlay */}
          <div style={{ position: 'absolute', top: 8, right: 8, fontFamily: 'Space Mono', fontSize: 10, color: '#64748b', background: '#020c18cc', padding: '3px 8px', border: '1px solid #0e2a42' }}>
            T: {String(Math.floor(state.time / 60)).padStart(2, '0')}:{String(state.time % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Charts */}
        <div style={{ flex: 1, minHeight: 160 }}>
          <LiveCharts history={state.history} />
        </div>

        {/* Event log */}
        <div style={{ height: 120, display: 'flex', flexDirection: 'column' }}>
          <EventLog events={state.events} />
        </div>
      </div>

      {/* Right: Controls + Performance */}
      <div style={{ width: 260, flexShrink: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ControlPanel
          controls={controls}
          running={state.running}
          onUpdate={onUpdateControls}
          onStart={onStart}
          onStop={onStop}
          onReset={onReset}
        />
        <PerformanceCards metrics={state.metrics} running={state.running} />
      </div>
    </div>
  );
}
