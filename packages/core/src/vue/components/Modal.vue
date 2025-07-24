<template>
  <dialog ref="dialogElement">
    <button @click="closeModal" aria-label="Close modal">×</button>
    <slot />
  </dialog>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const dialogElement = ref(null)

const openModal = () => {
  if (!dialogElement.value.open) dialogElement.value.showModal()
}

const closeModal = () => {
  if (dialogElement.value.open) dialogElement.value.close()
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (value) => {
  if (value) openModal()
  else closeModal()
})

onMounted(() => {
  dialogElement.value.addEventListener('close', () => {
    emit('update:modelValue', false)
  })
})
</script>
