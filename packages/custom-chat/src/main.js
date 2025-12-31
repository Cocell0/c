import "virtual:uno.css";
import "core/src/font.css";
import "c-style";
import "./assets/main.scss";
import "core/src/paramount.css";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

import { useChatsStore } from "@/store/useChatsStore";

router.afterEach((route) => {
  const title = route.meta?.title;
  if (title) document.title = title;

  if (import.meta.env.PROD) {
    if (window.gtag)
      gtag("config", "G-QCJD60XX2F", { page_path: route.fullPath });
  }
});

// For environments that do not support crypto.randomUUID
if (!crypto.randomUUID) {
  crypto.randomUUID = function () {
    const bytes = crypto.getRandomValues
      ? crypto.getRandomValues(new Uint8Array(16))
      : Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"));

    return (
      hex.slice(0, 4).join("") +
      "-" +
      hex.slice(4, 6).join("") +
      "-" +
      hex.slice(6, 8).join("") +
      "-" +
      hex.slice(8, 10).join("") +
      "-" +
      hex.slice(10, 16).join("")
    );
  };
}

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(VueVirtualScroller);

const chatsStore = useChatsStore();
await chatsStore.initializeDB();

app.mount("#app");
