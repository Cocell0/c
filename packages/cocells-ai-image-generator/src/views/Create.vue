<template>
  <div class="drawer" role="toolbar">
    <DarkMode />
    <button @click="toggleConfigurationBar" class="button--icon"
      :aria-label="uiStore.isConfigurationBarOpen ? 'Close configuration' : 'Open configuration'">
      <span
        :class="{ 'i-material-symbols-close-rounded': uiStore.isConfigurationBarOpen, 'i-material-symbols-settings-rounded': !uiStore.isConfigurationBarOpen }"></span>
    </button>
  </div>
  <MainContent @toggle-configuration-bar="toggleConfigurationBar" />
  <div class="panel">
    <Sidebar @close="uiStore.isConfigurationBarOpen = false" :open="uiStore.isConfigurationBarOpen"
      class="configuration-bar relative" position="right">
      <h3 class="my-2.5rem text-center">Configuration</h3>
      <AnchorLink href="/images" class="button">Images</AnchorLink>
      <label for="size">Size:</label>
      <select name="size" id="size">
        <option v-for="size in configurationStore.size" :key="size.name" :value="size.name">{{ size.name }}</option>
      </select>
    </Sidebar>
  </div>
</template>

<script setup>
import DarkMode from 'core/src/vue/components/DarkMode.vue';
import AnchorLink from 'core/src/vue/components/AnchorLink.vue';
import Sidebar from 'core/src/vue/components/Sidebar.vue';
import MainContent from '@/components/MainContent.vue';
import { useUiStore } from '@/store/useUiStore';
import { useConfigurationStore } from '@/store/useConfigurationStore';

const uiStore = useUiStore();
const configurationStore = useConfigurationStore();

function toggleConfigurationBar() {
  uiStore.isConfigurationBarOpen = !uiStore.isConfigurationBarOpen;
}
</script>