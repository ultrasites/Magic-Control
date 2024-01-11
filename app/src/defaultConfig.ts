import { WidgetConfig } from "./components/Widget.types";
import { MMIO_Config } from "./config";

export const defaultConfig: MMIO_Config = [
  {
    name: "Telefon",
    position: "Fritzbox",
    mqtt: {
      topics: {
        ring: "ring",
        ringNumber: "ringnumber",
        history: "history",
        phonebook: "phonebook",
        connected: "connected"
      },
      id: "fritzbox"
    },
    type: "PHONE",
    device: "Fritzbox"
  } satisfies WidgetConfig<"PHONE", "Fritzbox">,
  {
    name: "Licht",
    position: "links",
    mqtt: {
      id: "shellydimmer2-A848FAE62ED1",
      topics: {
        connected: "online",
        status: "light/0/status",
        info: "info"
      }
    },
    rest: {
      ip: "192.168.178.145",
      endpoints: { set: "light/0" }
    },
    type: "DIMMED_LIGHT",
    device: "Shelly"
  } satisfies WidgetConfig<"DIMMED_LIGHT", "Shelly">,
  {
    name: "Raffstore",
    position: "Tür (rechts)",
    mqtt: {
      id: "shellyplus2pm-5443b23f7ef4",
      topics: {
        connected: "online",
        status: "status/cover:0",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.147",
      endpoints: { set: "roller/0" }
    },
    type: "SHUTTER",
    device: "Shelly"
  } satisfies WidgetConfig<"SHUTTER", "Shelly">,
  {
    name: "Raffstore",
    position: "Tür (rechts)",
    mqtt: {
      id: "shellyplus2pm-5443b23f7ef4",
      topics: {
        connected: "online",
        status: "status/cover:0",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.147",
      endpoints: { set: "roller/0" }
    },
    type: "SHUTTER",
    device: "Shelly"
  } satisfies WidgetConfig<"SHUTTER", "Shelly">,
  {
    name: "Raffstore",
    position: "Tür (rechts)",
    mqtt: {
      id: "shellyplus2pm-a",
      topics: {
        connected: "online",
        status: "status/cover:0",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.147",
      endpoints: { set: "roller/0" }
    },
    type: "SHUTTER",
    device: "Shelly"
  } satisfies WidgetConfig<"SHUTTER", "Shelly">
  //   {
  //     name: "Licht",
  //     position: "rechts",
  //     topics: {
  //       command: "light/0/set",
  //       connected: "online",
  //       status:"light/0/status"
  //     },
  //     id: "shellydimmer2-4417931AF6E5",
  //     type: "DIMMED_LIGHT",
  //     device: "Shelly",
  //   } satisfies WidgetConfig<"DIMMED_LIGHT", "Shelly">,
];
