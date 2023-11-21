import { WidgetConfig, WidgetType } from "../../Widget.utils";
import { StateType } from "../../State";
import Slider from "../../Slider";

export interface IWidgetDetails {
  config: WidgetConfig<WidgetType, "Shelly">;
  values: {
    connected: boolean;
    uptime: number;
    state: StateType;
    value?: number;
  };
}

export default function WidgetDetails(props: IWidgetDetails) {
  return (
    <div>
      <div>{props.config.name}</div>
      <Slider
        onChange={(percent) => {
          console.log(percent);
        }}
        onInput={(percent) => {
          console.log(percent);
        }}
      />
    </div>
  );
}