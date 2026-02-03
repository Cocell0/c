<template>
  <Tooltip text="Open keys modal" tooltipStyle="left: 0;">
    <button
      class="button--icon"
      @click="isOpen = true"
      aria-label="Open keys modal"
    >
      <span class="i-material-symbols:key-rounded"></span>
    </button>
    <Modal v-model:open="isOpen" title="Keys">
      <div>
        <label for="public-key-field">Public key:</label>
        <input
          id="public-key-field"
          v-model="publicKey"
          placeholder="Public Key"
          readonly
        />
      </div>
    </Modal>
  </Tooltip>
</template>
<script setup>
import { ref } from "vue";
import Modal from "core/src/vue/components/Modal.vue";
import { useSecretsStore } from "@/stores/useSecretsStore";

const secretsStore = useSecretsStore();

const { publicKey } = secretsStore;
const isOpen = ref(false);
</script>
<style scoped lang="scss">
.modal {
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing--B);

    label {
      font-weight: bold;
      display: block;
    }

    input {
      width: 100%;
      font-family: var(--font-mono);
      margin-bottom: var(--spacing--C);
      -webkit-text-security: disc;
      &:focus {
        -webkit-text-security: unset;
      }
      @media (hover: hover) {
        &:hover {
          -webkit-text-security: unset;
        }
      }
    }
  }
}
</style>
