<template>
  <main>
    <section>
      <h3>Chats</h3>
      <div class="chat-search">
        <input type="text" placeholder="Search chats" v-model="searchQuery" />
      </div>
      <ul class="chat-tabs">
      <li>
        <AnchorLink href="/c" class="button">All chats</AnchorLink>
      </li>
      <li v-for="chat in filteredChats" :key="chat.id">
        <AnchorLink :href="`/c/${chat.id}`" class="button">{{ chat.name }}</AnchorLink>
      </li>
    </ul>
    </section>
    <section v-if="id">
      <h3>{{ chat.name }}</h3>
      <!-- Chat content would go here -->
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useChatsStore } from '../store/useChatsStore';
import AnchorLink from 'core/src/vue/components/AnchorLink.vue';
import Fuse from 'fuse.js'

const route = useRoute();
const id = computed(() => route.params.id);

const chatsStore = useChatsStore();
console.log(chatsStore.globalChats);

const chats = computed(() => [...chatsStore.globalChats, ...chatsStore.savedChats])
const chat = computed(() => chats.value.find(chat => chat.id === id.value))

const searchQuery = ref('');

const filteredChats = computed(() => {
  if (!searchQuery.value) {
    return chats.value;
  }
  const fuse = new Fuse(chats.value, {
    keys: ['name'],
    threshold: 0.3,
  });
  return fuse.search(searchQuery.value).map(result => result.item);
});
</script>