<template>
  <teleport to="body">
    <dialog ref="modal" @pointerup="closeByBackdrop" :class="{ closing: isClosing }" v-bind="$attrs">
      <div class="container">
        <button @click="startClose">Close</button>
      </div>
    </dialog>
  </teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["update:open", "opened", "closed"]);

const modal = ref(null);
const isClosing = ref(false);

let prefersReducedMotion;

function openModal() {
  if (!modal.value.open) {
    modal.value.showModal();
    emit("opened");
  }
}

function startClose() {
  if (!modal.value.open) return;

  if (prefersReducedMotion.matches) {
    finalizeClose();
    return;
  }

  isClosing.value = true;
}

function finalizeClose() {
  if (!modal.value.open) return;
  modal.value.close();
  isClosing.value = false;
  emit("update:open", false);
  emit("closed");
}

function closeByBackdrop(event) {
  if (event.target === modal.value) {
    emit("update:open", false);
  }
}

function handleAnimationEnd(event) {
  if (!isClosing.value) return;
  if (event.target !== modal.value) return;
  finalizeClose();
}

watch(
  () => props.open,
  (value) => {
    if (value) {
      isClosing.value = false;
      openModal();
    } else {
      startClose();
    }
  },
);

onMounted(() => {
  prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  modal.value.addEventListener("animationend", handleAnimationEnd);
  modal.value.addEventListener("close", () => {
    emit("update:open", false);
  });
});

onBeforeUnmount(() => {
  modal.value?.removeEventListener("animationend", handleAnimationEnd);
});

</script>

<style lang="scss" scoped>
@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes dialog-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-50px);
  }
}
@keyframes backdrop-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes backdrop-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes container-in {
  from {
    height: 35%;
  }
  to {
    height: 100%;
  }
}
@keyframes container-out {
  from {
    height: 100%;
  }
  to {
    height: 35%;
  }
}

dialog {
  margin: auto;
  background: none;

  &::backdrop {
    background: oklch(0.1 var(--chroma) var(--hue) / 0.32);
    backdrop-filter: blur(var(--blur));
  }

  .container {
    position: relative;
    min-width: 280px;
    min-height: 140px;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--color__background);
      border-radius: var(--rounding--B);
    }
  }
}

@media (prefers-reduced-motion: no-preference) {
  dialog {
    opacity: 0;
    transform: translateY(-50px);

    &[open] {
      animation: dialog-in 500ms var(--bezier__normal) forwards;

      &::backdrop {
        animation: backdrop-in 500ms var(--bezier__normal) forwards;
      }

      .container::before {
        animation: container-in 500ms var(--bezier__normal) forwards;
      }
    }
    &.closing {
      animation: dialog-out 500ms var(--bezier__normal) forwards;

      &::backdrop {
        animation: backdrop-out 500ms var(--bezier__normal) forwards;
      }

      .container::before {
        animation: container-out 500ms var(--bezier__normal) forwards;
      }
    }
  }
}
</style>
