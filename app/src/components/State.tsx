import styles from "./State.module.css";
import { useContext } from "solid-js";
import { AppContext } from "./AppProvider";

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
  | "stopped";

export interface IState {
  state: StateType;
  value?: string;
}

export default function State(props: IState) {
  const { translate } = useContext(AppContext);
  const t = translate!;
  return (
    <div class={styles.host}>
      {(props.state === "connecting" ||
        props.state === "slidingDown" ||
        props.state === "slidingUp") && <span class={styles.spinner}></span>}
      <span
        classList={{
          [styles.state]: true,
          [styles.success]: props.state === "on" || props.state === "open",
          [styles.warning]:
            props.state === "slidingDown" ||
            props.state === "slidingUp" ||
            props.state === "connecting",
          [styles.error]:
            props.state === "error" ||
            props.state === "off" ||
            props.state === "closed"
        }}
      >
        {props.state === "on" || props.state === "off"
          ? "⏺"
          : props.state !== "idle"
            ? t(props.state)
            : ""}
      </span>
      {props.value && (
        <span
          classList={{
            [styles.state]: true,
            [styles.value]: true
          }}
        >
          {props.value}%
        </span>
      )}
    </div>
  );
}
