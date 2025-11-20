<template>
  {{ config }}
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  config: {
    type: Object,
    required: true
  },
});
</script>