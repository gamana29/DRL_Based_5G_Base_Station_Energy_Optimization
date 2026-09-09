export type BSState = 'active' | 'sleep' | 'high-load' | 'low-load';
export type QoSStatus = 'satisfied' | 'degraded' | 'violated';

export interface BaseStation {
  id: string;
  x: number;
  y: number;
  state: BSState;
  load: number;
  power: number;
  connectedUsers: string[];
  sinr: number;
  throughput: number;
  energy: number;
  coverageRadius: number;
  drlAction: string;
  reward: number;
}

export interface User {
  id: string;
  x: number;
  y: number;
  connectedBS: string | null;
  trafficDemand: number;
  sinr: number;
  dataRate: number;
  qosStatus: QoSStatus;
  vx: number;
  vy: number;
}

export interface Metrics {
  activeBSCount: number;
  totalEnergy: number;
  energySavings: number;
  avgThroughput: number;
  avgSINR: number;
  qosSatisfaction: number;
  drlReward: number;
}

export interface HistoryPoint {
  t: number;
  energy: number;
  activeBSs: number;
  throughput: number;
  qos: number;
  reward: number;
  traffic: number;
}

export interface SimEvent {
  id: number;
  time: string;
  message: string;
  type: 'info' | 'action' | 'alert';
}

export interface SimState {
  running: boolean;
  time: number;
  baseStations: BaseStation[];
  users: User[];
  metrics: Metrics;
  history: HistoryPoint[];
  events: SimEvent[];
}

export interface SimControls {
  trafficLoad: 'low' | 'medium' | 'high';
  userCount: number;
  speed: 0.5 | 1 | 2 | 5;
  drlEnabled: boolean;
  objective: 'energy' | 'qos' | 'balanced';
}
