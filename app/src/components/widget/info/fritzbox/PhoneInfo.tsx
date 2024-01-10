import Icon from "../../../Icon";
import styles from "./PhoneInfo.module.css";
import {} from "../../../Widget.utils";
import { WidgetConfig } from "../../../Widget.types";
import { useContext } from "solid-js";
import { AppContext } from "../../../AppProvider";

export interface IPhoneInfo {
  config: WidgetConfig<"PHONE", "Fritzbox">;
  mode: "incomingCall" | "activeCall";
  phoneNumber?: string;
}

//TODO analyse and implement "activeCall" with duration programatically

export default function PhoneInfo(props: IPhoneInfo) {
  const { translate } = useContext(AppContext);
  const t = translate!;
  return (
    <>
      {props.phoneNumber && (
        <div class={styles.phoneInfo}>
          <div>
            <Icon icon="phone" mode="success" style="solid" size="big" />
          </div>
          <div>
            <div
              classList={{
                // [styles.error]: props.mode === "incomingCall",
                [styles.success]: true
              }}
            >
              {t(props.mode === "activeCall" ? "activeCall" : "incomingCall")}
            </div>
            <div class={styles.phoneNumber}>{props.phoneNumber}</div>
          </div>
        </div>
      )}
    </>
  );
}
