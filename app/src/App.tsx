import { createSlider } from "solid-slider";
import { For, onMount } from "solid-js";
import Widget from "./components/Widget";
import styles from "./App.module.css";
import "solid-slider/slider.css";
import { defaultConfig } from "./defaultConfig";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/de";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale("de");

function App() {
  const [slider] = createSlider({ loop: true });
  let ref: HTMLDivElement;
  onMount(() => {
    slider(ref);
  });

  const config = defaultConfig;

  const maxItemOnSlide = 4;
  const countSlides = Math.ceil(defaultConfig.length / maxItemOnSlide);

  return (
    <>
      <div ref={ref!}>
        {[...Array(countSlides).keys()].map((_, idx) => {
          return (
            <div class={styles.slide}>
              <For
                each={config.filter((_, configIdx) => {
                  return (
                    configIdx < idx + 1 * maxItemOnSlide &&
                    configIdx >= idx + 1 * maxItemOnSlide - maxItemOnSlide
                  );
                })}
                fallback={"loading..."}
              >
                {(widgetConfig) => <Widget config={widgetConfig} />}
              </For>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
