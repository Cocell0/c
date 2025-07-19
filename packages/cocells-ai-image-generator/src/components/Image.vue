<template>
  <div class="image-container">
    <img :src="image" :alt="`Generated Image ${prompt}`" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const image = ref('')
const props = defineProps({
  prompt: {
    type: String,
    required: true
  }
})

</script>