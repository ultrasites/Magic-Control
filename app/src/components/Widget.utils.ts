import { Device, WidgetConfig, WidgetType } from "./Widget.types";

export const isFritzboxPhone = (
  config: WidgetConfig<WidgetType, Device>
): config is WidgetConfig<"PHONE", "Fritzbox"> =>
  (config as WidgetConfig<"PHONE", "Fritzbox">).mqtt.topics.ring !== undefined;

export const isShelly = (
  config: WidgetConfig<WidgetType, Device>
): config is WidgetConfig<WidgetType, "Shelly"> =>
  (config as WidgetConfig<WidgetType, "Shelly">).mqtt.topics.status !==
  undefined;

export const isInfoWidget = (type: WidgetType) => type === "PHONE";

export const generateTopic = (
  id: string,
  suffix: string,
  config: WidgetConfig
) => `${isShelly(config) ? "shellies/" : ""}${id}/${suffix}`;
