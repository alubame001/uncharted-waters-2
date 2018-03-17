import renderInterface from "./interface";
import "./sass/styles.scss";

import assets from "./assets";
import renderPort from "./port/";
import sound from "./sound";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    await navigator.serviceWorker.register("/sw.js");
  });
}

(async () => {
  await assets.load();
  renderInterface();
  renderPort();
  sound();
})();
