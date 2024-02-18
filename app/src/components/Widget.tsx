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
import { Subscription, map, pairwise } from "rxjs";
import { phoneRing$ } from "./widget/info/fritzbox/PhoneInfo.observables";
import PhoneHistory from "./widget/info/fritzbox/PhoneHistory";
import WidgetHeader from "./widget/WidgetHeader";
import {
  info$,
  status$,
  triggerCloseGarageGate$
} from "./widget/info/shelly/Shelly.observables";
import { ShellyInfo, StatusTypes } from "./widget/info/shelly/Shelly.types";
import {
  isGarageGateStatus,
  isLightStatus,
  isShutterStatus
} from "./widget/info/shelly/Shelly.utils";
import { Device, WidgetConfig, WidgetType } from "./Widget.types";
import WidgetQuickControls from "./WidgetQuickControls";

export interface IWidget {
  onClick?: () => void;
  config: WidgetConfig<WidgetType, Device>;
}
export const TIME_GARAGE_GATE_DOWN = 19000;
export const TIME_GARAGE_GATE_UP = 12000;
export const GARAGE_GATE_OFFSET = 2000;

export default function Widget(props: IWidget) {
  const { mqtt, translate } = useContext(AppContext);
  const t = translate!;
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
  const [_phoneNumber, setPhoneNumber] = createSignal<string>("");
  const [shellyState, setShellyState] = createSignal<StatusTypes | undefined>(
    undefined
  );
  const [_shellyInfo, setShellyInfo] = createSignal<ShellyInfo | undefined>(
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
    const garageGateStatus$ = status$<typeof config.type>(mqtt!, config)
      .pipe(pairwise())
      .subscribe({
        next: ([prevStatus, status]) => {
          console.log("hier");
          if (isGarageGateStatus(status) && isGarageGateStatus(prevStatus)) {
            console.log(status);
            if (!prevStatus.state && status.state) {
              setState({
                state: "slidingUp"
              });

              setTimeout(() => {
                setState({
                  state: "open"
                });
              }, TIME_GARAGE_GATE_UP);
            }

            if (prevStatus.state && !status.state) {
              setState({
                state: "closed"
              });
            }
          }
        }
      });

    const simpleStatus$ = status$<typeof config.type>(mqtt!, config).subscribe({
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
    });

    subscription.add(
      config.type === "GARAGE_GATE" ? garageGateStatus$ : simpleStatus$
    );

    if (config.type === "GARAGE_GATE") {
      subscription.add(
        triggerCloseGarageGate$.subscribe({
          next: () => {
            setState({
              state: "slidingDown"
            });

            setTimeout(() => {
              if (state().state !== "closed") {
                setState({
                  state: "error",
                  value: t("errorGarageGateDown")
                });
              }
            }, TIME_GARAGE_GATE_DOWN + GARAGE_GATE_OFFSET);
          }
        })
      );
    }

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

  // const renderModal = () => {
  //   if (isFritzboxPhone(config)) {
  //     return (
  //       <PhoneInfo
  //         config={config}
  //         mode="incomingCall"
  //         phoneNumber={phoneNumber()}
  //       />
  //     );
  //   } else if (isShelly(config) && shellyState()) {
  //     return (
  //       <WidgetDetails
  //         config={config}
  //         values={{
  //           connected: connected(),
  //           uptime: shellyInfo()?.uptime,
  //           state: state().state,
  //           value: state().value,
  //           shellyState: shellyState()
  //         }}
  //       />
  //     );
  //   }
  // };

  return (
    <>
      <div
        // onClick={() => !isFritzboxPhone(config) && showModal()}
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
            {!isInfo && (
              <State
                state={state().state}
                value={`${state().value ?? ""}${
                  state().value &&
                  (config.type === "DIMMED_LIGHT" || config.type === "SHUTTER")
                    ? "%"
                    : ""
                }`}
              />
            )}
          </div>
        </div>
        {!isInfo && shellyState() && (
          <div class={styles.quickIncludes}>
            <WidgetQuickControls
              config={config}
              shellyState={shellyState()}
              state={state().state}
            />
          </div>
        )}
      </div>
      {/* <Modal id={id}>{renderModal()}</Modal> */}
    </>
  );
}
