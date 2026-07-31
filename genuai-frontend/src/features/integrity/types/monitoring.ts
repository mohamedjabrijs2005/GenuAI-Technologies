/**
 * Integrity monitoring types.
 */

export interface MonitorEvent {
  id: string;
  type: 'tab_switch' | 'copy_paste' | 'face_absent' | 'audio_peak' | 'screen_share';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface MonitorState {
  isActive: boolean;
  events: MonitorEvent[];
  lastChecked: string;
}
