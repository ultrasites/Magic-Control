export interface WidgetBase<T extends WidgetType, U extends Device> {
  name: string;
  position?: string;
  type: T;
  device: U;
}

export interface WidgetMqttConfig<T extends Device> {
  mqtt: {
    id: string;
    topics: ConnectedTopic &
      (T extends "Fritzbox"
        ? {
            ring: string;
            ringNumber: string;
            history: string;
            phonebook: string;
          }
        : T extends "TP-Link Tapo"
          ? { setPower: string }
          : { status: string; info: string });
  };
}

export interface WidgetRestConfig<T extends WidgetType> {
  rest: {
    ip: string;
    endpoints: T extends "DIMMED_LIGHT"
      ? { set: string }
      : T extends "SHUTTER"
        ? { set: string }
        : T extends "GARAGE_GATE"
          ? { set: string }
          : { [key: string]: string };
  };
}

export interface ConnectedTopic {
  connected: string;
}

export type WidgetType =
  | "DIMMED_LIGHT"
  | "SHUTTER"
  | "GARAGE_GATE"
  | "PHONE"
  | "PLUG";
export type WidgetControlType = "TOGGLE" | "BUTTON" | "RANGE";
export type Device = "Shelly" | "TP-Link Tapo" | "Fritzbox";

export type WidgetConfig<
  T extends WidgetType = WidgetType,
  U extends Device = Device
> = WidgetBase<T, U> &
  WidgetMqttConfig<U> &
  (U extends "Shelly" ? WidgetRestConfig<T> : {});
