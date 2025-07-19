<template>
  <div class="panel">
    <div class="drawer">
      <button @click="toggleNavigationBar" class="button--icon" :class="{ 'opacity-0': hideMenuButton }"
        :inert="hideMenuButton" :aria-label="state.openNavigationBar ? 'Close sidebar' : 'Open sidebar'">
        <span
          :class="{ 'i-material-symbols-menu-open-rounded': state.openNavigationBar, 'i-material-symbols-menu-rounded': !state.openNavigationBar }"></span>
      </button>
    </div>

    <Sidebar ref="navigationSidebar" @close="toggleNavigationBar" role="navigation" :open="state.openNavigationBar" class="navigation-bar"></Sidebar>
  </div>
  <MainContent @toggle-configuration-bar="toggleConfigurationBar"></MainContent>
  <div class="panel">
    <Sidebar ref="configurationSidebar" @close="toggleConfigurationBar" :open="state.openConfigurationBar" class="configuration-bar relative" position="right">
      <button class="button--icon close-button" aria-label="Close configuration" @click="toggleConfigurationBar">
        <span class="i-material-symbols-close-rounded"></span>
      </button>
      <h2 class="mt-2.5rem">Right Sidebar</h2>
      <p>This is the right sidebar content.</p>
    </Sidebar>
  </div>
</template>

<script setup>
import Sidebar from 'core/src/vue/components/Sidebar.vue';
import MainContent from 'cocells-ai-image-generator/src/assets/components/MainContent.vue';
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