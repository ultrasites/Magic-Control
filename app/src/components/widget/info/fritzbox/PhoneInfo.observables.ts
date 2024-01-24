import { combineLatest } from "rxjs";
import { MQTT } from "../../../../services/mqtt";
import { generateTopic } from "../../../Widget.utils";
import { WidgetConfig } from "../../../Widget.types";

export const phoneRing$ = (
  mqtt: MQTT,
  config: WidgetConfig<"PHONE", "Fritzbox">
) =>
  combineLatest([
    mqtt!.observe<boolean>(
      generateTopic(config.mqtt.id, config.mqtt.topics.ring, config)
    ),
    mqtt!.observe<string>(
      generateTopic(config.mqtt.id, config.mqtt.topics.ringNumber, config)
    ),
  ]);
