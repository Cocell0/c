<template>
  <section class="chat-panel" v-if="key">
    <h3
      class="chat-name"
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

      <button
        style="
          width: 100%;
          padding-block: 0;
          text-align: left;
          justify-content: start;
        "
        v-if="chat"
      >
        {{ chat.name }}
      </button>
    </h3>

    <Chat :config="config" />
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import Chat from "@/components/Chat.vue";
import AnchorLink from "core/src/vue/components/AnchorLink.vue";
import { useRoute } from "vue-router";
import { useChatsStore } from "../store/useChatsStore";

const route = useRoute();
const key = computed(() => route.params.key);
const chatsStore = useChatsStore();

const chat = computed(() =>
  chatsStore.userChats
    .concat(chatsStore.systemChats)
    .find((c) => c.key === key.value),
);

const screenWidth = ref(window.innerWidth);

function handleResize() {
  screenWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const config = computed(() => ({
  channel: chat.value ? chat.value.channel : null,
  name: chat.value ? chat.value.name : "New chat",
  adminPassword:
    "54aeb8a29d48e5c37d39fe9a39c2eb5f190f1cd896b3ca3b24e974c066cbd8f8",
}));
</script>
