import styles from "./Icon.module.css";

export type IconMode = "success" | "warning" | "error" | "default";
export type IconType = "wifi" | "phone" | "arrow-left" | "arrow-right";
export type IconStyle = "regular" | "solid";
export type IconSize = "normal" | "big";

export interface IIcon {
  mode: IconMode;
  icon: IconType;
  style: IconStyle;
  size?: IconSize;
}

export default function Icon(props: IIcon) {
  return (
    <div
      classList={{
        "fa-regular": props.style === "regular",
        "fa-solid": props.style === "solid",
        "fa-wifi": props.icon === "wifi",
        "fa-phone": props.icon === "phone",
        "fa-arrow-left": props.icon === "arrow-left",
        "fa-arrow-right": props.icon === "arrow-right",
        [styles.big]: props.size === "big",
        [styles.success]: props.mode === "success",
        [styles.warning]: props.mode === "warning",
        [styles.error]: props.mode === "error",
      }}
    ></div>
  );
}
