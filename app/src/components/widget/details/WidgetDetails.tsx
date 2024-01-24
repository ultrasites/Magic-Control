import dayjs from "dayjs";
import State, { StateType } from "../../State";
import WidgetHeader from "../WidgetHeader";
import styles from "./WidgetDetails.module.css";
import { IconMode } from "../../Icon";
import { StatusTypes } from "../info/shelly/Shelly.types";

import Slider from "../../Slider";
import {
  isLightStatus,
  shellyRestCallAction
} from "../info/shelly/Shelly.utils";
import { WidgetConfig, WidgetType } from "../../Widget.types";
import Button from "../../Button";
import { useContext } from "solid-js";
import { AppContext } from "../../AppProvider";

export interface IWidgetDetails {
  config: WidgetConfig<WidgetType, "Shelly">;
  values: {
    connected: IconMode;
    uptime?: number;
    state: StateType;
    value?: string;
    shellyState?: StatusTypes;
  };
}

export default function WidgetDetails(props: IWidgetDetails) {
  const { translate } = useContext(AppContext);
  const t = translate!;

  const formatUpTime = (uptime: number) =>
    dayjs().subtract(uptime, "seconds").format("DD.MM.YYYY HH:mm");

  return (
    <div>
      <WidgetHeader
        name={props.config.name}
        mode={props.values.connected}
        position={props.config.position}
      />
      <section>
        <Slider
          value={
            isLightStatus(props.values.shellyState!)
              ? props.values.shellyState?.brightness
              : 0
          }
          onChange={async (percent) =>
            await shellyRestCallAction(
              props.config.rest.ip,
              props.config.rest.endpoints.set,
              { brightness: percent }
            )
          }
        />
        <div class={styles.flexGrid}>
          <Button
            disabled={
              isLightStatus(props.values.shellyState!) &&
              props.values.shellyState.ison
            }
            onClick={async () => {
              await shellyRestCallAction(
                props.config.rest.ip,
                props.config.rest.endpoints.set,
                {
                  turn: "on"
                }
              );

              return Promise.resolve();
            }}
          >
            <i class="fa-solid fa-lightbulb" />
          </Button>
          <Button
            disabled={
              isLightStatus(props.values.shellyState!) &&
              !props.values.shellyState.ison
            }
            onClick={async () => {
              await shellyRestCallAction(
                props.config.rest.ip,
                props.config.rest.endpoints.set,
                {
                  turn: "off"
                }
              );

              return Promise.resolve();
            }}
          >
            <i class="fa-regular fa-lightbulb" />
          </Button>
        </div>
      </section>
      <div class={styles.footer}>
        <div>
          <State
            state={props.values.state}
            value={
              isLightStatus(props.values.shellyState!)
                ? props.values.shellyState?.brightness.toString()
                : props.values.shellyState?.current_pos.toString()
            }
          />
        </div>
        <div>
          {t("connectedSince")}{" "}
          {props.values.uptime && formatUpTime(props.values.uptime)} {t("hour")}
        </div>
      </div>
    </div>
  );
}
