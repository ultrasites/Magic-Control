import { isShelly } from "./Widget.utils";
import ToggleButton from "./ToggleButton";
import Button from "./Button";
import {
  LightStatus,
  ShutterStatus,
  StatusTypes
} from "./widget/info/shelly/Shelly.types";
import {
  shellyRestCallAction,
  isDimmedLight,
  isShutter,
  isGarageGate
} from "./widget/info/shelly/Shelly.utils";
import { Device, WidgetConfig, WidgetType } from "./Widget.types";
import { StateType } from "./State";
import { triggerCloseGarageGate$ } from "./widget/info/shelly/Shelly.observables";

export interface IWidgetQuickControls {
  shellyState?: StatusTypes;
  config: WidgetConfig<WidgetType, Device>;
  state: StateType;
}

export default function WidgetQuickControls(props: IWidgetQuickControls) {
  const renderQuickIncludes = (
    shellyState: StatusTypes | undefined,
    config: WidgetConfig<WidgetType, Device>,
    state: StateType
  ) => {
    console.log(state);
    switch (config.type) {
      case "PLUG":
        return <ToggleButton onClick={async (_isActive) => {}} />;
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
              disabled={state === "slidingDown" || state === "slidingUp"}
              onClick={async () => {
                if (isShelly(config) && isGarageGate(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      turn: "toggle"
                    }
                  );
                  if (state === "open") {
                    triggerCloseGarageGate$.next(null);
                  }
                  return Promise.resolve();
                }

                return Promise.reject("Device type not supported.");
              }}
            >
              <i
                class={`${
                  state === "closed"
                    ? "fa-chevron-up"
                    : state === "open"
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
    <>{renderQuickIncludes(props.shellyState, props.config, props.state)}</>
  );
}
