import { simpleRestApi } from "../../../../services/rest";
import { WidgetConfig, WidgetType } from "../../../Widget.types";
import { LightStatus, ShutterStatus, StatusTypes } from "./Shelly.types";

export const isDimmedLight = (
  config: WidgetConfig<WidgetType, "Shelly">
): config is WidgetConfig<"DIMMED_LIGHT", "Shelly"> =>
  config.type === "DIMMED_LIGHT";

export const isShutter = (
  config: WidgetConfig<WidgetType, "Shelly">
): config is WidgetConfig<"SHUTTER", "Shelly"> => config.type === "SHUTTER";

export const isLightStatus = (status: StatusTypes): status is LightStatus =>
  status.hasOwnProperty("ison");

export const isShutterStatus = (status: StatusTypes): status is ShutterStatus =>
  status.hasOwnProperty("current_pos");

export const shellyRestCallAction = async (
  ip: string,
  endpoint: string,
  params?: Record<string, string | number>
) => await simpleRestApi(ip, endpoint, params);
