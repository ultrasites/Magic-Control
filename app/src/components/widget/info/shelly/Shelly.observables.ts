import { MQTT } from "../../../../services/mqtt";
import { WidgetConfig, WidgetType } from "../../../Widget.types";
import { generateTopic } from "../../../Widget.utils";
import { LightStatus, ShutterStatus } from "./Shelly.types";

export const status$ = <T extends WidgetType>(
  mqtt: MQTT,
  config: WidgetConfig<T, "Shelly">
) =>
  mqtt!.observe<T extends "DIMMED_LIGHT" ? LightStatus : ShutterStatus>(
    generateTopic(config.mqtt.id, config.mqtt.topics.status, config)
  );

export const info$ = <T extends WidgetType>(
  mqtt: MQTT,
  config: WidgetConfig<T, "Shelly">
) =>
  mqtt!.observe<
    T extends "DIMMED_LIGHT"
      ? { uptime: number }
      : { status: { uptime: number } }
  >(generateTopic(config.mqtt.id, config.mqtt.topics.info, config));
