import styles from "./WidgetHeader.module.css";
import Icon from "../Icon";
import { IconMode } from "../Icon";

export interface IWidgetHeader {
  name: string;
  position?: string;
  mode: IconMode;
}

export default function WidgetHeader(props: IWidgetHeader) {
  return (
    <div>
      <div>
        {props.name} <Icon icon="wifi" mode={props.mode} style="solid" />
      </div>
      <div class={styles.position}>{props.position}</div>
    </div>
  );
}
