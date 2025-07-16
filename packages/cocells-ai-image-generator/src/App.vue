<template>
  <div class="backdrop" @click="closeSidebars" :class="{ 'backdrop--show': state.backdrop }"></div>
  <div class="panel">
    <div class="drawer">
      <button @click="toggleNavigationBar" class="button--icon"
        :aria-label="state.openNavigationBar ? 'Close sidebar' : 'Open sidebar'">
        <span
          :class="{ 'i-material-symbols-menu-open-rounded': state.openNavigationBar, 'i-material-symbols-menu-rounded': !state.openNavigationBar }"></span>
      </button>
      <button @click="toggleRightSidebar" class="button--icon"
        :aria-label="state.openConfigurationBar ? 'Close sidebar' : 'Open sidebar'">
        <span
          :class="{ 'i-material-symbols-menu-open-rounded': state.openConfigurationBar, 'i-material-symbols-menu-rounded': !state.openConfigurationBar }"></span>
      </button>
    </div>

    <Sidebar role="navigation" :open="state.openNavigationBar" class="sidebar--left navigation-bar">
      <button>hi</button>
    </Sidebar>
  </div>
  <MainContent></MainContent>
  <div class="panel">
    <Sidebar :open="state.openConfigurationBar" class="sidebar--right configuration-bar">
      <h2>Right Sidebar</h2>
      <p>This is the right sidebar content.</p>
    </Sidebar>
  </div>
</template>

<script setup>
import Sidebar from 'core/src/vue/components/Sidebar.vue';
import MainContent from 'cocells-ai-image-generator/src/assets/components/MainContent.vue';
import { ref } from 'vue';

const state = ref({
  openNavigationBar: false,
  openConfigurationBar: false,
  backdrop: false,
});

const toggleNavigationBar = () => {
  state.value.openNavigationBar = !state.value.openNavigationBar;

  if (window.innerWidth <= 768 && (state.value.openNavigationBar || state.value.openConfigurationBar)) {
    state.value.backdrop = state.value.openNavigationBar || state.value.openConfigurationBar;
  } else {
    state.value.backdrop = false;
  }
};

const toggleRightSidebar = () => {
  state.value.openConfigurationBar = !state.value.openConfigurationBar;

  if (window.innerWidth <= 768 && (state.value.openNavigationBar || state.value.openConfigurationBar)) {
    state.value.backdrop = state.value.openNavigationBar || state.value.openConfigurationBar;
  } else {
    state.value.backdrop = false;
  }
};

const closeSidebars = () => {
  state.value.openNavigationBar = false;
  state.value.openConfigurationBar = false;
  state.value.backdrop = false;
};

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    if (state.value.openNavigationBar) state.value.openNavigationBar = true;
    if (state.value.openConfigurationBar) state.value.openConfigurationBar = true;
  } else {
    state.value.openNavigationBar = false;
    state.value.openConfigurationBar = false;
  }
  state.value.backdrop = false;
});
</script>