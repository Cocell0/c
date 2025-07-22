<template>
  <a :href="'/#' + href" :class="{ active: isActive }">
    <slot />
  </a>
</template>

<script setup>
import { computed, toRef } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  href: {
    type: String,
    required: true
  }
})

const href = toRef(props, 'href')
const activeRoute = useRoute()

const isActive = computed(() => activeRoute.path === href.value)
</script>
