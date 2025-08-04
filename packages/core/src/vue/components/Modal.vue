<template>
  <dialog ref="modal" @click="closeOnBackdrop" class="modal">
    <div class="head">
      <div class="title-container">
        <h3>{{ props.title }}</h3>
      </div>
      <div class="close-button-container">
        <button @click="closeModal" :aria-label="`Close ${props.title}`" class="button--icon">
          <span class="i-material-symbols-close"></span>
        </button>
      </div>
    </div>
    <div class="body">
      <slot />
    </div>
    <div class="action" v-if="$slots.action">
      <slot name="action" />
    </div>
  </dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
})
const emit = defineEmits(['update:open'])

const modal = ref(null)

function openModal() {
  if (!modal.value.open) modal.value.showModal()
}

function closeModal() {
  if (modal.value.open) modal.value.close()
  emit('update:open', false)
}

function closeOnBackdrop(event) {
  const isBackdrop = event.target === modal.value && !modal.value.querySelector(':hover')
  if (isBackdrop) closeModal()
}

watch(() => props.open, (value) => {
  if (value) openModal()
  else closeModal()
})

onMounted(() => {
  modal.value.addEventListener('close', () => {
    emit('update:open', false)
  })
})
</script>

<style lang="scss" scoped>
.modal {
  --rounding: calc(var(--base__spacing) * 6.5);
  user-select: inherit;
  border: none;
  border-radius: var(--rounding);
  background-color: var(--color__background);
  height: 100%;
  min-height: 140px;
  max-height: 80vh;
  max-height: 80dvh;
  width: 100%;
  min-width: 240px;
  max-width: 54vw;
  max-width: 54dvw;
  position: relative;
  inset: 0;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%) scale(1);
  flex-direction: column;
  opacity: 1;
  outline: none;

  @media (max-width: 768px) {
    & {
      max-width: 94vw;
      max-width: 94dvw;
    }
  }

  &:open {
    display: flex;
  }

  &::backdrop {
    background-color: hsl(0 0% 0% / 70%);
    backdrop-filter: blur(var(--blur-A));
  }

  >* {
    background-color: var(--color__background);
    padding: var(--spacing-C);
  }

  >*:not(:last-child) {
    border-bottom: 1px solid var(--color__border-divider);
  }

  .head {
    display: flex;
    padding: var(--spacing-C);

    .title-container {
      padding-left: calc(var(--spacing-C) * 2 + var(--min-dimension));
      flex: 1;
      overflow: hidden;

      h3 {
        margin: 0;
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow: clip;
      }
    }
  }

  .body {
    flex: 1;
  }

  .action {
    display: flex;
    gap: var(--spacing-B);

    >* {
      flex: 1;
    }
  }
}
</style>