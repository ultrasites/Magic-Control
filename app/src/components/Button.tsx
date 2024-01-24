import { createSignal, JSX } from "solid-js";
import styles from "./Button.module.css";

export interface IButton {
  onClick: () => Promise<void>;
  active?: boolean;
  disabled?: boolean;
  children: JSX.Element;
}

export default function Button(props: IButton) {
  const [disabled, setDisabled] = createSignal<boolean>(
    props.disabled ?? false
  );
  const [touched, setTouched] = createSignal<boolean>(false);
  return (
    <div
      classList={{
        [styles.button]: true,
        [styles.active]: props.active || touched(),
        [styles.disabled]: disabled(),
      }}
      onTouchStart={() => {
        if (!disabled()) {
          setTouched(true);
        }
      }}
      onTouchEnd={() => {
        setTouched(false);
      }}
      onClick={async (e) => {
        e.stopImmediatePropagation();
        if (!disabled() && !props.active) {
          setDisabled(true);
          await props.onClick();
          setDisabled(false);
        }
      }}
    >
      {props.children}
    </div>
  );
}
