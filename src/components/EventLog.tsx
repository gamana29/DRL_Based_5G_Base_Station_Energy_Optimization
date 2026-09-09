import React, { useRef, useEffect } from 'react';
import type { SimEvent } from '../types';

export function EventLog({ events }: { events: SimEvent[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <div className="panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div className="panel-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>NETWORK EVENT LOG</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#00ff88', animation: 'blink 1.2s ease-in-out infinite' }} />
          <span style={{ color: '#00ff88', fontSize: 9 }}>LIVE</span>
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{ flex: 1, overflow: 'auto', padding: '6px 8px', fontFamily: 'Space Mono', fontSize: 9.5, lineHeight: 1.7 }}
      >
        {events.length === 0 && (
          <div style={{ color: '#334155', textAlign: 'center', paddingTop: 12, fontSize: 10 }}>
            — Start simulation to see events —
          </div>
        )}
        {events.map(ev => (
          <div key={ev.id} className={`event-${ev.type} animate-fade-up`} style={{ display: 'flex', gap: 8, paddingBottom: 2, borderBottom: '1px solid #0e2a4222' }}>
            <span style={{ color: '#334155', flexShrink: 0 }}>[{ev.time}]</span>
            <span>{ev.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
