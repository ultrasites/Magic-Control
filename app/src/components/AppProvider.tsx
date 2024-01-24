import { createContext, createMemo, JSX } from "solid-js";
import { MQTT } from "../services/mqtt";
import { de_dict } from "../i18n";
import * as i18n from "@solid-primitives/i18n";
import { Translator } from "@solid-primitives/i18n";

export const AppContext = createContext<{
  mqtt: MQTT | undefined;
  translate: Translator<typeof de_dict> | undefined;
}>({
  mqtt: undefined,
  translate: undefined
});

export function AppProvider(props: { children: JSX.Element }) {
  const mqtt = new MQTT();

  const translate = i18n.translator(createMemo(() => i18n.flatten(de_dict)));

  return (
    <AppContext.Provider value={{ mqtt, translate }}>
      {props.children}
    </AppContext.Provider>
  );
}
