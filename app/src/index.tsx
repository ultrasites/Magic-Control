/* @refresh reload */
import { render } from "solid-js/web";
import "./shared.css";

import App from "./App";
import { AppProvider } from "./components/AppProvider";

if (process.env.NODE_ENV === "development") {
  import("./index.css");
  import("./fontawesome.css");
}

document.addEventListener(
  process.env.NODE_ENV === "development"
    ? "DOMContentLoaded"
    : "DOM_LOADED_FOR_MMIO",
  () => {
    const root = document.getElementById("mm-io-root");

    render(
      () => (
        <AppProvider>
          <App />
        </AppProvider>
      ),
      root!
    );
  }
);
