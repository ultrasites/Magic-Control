import { useContext } from "solid-js";
import { AppContext } from "./AppProvider";
import styles from "./State.module.css";

export type StateType =
  | "on"
  | "off"
  | "slidingDown"
  | "slidingUp"
  | "closed"
  | "open"
  | "connecting"
  | "idle"
  | "error"
  | "stopped"
  | "heating";

export interface IState {
  state: StateType;
  value?: string;
}

export default function State(props: IState) {
  const { translate } = useContext(AppContext);
  const t = translate!;

  const renderBadge = (state: StateType) => {
    const mapStateToIcon = (state: StateType) => {
      switch (state) {
        case "on":
        case "open":
          return "fa-solid fa-circle";
        case "off":
        case "closed":
          return "fa-regular fa-circle";
        case "slidingDown":
          return "fa-solid fa-arrow-down";
        case "slidingUp":
          return "fa-solid fa-arrow-up";
        case "connecting":
          return "fa-solid fa-rotate";
        case "idle":
          return "fa-solid fa-circle-dot";
        case "error":
          return "fa-solid fa-triangle-exclamation";
        case "heating":
          return "fa-solid fa-fire";
        case "stopped":
          return "fa-solid fa-pause";
        default:
          return "";
      }
    };

    const mapToBadgeColor = (state: StateType) => {
      switch (state) {
        case "on":
        case "open":
          return styles.success;
        case "off":
        case "closed":
        case "error":
          return styles.error;
        case "slidingDown":
        case "slidingUp":
        case "connecting":
        case "idle":
        case "heating":
        case "stopped":
          return styles.warning;
        default:
          return styles.success;
      }
    };

    const mapToAnimation = (state: StateType) => {
      switch (state) {
        case "slidingDown":
        case "slidingUp":
        case "heating":
          return styles.blink;
        case "connecting":
          return styles.spinner;
        case "error":
        default:
          return "";
      }
    };
    return (
      <div class={`${styles.badge} ${mapToBadgeColor(state)}`}>
        <div class={`${styles.animationBox} ${mapToAnimation(state)}`}>
          <i class={`${styles.icon} ${mapStateToIcon(state)}`}></i>
        </div>
        <div class={styles.icon}>{t(state)}</div>
      </div>
    );
  };

  return (
    <div class={styles.host}>
      {renderBadge(props.state)}
      {
        <span
          classList={{
            [styles.state]: true,
            [styles.value]: true
          }}
        >
          {props.value}
        </span>
      }
    </div>
  );
}
