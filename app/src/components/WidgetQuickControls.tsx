import { MQTT } from "../services/mqtt";
import Button from "./Button";
import { IState } from "./State";
import ToggleButton from "./ToggleButton";
import { Device, WidgetConfig, WidgetType } from "./Widget.types";
import { generateTopic, isShelly, isTuya } from "./Widget.utils";
import { triggerCloseGarageGate$ } from "./widget/info/shelly/Shelly.observables";
import {
  LightStatus,
  ShutterStatus,
  StatusTypes
} from "./widget/info/shelly/Shelly.types";
import {
  isDimmedLight,
  isGarageGate,
  isShutter,
  shellyRestCallAction
} from "./widget/info/shelly/Shelly.utils";

export interface IWidgetQuickControls {
  shellyState?: StatusTypes;
  config: WidgetConfig<WidgetType, Device>;
  state: IState;
  mqtt: MQTT;
}

export default function WidgetQuickControls(props: IWidgetQuickControls) {
  const renderQuickIncludes = (
    shellyState: StatusTypes | undefined,
    config: WidgetConfig<WidgetType, Device>,
    state: IState,
    mqtt: MQTT
  ) => {
    switch (config.type) {
      case "PLUG":
        return <ToggleButton onClick={async (_isActive) => {}} />;
      case "TEMPERATURE":
        return (
          <>
            <Button
              onClick={async () => {
                if (isTuya(config)) {
                  const setTemperatureTopic = generateTopic(
                    config.mqtt.id,
                    config.mqtt.topics.setTemperature,
                    config
                  );
                  const setModeTopic = generateTopic(
                    config.mqtt.id,
                    config.mqtt.topics.setMode,
                    config
                  );
                  const value = parseFloat(state.value!);

                  if (value < 25) {
                    return await Promise.all([
                      mqtt.publish(
                        setTemperatureTopic,
                        (value + 0.5).toString()
                      ),
                      mqtt.publish(setModeTopic, "2")
                    ]);
                  }
                  return Promise.resolve();
                }

                return Promise.reject("Device type not supported.");
              }}
            >
              <i class={`fa-plus fa-solid`} />
            </Button>
            <Button
              onClick={async () => {
                if (isTuya(config)) {
                  const setTemperatureTopic = generateTopic(
                    config.mqtt.id,
                    config.mqtt.topics.setTemperature,
                    config
                  );
                  const setModeTopic = generateTopic(
                    config.mqtt.id,
                    config.mqtt.topics.setMode,
                    config
                  );
                  const value = parseFloat(state.value!);

                  if (value > 0) {
                    return await Promise.all([
                      mqtt.publish(
                        setTemperatureTopic,
                        (value - 0.5).toString()
                      ),
                      mqtt.publish(setModeTopic, "2")
                    ]);
                  }
                  return Promise.resolve();
                }
                return Promise.reject("Device type not supported.");
              }}
            >
              <i class={`fa-minus fa-solid`} />
            </Button>
          </>
        );
      case "SHUTTER":
        return (
          <>
            <Button
              disabled={(shellyState as ShutterStatus).state === "open"}
              onClick={async () => {
                if (isShelly(config) && isShutter(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      go:
                        (shellyState as ShutterStatus).state === "opening"
                          ? "stop"
                          : "open"
                    }
                  );
                  return Promise.resolve();
                }

                return Promise.reject("Device type not supported.");
              }}
            >
              <i
                class={`${
                  (shellyState as ShutterStatus).state === "opening"
                    ? "fa-pause"
                    : "fa-chevron-up"
                } fa-solid`}
              />
            </Button>
            <Button
              disabled={(shellyState as ShutterStatus).state === "closed"}
              onClick={async () => {
                if (isShelly(config) && isShutter(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      go:
                        (shellyState as ShutterStatus).state === "closing"
                          ? "stop"
                          : "close"
                    }
                  );
                  return Promise.resolve();
                }

                return Promise.reject("Device type not supported.");
              }}
            >
              <i
                class={`${
                  (shellyState as ShutterStatus).state === "closing"
                    ? "fa-pause"
                    : "fa-chevron-down"
                } fa-solid`}
              />
            </Button>
          </>
        );
      case "DIMMED_LIGHT":
        return (
          <ToggleButton
            active={shellyState && (shellyState as LightStatus)!.ison}
            onClick={async (_isActive) => {
              if (isShelly(config) && isDimmedLight(config)) {
                await shellyRestCallAction(
                  config.rest.ip,
                  config.rest.endpoints.set,
                  {
                    turn: _isActive ? "on" : "off"
                  }
                );

                return Promise.resolve();
              }
              return Promise.reject("Device type not supported.");
            }}
          />
        );
      case "GARAGE_GATE":
        return (
          <>
            <Button
              disabled={
                state.state === "slidingDown" || state.state === "slidingUp"
              }
              onClick={async () => {
                if (isShelly(config) && isGarageGate(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      turn: "toggle"
                    }
                  );
                  if (state.state === "open") {
                    triggerCloseGarageGate$.next(null);
                  }
                  return Promise.resolve();
                }

                return Promise.reject("Device type not supported.");
              }}
            >
              <i
                class={`${
                  state.state === "closed"
                    ? "fa-chevron-up"
                    : state.state === "open"
                      ? "fa-chevron-down"
                      : "fa-hourglass-start"
                } fa-solid`}
              />
            </Button>
          </>
        );
    }
  };

  return (
    <>
      {renderQuickIncludes(
        props.shellyState,
        props.config,
        props.state,
        props.mqtt
      )}
    </>
  );
}
