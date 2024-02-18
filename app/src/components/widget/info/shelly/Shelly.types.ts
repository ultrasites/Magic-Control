export interface LightStatus {
  ison: boolean;
  brightness: number;
}

export interface ShutterStatus {
  state: "open" | "closing" | "stopped" | "opening" | "closed";
  current_pos: number;
}

export interface GarageGateStatus {
  state: boolean;
  id: number;
}

export type StatusTypes = LightStatus | ShutterStatus | GarageGateStatus;

export interface ShellyInfo {
  uptime: number;
}
