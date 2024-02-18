import { WidgetConfig } from "./components/Widget.types";
import { MMIO_Config } from "./config";

export const defaultConfig: MMIO_Config = [
  // {
  //   name: "Telefon",
  //   position: "Fritzbox",
  //   mqtt: {
  //     topics: {
  //       ring: "ring",
  //       ringNumber: "ringnumber",
  //       history: "history",
  //       phonebook: "phonebook",
  //       connected: "connected"
  //     },
  //     id: "fritzbox"
  //   },
  //   type: "PHONE",
  //   device: "Fritzbox"
  // } satisfies WidgetConfig<"PHONE", "Fritzbox">,
  {
    name: "Garagentor",
    position: "Garage",
    mqtt: {
      id: "shelly-garage",
      topics: {
        connected: "online",
        status: "status/input:100",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.157",
      endpoints: { set: "relay/0" }
    },
    type: "GARAGE_GATE",
    device: "Shelly"
  } satisfies WidgetConfig<"GARAGE_GATE", "Shelly">,
  {
    name: "Licht",
    position: "links",
    mqtt: {
      id: "shelly-licht-links",
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
    name: "Licht",
    position: "rechts",
    mqtt: {
      id: "shelly-licht-rechts",
      topics: {
        connected: "online",
        status: "light/0/status",
        info: "info"
      }
    },
    rest: {
      ip: "192.168.178.144",
      endpoints: { set: "light/0" }
    },
    type: "DIMMED_LIGHT",
    device: "Shelly"
  } satisfies WidgetConfig<"DIMMED_LIGHT", "Shelly">,
  {
    name: "Raffstore",
    position: "Tür (links)",
    mqtt: {
      id: "shelly-tuer-links",
      topics: {
        connected: "online",
        status: "status/cover:0",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.143",
      endpoints: { set: "roller/0" }
    },
    type: "SHUTTER",
    device: "Shelly"
  } satisfies WidgetConfig<"SHUTTER", "Shelly">,
  {
    name: "Raffstore",
    position: "Tür (rechts)",
    mqtt: {
      id: "shelly-tuer-rechts",
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
    position: "Fenster",
    mqtt: {
      id: "shelly-fenster",
      topics: {
        connected: "online",
        status: "status/cover:0",
        info: "status/sys"
      }
    },
    rest: {
      ip: "192.168.178.148",
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
