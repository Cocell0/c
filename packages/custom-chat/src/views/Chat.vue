<template>
  <main class="chat-view">
    <section class="panel" v-if="!(screenWidth <= 768 && id)">
      <h3
        style="
          display: flex;
          align-items: center;
          gap: var(--spacing--B);
          line-height: normal;
        "
      >
        <!-- <AnchorLink href="/" class="button button--icon"><span class="i-material-symbols:arrow-back-rounded" aria-hidden="true" translate="no" inert></span></AnchorLink> -->
        <AnchorLink
          href="/c"
          style="
            flex: auto;
            text-decoration: none;
            color: inherit;
            padding-left: var(--spacing--A);
          "
          >Chats</AnchorLink
        >
        <Add />
      </h3>
      <div class="chat-search">
        <span
          class="i-material-symbols:search-rounded icon"
          aria-hidden="true"
          translate="no"
          inert
        ></span>
        <input
          type="text"
          placeholder="Search chats"
          v-model="searchQuery"
          name="Query"
        />
      </div>
      <ul class="chat-tabs" role="tablist" @keydown="onKeydown">
        <li
          v-for="(chat, index) in filteredChats"
          :key="chat.id"
          :ref="(el) => (tabAnchors[index] = el)"
        >
          <AnchorLink
            :href="`/c/${chat.id}`"
            class="button"
            :tabindex="focusedIndex === index ? 0 : -1"
            role="tab"
            :aria-selected="chat.id === id"
          >
            {{ chat.name }}
          </AnchorLink>
        </li>
      </ul>
      <div style="padding-top: var(--spacing--C)"><DarkMode /></div>
    </section>
    <section class="chat-panel" v-if="id">
      <h3
        style="
          display: flex;
          align-items: center;
          gap: var(--spacing--B);
          line-height: normal;
        "
      >
        <AnchorLink
          href="/c"
          class="button button--icon"
          v-if="screenWidth <= 768"
        >
          <span
            class="i-material-symbols:arrow-back-rounded"
            aria-hidden="true"
            translate="no"
            inert
          ></span>
        </AnchorLink>
        <span v-if="chat">{{ chat.name }}</span>
      </h3>
      <Chat :config="config"></Chat>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useChatsStore } from "../store/useChatsStore";
import AnchorLink from "core/src/vue/components/AnchorLink.vue";
import useRovingIndex from "core/src/vue/composables/useRovingIndex.js";
import Fuse from "fuse.js";
import Chat from "@/components/Chat.vue";
import Add from "@/components/Add.vue";
import DarkMode from "core/src/vue/components/DarkMode.vue";

const route = useRoute();
const id = computed(() => route.params.id);
const chatsStore = useChatsStore();
const chats = computed(() => [
  ...chatsStore.globalChats,
  ...chatsStore.savedChats,
]);
const chat = computed(() => chats.value.find((chat) => chat.id === id.value));
const screenWidth = ref(window.innerWidth);
const searchQuery = ref("");

const config = computed(() => ({
  id: chat.value ? chat.value.id : null,
  name: chat.value ? chat.value.name : "New chat",
  adminPassword:
    "54aeb8a29d48e5c37d39fe9a39c2eb5f190f1cd896b3ca3b24e974c066cbd8f8",
}));

const filteredChats = computed(() => {
  if (!searchQuery.value) {
    return chats.value;
  }
  const fuse = new Fuse(chats.value, {
    keys: ["name"],
    threshold: 0.5,
  });
  return fuse.search(searchQuery.value).map((result) => result.item);
});

const { tabAnchors, focusedIndex, onKeydown } = useRovingIndex(
  filteredChats,
  id,
);

watch([filteredChats, id], async () => {
  if (chat.value) {
    document.title = chat.value.name;
  }
});

window.addEventListener("resize", () => {
  screenWidth.value = window.innerWidth;
});

onMounted(() => {
  chatsStore.initializeDB();
  if (chat.value === undefined && id.value !== undefined)
    window.location.hash = "#/c"; // This is an ugly lookin' solution that works
});
</script>
