export interface LightStatus {
  ison: boolean;
  brightness: number;
}

export interface ShutterStatus {
  state: "open" | "closing" | "stopped" | "opening" | "closed";
  current_pos: number;
}

export type StatusTypes = LightStatus | ShutterStatus;

export interface ShellyInfo {
  uptime: number;
}
