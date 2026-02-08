import { MQTT } from "../../../../services/mqtt";
import { WidgetConfig, WidgetType } from "../../../Widget.types";
import { generateTopic } from "../../../Widget.utils";
import { TuyaSmartState } from "./Tuya.types";

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
  mqtt!.observe<TuyaSmartState>(
    generateTopic(config.mqtt.id, config.mqtt.topics.state, config)
  );
