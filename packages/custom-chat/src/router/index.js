import { createRouter, createWebHashHistory } from "vue-router";
import Chat from "@/views/Chat.vue";
import Home from "@/views/Home.vue";

const routes = [
  {
    name: "Home",
    path: "/",
    component: Home,
    meta: { title: "Home" },
    redirect: "/c",
  },
  {
    path: "/c",
    name: "Chat Empty",
    component: Chat,
    meta: { title: "Chat" },
  },
  {
    path: "/c/:key",
    component: Chat,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
