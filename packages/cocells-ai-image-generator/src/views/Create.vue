<template>
  <div class="drawer" role="toolbar">
    <DarkMode />
    <button @click="toggleConfigurationBar" class="button--icon"
      :aria-label="state.openConfigurationBar ? 'Close configuration' : 'Open configuration'">
      <span
        :class="{ 'i-material-symbols-close-rounded': state.openConfigurationBar, 'i-material-symbols-settings-rounded': !state.openConfigurationBar }"></span>
    </button>
  </div>
  <MainContent @toggle-configuration-bar="toggleConfigurationBar" />
  <div class="panel">
    <Sidebar ref="configurationSidebar" @close="toggleConfigurationBar" :open="state.openConfigurationBar"
      class="configuration-bar relative" position="right">
      <h3 class="my-2.5rem text-center">Configuration</h3>
      <AnchorLink href="/images" class="button">Images</AnchorLink>
    </Sidebar>
  </div>
</template>

<script setup>
import DarkMode from 'core/src/vue/components/DarkMode.vue';
import AnchorLink from 'core/src/vue/components/AnchorLink.vue';
import Sidebar from 'core/src/vue/components/Sidebar.vue';
import MainContent from '@/components/MainContent.vue';
import { ref, onMounted, computed } from 'vue';

const state = ref({
  openNavigationBar: false,
  openConfigurationBar: false,
  screenWidth: ref(window.innerWidth),
});

onMounted(() => window.addEventListener('resize', () => {
  state.value.screenWidth = window.innerWidth
}))

const hideMenuButton = computed(() =>
  state.value.screenWidth <= 768 && state.value.openConfigurationBar
)

function toggleNavigationBar() {
  state.value.openNavigationBar = !state.value.openNavigationBar;
  if (state.value.openConfigurationBar) {
    state.value.openConfigurationBar = false;
  }
}

function toggleConfigurationBar() {
  state.value.openConfigurationBar = !state.value.openConfigurationBar;
  if (state.value.openNavigationBar) {
    state.value.openNavigationBar = false;
  }
}
</script>