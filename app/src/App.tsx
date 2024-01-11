import { createSlider } from "solid-slider";
import { onMount } from "solid-js";
import Widget from "./components/Widget";
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
  const [slider] = createSlider({ slides: { perView: 5, spacing: 5 } });
  let ref: HTMLDivElement;
  onMount(() => {
    slider(ref);
  });

  const config = defaultConfig;

  return (
    <div ref={ref!}>
      {config.map((widgetConfig) => (
        <Widget config={widgetConfig} />
      ))}
    </div>
  );
}

export default App;
