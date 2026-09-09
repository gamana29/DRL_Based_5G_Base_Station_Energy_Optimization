import { useState, useRef, useCallback, useEffect } from 'react';
import type { BaseStation, User, SimState, SimControls, BSState, QoSStatus } from '../types';

const W = 800, H = 500;
const BS_POWER_MAX = 8; // kW
const BS_SLEEP_POWER = 0.5;
const COVERAGE_R = 130;

const BS_POSITIONS = [
  { id: 'BS-01', x: 110, y: 90  },
  { id: 'BS-02', x: 370, y: 70  },
  { id: 'BS-03', x: 660, y: 100 },
  { id: 'BS-04', x: 180, y: 270 },
  { id: 'BS-05', x: 480, y: 255 },
  { id: 'BS-06', x: 710, y: 300 },
  { id: 'BS-07', x: 340, y: 420 },
];

function mkBS(): BaseStation[] {
  return BS_POSITIONS.map(p => ({
    ...p,
    state: 'active' as BSState,
    load: 0,
    power: BS_POWER_MAX,
    connectedUsers: [],
    sinr: 22,
    throughput: 0,
    energy: BS_POWER_MAX,
    coverageRadius: COVERAGE_R,
    drlAction: 'IDLE',
    reward: 0,
  }));
}

function mkUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `U${String(i + 1).padStart(2, '0')}`,
    x: 40 + Math.random() * (W - 80),
    y: 40 + Math.random() * (H - 80),
    connectedBS: null,
    trafficDemand: 10 + Math.random() * 80,
    sinr: 0,
    dataRate: 0,
    qosStatus: 'satisfied' as QoSStatus,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
  }));
}

let eventIdCounter = 0;

function drlDecide(
  bss: BaseStation[],
  users: User[],
  ctrl: SimControls,
): Record<string, { state: BSState; action: string }> {
  const result: Record<string, { state: BSState; action: string }> = {};
  const sleepThr = ctrl.objective === 'energy' ? 0.12 : ctrl.objective === 'qos' ? 0.04 : 0.08;

  bss.forEach(bs => {
    if (!ctrl.drlEnabled) {
      // Conventional: all active
      const s: BSState = bs.load > 0.75 ? 'high-load' : bs.load > 0.25 ? 'active' : 'low-load';
      result[bs.id] = { state: s, action: 'KEEP ACTIVE' };
      return;
    }

    if (bs.state === 'sleep') {
      // Wake if nearby users are uncovered
      const needsCoverage = users.some(u => {
        const d = Math.hypot(u.x - bs.x, u.y - bs.y);
        return d < bs.coverageRadius && u.qosStatus !== 'satisfied';
      });
      if (needsCoverage) {
        result[bs.id] = { state: 'active', action: 'WAKE BS' };
      } else {
        result[bs.id] = { state: 'sleep', action: 'KEEP SLEEP' };
      }
      return;
    }

    // Active BS: sleep if underutilized and users can be served by neighbors
    if (bs.load < sleepThr) {
      const myUsers = users.filter(u => u.connectedBS === bs.id);
      const canHandoff = myUsers.every(u =>
        bss.some(other => {
          if (other.id === bs.id || other.state === 'sleep') return false;
          return Math.hypot(u.x - other.x, u.y - other.y) < other.coverageRadius && other.load < 0.88;
        })
      );
      if (canHandoff || myUsers.length === 0) {
        result[bs.id] = { state: 'sleep', action: 'PUT TO SLEEP' };
        return;
      }
    }

    const action = bs.load > 0.82 ? 'INCREASE CAPACITY' : bs.load < 0.3 ? 'REDUCE POWER' : 'KEEP ACTIVE';
    const s: BSState = bs.load > 0.75 ? 'high-load' : bs.load > 0.25 ? 'active' : 'low-load';
    result[bs.id] = { state: s, action };
  });
  return result;
}

const INIT_STATE: SimState = {
  running: false,
  time: 0,
  baseStations: mkBS(),
  users: mkUsers(30),
  metrics: { activeBSCount: 7, totalEnergy: 56, energySavings: 0, avgThroughput: 0, avgSINR: 0, qosSatisfaction: 100, drlReward: 0 },
  history: [],
  events: [],
};

const INIT_CONTROLS: SimControls = {
  trafficLoad: 'medium',
  userCount: 30,
  speed: 1,
  drlEnabled: true,
  objective: 'balanced',
};

const SPEED_MS: Record<number, number> = { 0.5: 2000, 1: 1000, 2: 500, 5: 200 };

export function useSimulation() {
  const [state, setState] = useState<SimState>(INIT_STATE);
  const [controls, setControls] = useState<SimControls>(INIT_CONTROLS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ctrlRef = useRef(controls);
  ctrlRef.current = controls;

  const tick = useCallback(() => {
    setState(prev => {
      const ctrl = ctrlRef.current;
      const tMult = ctrl.trafficLoad === 'low' ? 0.35 : ctrl.trafficLoad === 'high' ? 1.6 : 1.0;

      // Move users
      const movedUsers = prev.users.map(u => {
        let { x, y, vx, vy } = u;
        x += vx * 2; y += vy * 2;
        if (x < 10 || x > W - 10) { vx = -vx; x = Math.max(10, Math.min(W - 10, x)); }
        if (y < 10 || y > H - 10) { vy = -vy; y = Math.max(10, Math.min(H - 10, y)); }
        if (Math.random() < 0.04) {
          vx += (Math.random() - 0.5) * 0.4;
          vy += (Math.random() - 0.5) * 0.4;
          vx = Math.max(-1.5, Math.min(1.5, vx));
          vy = Math.max(-1.5, Math.min(1.5, vy));
        }
        const demand = Math.max(5, u.trafficDemand + (Math.random() - 0.5) * 8) * tMult;
        return { ...u, x, y, vx, vy, trafficDemand: demand };
      });

      // Associate users to nearest active BS
      const activeBSs = prev.baseStations.filter(bs => bs.state !== 'sleep');
      const bsLoadMap: Record<string, number> = {};
      prev.baseStations.forEach(bs => { bsLoadMap[bs.id] = 0; });

      const assocUsers: User[] = movedUsers.map(u => {
        let bestBS: BaseStation | null = null;
        let bestDist = Infinity;
        activeBSs.forEach(bs => {
          const d = Math.hypot(u.x - bs.x, u.y - bs.y);
          if (d < bs.coverageRadius && d < bestDist) { bestDist = d; bestBS = bs; }
        });
        if (bestBS) bsLoadMap[(bestBS as BaseStation).id]++;

        const sinr = bestBS ? Math.max(3, 32 - bestDist * 0.16 + (Math.random() - 0.5) * 5) : 0;
        const bsLoad = bestBS ? bsLoadMap[(bestBS as BaseStation).id] / Math.max(1, ctrl.userCount * 0.35) : 1;
        const dataRate = bestBS ? Math.min(280, sinr * 7 * (1 - bsLoad * 0.3)) : 0;
        const qos: QoSStatus = !bestBS ? 'violated' : sinr < 8 ? 'degraded' : 'satisfied';
        return { ...u, connectedBS: bestBS ? (bestBS as BaseStation).id : null, sinr, dataRate, qosStatus: qos };
      });

      // Compute BS loads
      const bsConUsers: Record<string, string[]> = {};
      prev.baseStations.forEach(bs => { bsConUsers[bs.id] = []; });
      assocUsers.forEach(u => { if (u.connectedBS) bsConUsers[u.connectedBS].push(u.id); });

      const maxPerBS = Math.max(1, ctrl.userCount * 0.38);
      const tempBSs = prev.baseStations.map(bs => ({
        ...bs,
        load: Math.min(1, bsConUsers[bs.id].length / maxPerBS),
        connectedUsers: bsConUsers[bs.id],
      }));

      // DRL decisions
      const decisions = drlDecide(tempBSs, assocUsers, ctrl);
      const newEvents: SimState['events'] = [];

      const newBSs = tempBSs.map(bs => {
        const dec = decisions[bs.id] ?? { state: bs.state, action: 'IDLE' };
        const wasAsleep = bs.state === 'sleep';
        const nowAsleep = dec.state === 'sleep';

        if (wasAsleep !== nowAsleep) {
          newEvents.push({
            id: ++eventIdCounter,
            time: new Date().toLocaleTimeString('en-GB'),
            message: nowAsleep
              ? `${bs.id} → SLEEP — DRL: energy saving`
              : `${bs.id} → ACTIVE — DRL: coverage required`,
            type: nowAsleep ? 'action' : 'info',
          });
        }

        const energy = nowAsleep ? BS_SLEEP_POWER : BS_POWER_MAX * (0.38 + bs.load * 0.62);
        const myUsers = assocUsers.filter(u => u.connectedBS === bs.id);
        const avgSINR = myUsers.length ? myUsers.reduce((a, u) => a + u.sinr, 0) / myUsers.length : 0;
        const throughput = myUsers.reduce((a, u) => a + u.dataRate, 0);
        const reward = myUsers.length > 0 ? (avgSINR / 30) * 50 - energy + 25 : -energy;

        return { ...bs, state: dec.state, drlAction: dec.action, energy, sinr: avgSINR, throughput, reward };
      });

      // Occasional extra events
      if (Math.random() < 0.12) {
        const u = assocUsers[Math.floor(Math.random() * assocUsers.length)];
        if (u) newEvents.push({
          id: ++eventIdCounter,
          time: new Date().toLocaleTimeString('en-GB'),
          message: u.connectedBS
            ? `${u.id} → ${u.connectedBS} | ${Math.round(u.dataRate)} Mbps | SINR ${u.sinr.toFixed(1)} dB`
            : `${u.id} OUT OF COVERAGE — QoS violated`,
          type: u.connectedBS ? 'info' : 'alert',
        });
      }
      if (Math.random() < 0.06) {
        const sleepingCount = newBSs.filter(b => b.state === 'sleep').length;
        if (sleepingCount > 0) newEvents.push({
          id: ++eventIdCounter,
          time: new Date().toLocaleTimeString('en-GB'),
          message: `DRL ACTION: ${sleepingCount} BS in sleep — evaluating reward`,
          type: 'action',
        });
      }

      const activeBSList = newBSs.filter(b => b.state !== 'sleep');
      const totalEnergy = newBSs.reduce((a, b) => a + b.energy, 0);
      const maxEnergy = BS_POSITIONS.length * BS_POWER_MAX;
      const energySavings = Math.max(0, (maxEnergy - totalEnergy) / maxEnergy * 100);
      const satUsers = assocUsers.filter(u => u.qosStatus === 'satisfied').length;
      const qosSat = (satUsers / Math.max(1, assocUsers.length)) * 100;
      const avgThr = activeBSList.reduce((a, b) => a + b.throughput, 0) / Math.max(1, activeBSList.length);
      const conUsers = assocUsers.filter(u => u.connectedBS);
      const avgSINR = conUsers.length ? conUsers.reduce((a, u) => a + u.sinr, 0) / conUsers.length : 0;
      const drlReward = newBSs.reduce((a, b) => a + b.reward, 0);
      const trafficLoad = assocUsers.reduce((a, u) => a + u.trafficDemand, 0) / 1000;

      const newTime = prev.time + 1;
      const history = [
        ...prev.history.slice(-80),
        { t: newTime, energy: totalEnergy, activeBSs: activeBSList.length, throughput: avgThr, qos: qosSat, reward: drlReward, traffic: trafficLoad },
      ];

      return {
        ...prev,
        time: newTime,
        baseStations: newBSs,
        users: assocUsers,
        metrics: { activeBSCount: activeBSList.length, totalEnergy, energySavings, avgThroughput: avgThr, avgSINR, qosSatisfaction: qosSat, drlReward },
        history,
        events: [...newEvents, ...prev.events].slice(0, 60),
      };
    });
  }, []);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const start = useCallback(() => {
    clearInterval_();
    setState(prev => ({ ...prev, running: true }));
    intervalRef.current = setInterval(tick, SPEED_MS[ctrlRef.current.speed]);
  }, [tick, clearInterval_]);

  const stop = useCallback(() => {
    clearInterval_();
    setState(prev => ({ ...prev, running: false }));
  }, [clearInterval_]);

  const reset = useCallback(() => {
    clearInterval_();
    setState({ ...INIT_STATE, baseStations: mkBS(), users: mkUsers(ctrlRef.current.userCount) });
  }, [clearInterval_]);

  const updateControls = useCallback((updates: Partial<SimControls>) => {
    setControls(prev => {
      const next = { ...prev, ...updates };
      ctrlRef.current = next;
      return next;
    });
    if (updates.userCount !== undefined) {
      setState(prev => ({ ...prev, users: mkUsers(updates.userCount!) }));
    }
  }, []);

  // Restart interval when speed changes while running
  useEffect(() => {
    if (state.running) { clearInterval_(); intervalRef.current = setInterval(tick, SPEED_MS[controls.speed]); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls.speed]);

  useEffect(() => () => { clearInterval_(); }, [clearInterval_]);

  return { state, controls, start, stop, reset, updateControls };
}
