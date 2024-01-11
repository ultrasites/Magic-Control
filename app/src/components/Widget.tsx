import { IconMode } from "./Icon";
import styles from "./Widget.module.css";
import State from "./State";
import { StateType } from "./State";
import { createSignal, useContext } from "solid-js";
import { AppContext } from "./AppProvider";
import {
  isInfoWidget,
  isFritzboxPhone,
  generateTopic,
  isShelly
} from "./Widget.utils";
import { Subscription, map } from "rxjs";
import PhoneInfo from "./widget/info/fritzbox/PhoneInfo";
import Modal from "./Modal";
import { phoneRing$ } from "./widget/info/fritzbox/PhoneInfo.observables";
import PhoneHistory from "./widget/info/fritzbox/PhoneHistory";
import WidgetDetails from "./widget/details/WidgetDetails";
import WidgetHeader from "./widget/WidgetHeader";
import { info$, status$ } from "./widget/info/shelly/Shelly.observables";
import { ShellyInfo, StatusTypes } from "./widget/info/shelly/Shelly.types";
import {
  isLightStatus,
  isShutterStatus
} from "./widget/info/shelly/Shelly.utils";
import { Device, WidgetConfig, WidgetType } from "./Widget.types";
import WidgetQuickControls from "./WidgetQuickControls";

export interface IWidget {
  onClick?: () => void;
  config: WidgetConfig<WidgetType, Device>;
}

export default function Widget(props: IWidget) {
  const { mqtt } = useContext(AppContext);
  const subscription: Subscription = new Subscription();

  const isInfo = isInfoWidget(props.config.type);
  const config = props.config;
  const id = `${props.config.name}-${props.config.type}-${props.config.device}-${props.config.mqtt.id}`;

  const [connected, setConnected] = createSignal<IconMode>("warning");
  const [state, setState] = createSignal<{
    state: StateType;
    value?: string;
  }>({
    state: "connecting"
  });
  const [phoneNumber, setPhoneNumber] = createSignal<string>("");
  const [shellyState, setShellyState] = createSignal<StatusTypes | undefined>(
    undefined
  );
  const [shellyInfo, setShellyInfo] = createSignal<ShellyInfo | undefined>(
    undefined
  );

  const connected$ = mqtt!
    .observe<boolean>(
      generateTopic(config.mqtt.id, config.mqtt.topics.connected, config)
    )
    .pipe(
      map((message) => {
        setConnected(message ? "success" : "error");
        setState({ state: message ? "idle" : "error" });
      })
    );

  const showModal = () =>
    (document.getElementById(id) as HTMLDialogElement).showModal();

  const closeModal = () =>
    (document.getElementById(id) as HTMLDialogElement).close();

  //TODO Refactor WidgetController -> Widget or InfoWidget

  Object.values(config.mqtt.topics).map(
    (topic) => mqtt?.subscribe(generateTopic(config.mqtt.id, topic, config))
  );
  subscription.add(connected$.subscribe());

  if (isShelly(config)) {
    subscription.add(
      status$<typeof config.type>(mqtt!, config).subscribe({
        next: (status) => {
          if (isLightStatus(status)) {
            setState({
              state: status.ison ? "on" : "off",
              ...(status.ison && {
                value: status.brightness.toString()
              })
            });
          }

          if (isShutterStatus(status)) {
            setState({
              state:
                status.state === "closing"
                  ? "slidingDown"
                  : status.state === "opening"
                    ? "slidingUp"
                    : status.state,
              value: status.current_pos.toString()
            });
          }
          return setShellyState(status);
        }
      })
    );

    subscription.add(
      info$<typeof config.type>(mqtt!, config).subscribe({
        next: (info) => {
          setShellyInfo(info as ShellyInfo);
        }
      })
    );
  }

  if (isFritzboxPhone(config)) {
    subscription.add(
      phoneRing$(mqtt!, config).subscribe({
        next: ([ring, phoneNumber]) => {
          setPhoneNumber(ring ? phoneNumber : "");
          if (ring) {
            showModal();
          } else {
            closeModal();
          }
        }
      })
    );
  }
  // onMount(() => {
  //   console.log("onMount Widget!!!!");
  // });

  // onCleanup(() => {
  //   Object.values(config.mqtt.topics).map(
  //     (topic) => mqtt?.unsubcribe(generateTopic(config.mqtt.id, topic, config))
  //   );
  //   subscription?.unsubscribe();
  // });

  const renderModal = () => {
    if (isFritzboxPhone(config)) {
      return (
        <PhoneInfo
          config={config}
          mode="incomingCall"
          phoneNumber={phoneNumber()}
        />
      );
    } else if (isShelly(config) && shellyState()) {
      return (
        <WidgetDetails
          config={config}
          values={{
            connected: connected(),
            uptime: shellyInfo()?.uptime,
            state: state().state,
            value: state().value,
            shellyState: shellyState()
          }}
        />
      );
    }
  };

  return (
    <>
      <div
        onClick={() => !isFritzboxPhone(config) && showModal()}
        classList={{
          [styles.widget]: true,
          [styles.info]: isInfo
        }}
      >
        <div
          classList={{
            [styles.content]: true
          }}
        >
          <WidgetHeader
            mode={connected()}
            name={config.name}
            position={config.position}
          />
          <div>
            {isFritzboxPhone(config) && <PhoneHistory config={config} />}
            {!isInfo && <State state={state().state} value={state().value} />}
          </div>
        </div>
        {!isInfo && shellyState() && (
          <div class={styles.quickIncludes}>
            <WidgetQuickControls config={config} state={shellyState()} />
          </div>
        )}
      </div>
      <Modal id={id}>{renderModal()}</Modal>
    </>
  );
}
