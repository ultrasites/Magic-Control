import { createSignal } from "solid-js";
import styles from "./ToggleButton.module.css";

export interface IToggleButton {
  onClick: (isActive: boolean) => Promise<void>;
  active?: boolean;
}

export default function ToggleButton(props: IToggleButton) {
  const [toggle, setToggle] = createSignal<boolean>(props.active ?? false);
  const [disabled, setDisabled] = createSignal<boolean>(false);
  return (
    <div
      classList={{
        [styles.button]: true,
        [styles.buttonOn]: toggle(),
        [styles.buttonDisabled]: disabled(),
        [styles.buttonActiveDisabled]: toggle() && disabled(),
      }}
      onClick={async (e) => {
        e.stopImmediatePropagation();
        if (!disabled()) {
          setDisabled(true);
          await props.onClick(!toggle());
          setToggle(!toggle());
          setDisabled(false);
        }
      }}
    >
      <div class={styles.inlay}>
        <div
          classList={{
            [styles.circle]: true,
            [styles.circleOn]: toggle(),
            [styles.circleOff]: !toggle(),
            [styles.circleDisabled]: disabled(),
            [styles.circleActiveDisabled]: toggle() && disabled(),
          }}
        ></div>
      </div>
    </div>
  );
}
