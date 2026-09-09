import React, { useState } from 'react';
import { Nav } from './components/Nav';
import { NetworkSimulation } from './pages/NetworkSimulation';
import { DRLEngine } from './pages/DRLEngine';
import { Architecture } from './pages/Architecture';
import { DRLModel } from './pages/DRLModel';
import { Results } from './pages/Results';
import { useSimulation } from './hooks/useSimulation';

type Page = 'simulation' | 'drl' | 'architecture' | 'model' | 'results';

export default function App() {
  const [page, setPage] = useState<Page>('simulation');
  const { state, controls, start, stop, reset, updateControls } = useSimulation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#020c18' }}>
      <Nav page={page} onNavigate={setPage} state={state} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {page === 'simulation' && (
          <NetworkSimulation
            state={state}
            controls={controls}
            onStart={start}
            onStop={stop}
            onReset={reset}
            onUpdateControls={updateControls}
          />
        )}
        {page === 'drl' && (
          <DRLEngine state={state} controls={controls} />
        )}
        {page === 'architecture' && (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Architecture />
          </div>
        )}
        {page === 'model' && (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <DRLModel />
          </div>
        )}
        {page === 'results' && (
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Results state={state} />
          </div>
        )}
      </div>
    </div>
  );
}
