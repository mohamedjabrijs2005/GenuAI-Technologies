/**
 * Integrity Monitor Service — tracks browser-side integrity events.
 */
import type { MonitorEvent, MonitorState } from '../types/monitoring';

let _state: MonitorState = {
  isActive: false,
  events: [],
  lastChecked: new Date().toISOString(),
};

const _listeners: Array<(state: MonitorState) => void> = [];

function notify() {
  _listeners.forEach((fn) => fn({ ..._state, events: [..._state.events] }));
}

export function startIntegrityMonitor(): void {
  if (_state.isActive) return;
  _state.isActive = true;
  _state.lastChecked = new Date().toISOString();
  notify();
}

export function stopIntegrityMonitor(): void {
  _state.isActive = false;
  notify();
}

export function recordMonitorEvent(
  type: MonitorEvent['type'],
  metadata?: Record<string, unknown>
): void {
  const event: MonitorEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type,
    timestamp: new Date().toISOString(),
    metadata,
  };
  _state.events.push(event);
  notify();
}

export function getMonitorState(): MonitorState {
  return { ..._state, events: [..._state.events] };
}

export function subscribeToMonitor(fn: (state: MonitorState) => void): () => void {
  _listeners.push(fn);
  fn(getMonitorState());
  return () => {
    const idx = _listeners.indexOf(fn);
    if (idx !== -1) _listeners.splice(idx, 1);
  };
}
