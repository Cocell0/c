<template>
  <section class="chat-panel" v-if="chat">
    <div
      style="
        display: flex;
        align-items: center;
        padding: var(--spacing--C);
        gap: var(--spacing--B);
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
      <h3 class="chat-name" style="line-height: normal">
        {{ chat.name }}
      </h3>
    </div>

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
