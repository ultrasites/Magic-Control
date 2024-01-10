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
  isShutter
} from "./widget/info/shelly/Shelly.utils";
import { Device, WidgetConfig, WidgetType } from "./Widget.types";

export interface IWidgetQuickControls {
  state?: StatusTypes;
  config: WidgetConfig<WidgetType, Device>;
}

export default function WidgetQuickControls(props: IWidgetQuickControls) {
  const renderQuickIncludes = (
    state: StatusTypes | undefined,
    config: WidgetConfig<WidgetType, Device>
  ) => {
    switch (config.type) {
      case "PLUG":
        return <ToggleButton onClick={async (_isActive) => {}} />;
      case "SHUTTER":
        return (
          <>
            <Button
              disabled={(state as ShutterStatus).state === "open"}
              onClick={async () => {
                if (isShelly(config) && isShutter(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      go:
                        (state as ShutterStatus).state === "opening"
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
                  (state as ShutterStatus).state === "opening"
                    ? "fa-pause"
                    : "fa-chevron-up"
                } fa-solid`}
              />
            </Button>
            <Button
              disabled={(state as ShutterStatus).state === "closed"}
              onClick={async () => {
                if (isShelly(config) && isShutter(config)) {
                  await shellyRestCallAction(
                    config.rest.ip,
                    config.rest.endpoints.set,
                    {
                      go:
                        (state as ShutterStatus).state === "closing"
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
                  (state as ShutterStatus).state === "closing"
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
            active={state && (state as LightStatus)!.ison}
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
            <Button onClick={async () => {}}>
              <i class="fa-chevron-up fa-solid" />
            </Button>
            <Button onClick={async () => {}}>
              <i class="fa-chevron-down fa-solid" />
            </Button>
          </>
        );
    }
  };

  return <>{renderQuickIncludes(props.state, props.config)}</>;
}
