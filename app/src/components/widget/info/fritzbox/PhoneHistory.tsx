import { generateTopic } from "../../../Widget.utils";
import { For, createSignal, onCleanup, onMount, useContext } from "solid-js";
import { Subscription, map } from "rxjs";
import { AppContext } from "../../../AppProvider";
import styles from "./PhoneHistory.module.css";
import { phoneHistoryFromDTO } from "./PhoneHistory.utils";
import type { PhoneHistory, PhoneHistoryDTO } from "./PhoneHistory.types";
import Icon from "../../../Icon";
import { WidgetConfig } from "../../../Widget.types";

export interface IPhoneHistory {
  config: WidgetConfig<"PHONE", "Fritzbox">;
}

//TODO analyse and implement "activeCall" with duration programatically

export default function PhoneHistory(props: IPhoneHistory) {
  const { mqtt } = useContext(AppContext);

  const [phoneHistoryData, setPhoneHistoryData] = createSignal<
    PhoneHistory[] | undefined
  >(undefined);

  const subscription: Subscription = new Subscription();

  const history$ = mqtt!
    .observe<PhoneHistoryDTO[]>(
      generateTopic(
        props.config.mqtt.id,
        props.config.mqtt.topics.history,
        props.config
      )
    )
    .pipe(
      map((phoneHistory) => {
        if (Array.isArray(phoneHistory)) {
          setPhoneHistoryData(phoneHistory.map(phoneHistoryFromDTO));
        }
      })
    );

  onMount(() => {
    subscription.add(history$.subscribe());
  });

  onCleanup(() => {
    subscription.unsubscribe();
  });

  return (
    <>
      {phoneHistoryData() && (
        <div class={styles.history}>
          <For
            each={phoneHistoryData()?.filter((_, idx) => idx < 3)}
            fallback="Loading..."
          >
            {(item) => (
              <>
                <div>
                  <Icon
                    icon={
                      item.mode === "ingoing" ? "arrow-right" : "arrow-left"
                    }
                    mode={item.mode === "ingoing" ? "success" : "error"}
                    style="solid"
                  />
                </div>
                <div class={styles.date}>{item.date}</div>
                <div class={styles.phoneNumber}>{item.phoneNumber}</div>
              </>
            )}
          </For>
        </div>
      )}
    </>
  );
}
