import { MQTT } from "../../../../services/mqtt";
import { WidgetConfig, WidgetType } from "../../../Widget.types";
import { generateTopic } from "../../../Widget.utils";

export const setTemperature$ = <T extends WidgetType>(
  mqtt: MQTT,
  config: WidgetConfig<T, "Tuya Smart">
) =>
  mqtt!.observe<number>(
    generateTopic(config.mqtt.id, config.mqtt.topics.setTemperature, config)
  );

export const status$ = <T extends WidgetType>(
  mqtt: MQTT,
  config: WidgetConfig<T, "Tuya Smart">
) =>
  mqtt!.observe<{
    workState: string;
    setTemperature: string;
    mode: string;
    currentTemperature: string;
  }>(generateTopic(config.mqtt.id, config.mqtt.topics.state, config));
