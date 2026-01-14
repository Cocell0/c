<template>
  <main class="chat-view">
    <section class="panel" v-if="!(screenWidth <= 768 && key)">
      <h3
        style="
          display: flex;
          align-items: center;
          gap: var(--spacing--B);
          line-height: normal;
          padding: var(--spacing--C);
          margin-bottom: 0;
        "
      >
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

      <div class="chat-search" style="padding-inline: var(--spacing--C)">
        <span
          class="i-material-symbols:search-rounded icon"
          aria-hidden="true"
          translate="no"
          inert
        ></span>
        <input
          type="text"
          placeholder="Search chats"
          aria-label="Search chats"
          title="Search chats"
          autocomplete="off"
          v-model="searchQuery"
          name="Query"
        />
      </div>

      <ul
        class="chat-tabs"
        role="tablist"
        style="padding: var(--spacing--C)"
        @keydown="onKeydown"
      >
        <li
          v-for="(c, index) in filteredChats"
          :key="c.key"
          :ref="(el) => setTabAnchor(index, el)"
        >
          <AnchorLink
            :href="`/c/${c.key}`"
            class="button"
            :tabindex="focusedIndex === index ? 0 : -1"
            role="tab"
            :aria-selected="c.key === key"
          >
            {{ c.name }}
          </AnchorLink>
        </li>
      </ul>

      <div
        style="
          padding: var(--spacing--C);
          display: flex;
          gap: var(--spacing--A);
        "
      >
        <ThemeSwitcher />
        <Fullscreen />
        <Settings />
      </div>
    </section>
    <ChatPanel :chatKey="key || ''" />
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useChatsStore } from "../store/useChatsStore";
import useRovingIndex from "core/src/vue/composables/useRovingIndex.js";
import { useRoute } from "vue-router";

import AnchorLink from "core/src/vue/components/AnchorLink.vue";
import Fuse from "fuse.js";
import Add from "@/components/Add.vue";
import ChatPanel from "@/components/ChatPanel.vue";
import ThemeSwitcher from "core/src/vue/components/ThemeSwitcher.vue";
import Settings from "@/components/Settings.vue";
import Fullscreen from "core/src/vue/components/Fullscreen.vue";

const route = useRoute();
const key = computed(() => route.params.key);
const chatsStore = useChatsStore();

const chat = computed(() =>
  chatsStore.allChats.find((c) => c.key === key.value),
);

const screenWidth = ref(window.innerWidth);
const searchQuery = ref("");

const filteredChats = computed(() => {
  if (!searchQuery.value) return chatsStore.allChats;
  const fuse = new Fuse(chatsStore.allChats, {
    keys: ["name"],
    threshold: 0.5,
  });
  return fuse.search(searchQuery.value).map((r) => r.item);
});

const { tabAnchors, focusedIndex, onKeydown } = useRovingIndex(
  filteredChats,
  key,
);

function setTabAnchor(index, el) {
  if (!tabAnchors || !tabAnchors.value) return;
  tabAnchors.value[index] = el;
}

watch([filteredChats, key], () => {
  if (chat.value) document.title = chat.value.name;
});

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(async () => {
  window.addEventListener("resize", handleResize);
  await chatsStore.initializeDB();
  if (key.value && !chat.value) window.location.hash = "#/c";
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
