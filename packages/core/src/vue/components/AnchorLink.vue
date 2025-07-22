<template>
  <a @keydown="open" ref="anchor" :href="'#' + href" :class="{ active: isActive }">
    <slot />
  </a>
</template>

<script setup>
import { computed, ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  href: {
    type: String,
    required: true
  }
});

const anchor = ref(null);
const href = toRef(props, 'href');
const activeRoute = useRoute();

const isActive = computed(() => activeRoute.path === href.value)

function open(event) {
  if (event.key === ' ')
    anchor.value.click()
}
</script>
