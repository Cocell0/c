<template>
  <span>
    <button
      class="button--icon"
      aria-label="Edit chat's properties"
      title="Edit chat's properties"
      @click="showModal = true"
    >
      <span
        class="i-material-symbols:edit-rounded"
        aria-hidden="true"
        translate="no"
        inert
      ></span>
    </button>
    <Modal title="Edit chat" v-model:open="showModal">
      <div
        style="
          display: flex;
          flex-direction: column;
          gap: var(--spacing--B);
          margin-bottom: var(--spacing--C);
        "
      >
        <label for="chat-name">Chat Name:</label>
        <input
          id="chat-name"
          v-model="changes.name"
          @keydown.enter="saveChanges"
        />
      </div>
      <div
        style="display: flex; flex-direction: column; gap: var(--spacing--B)"
      >
        <button
          aria-label="Delete chat"
          title="Delete chat"
          @click="deleteChat"
        >
          <span
            class="i-material-symbols:delete-rounded"
            aria-hidden="true"
            translate="no"
            inert
          ></span>
          <span>Delete chat</span>
        </button>
      </div>
      <template #action>
        <button @click="showModal = false">Cancel</button>
        <button @click="saveChanges">Save</button>
      </template>
    </Modal>
  </span>
</template>

<script setup>
import { ref } from "vue";
import Modal from "core/src/vue/components/Modal.vue";
import { useChatsStore } from "../store/useChatsStore";

const emit = defineEmits(["update:edited", "update:deleted"]);
const chatsStore = useChatsStore();

const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
});

const showModal = ref(false);

const changes = ref({
  name: props.chat.name,
});

async function saveChanges() {
  await chatsStore.updateChat(props.chat.key, changes.value);
  showModal.value = false;
  emit("update:edited", props.chat.key);
}

async function deleteChat() {
  if (
    confirm("Are you sure you want to delete this chat?") &&
    prompt(
      `Are you really, really sure? This CANNOT be undone.\n\nType "yes" to show you are serious.`,
    ).toLowerCase() === "yes"
  ) {
    await chatsStore.deleteChat(props.chat.key);
    showModal.value = false;
    emit("update:deleted", props.chat.key);
  }
}
</script>
