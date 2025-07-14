<template>
  <DarkMode class="dark-mode-button"></DarkMode>
  <div class="app-inset-wrapper">
    <div class="container">
      <h1 class="title">
        <label for="password">Admin Password</label>
      </h1>
      <input type="text" v-model="password" id="password" name="perchance-comment-admin-password"
        placeholder="Enter the password" autocomplete="off" data-credentials-off />
      <p v-if="hashed" class="text-left">
        Hash:
        <code id="hashed-pass-word" class="select-all w-full block text-center">{{ hashed }}</code>
      </p>
      <button @click="create">Create</button>
    </div>
    <div class="container" v-if="passwords.length !== 0">
      <h2 class="title">Saved Passwords</h2>
      <ul>
        <li v-for="(entry, index) in passwords" :key="index" class="text-left saved-password">
          <h4><code class="select-all">{{ entry.password }}</code></h4>
          <span class="label">Hash:</span>
          <code class="select-all">{{ entry.hash }}</code>
        </li>
      </ul>
    </div>
    <div class="container">
      <h2 class="title">Feedback</h2>
      <div class="perchance-chat-container" style="width: 100%;" v-html="chat"></div>
    </div>
    <br>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DarkMode from 'core/src/vue/components/DarkMode.vue'

async function hash(password) {
  const text = 'perchance-comments-plugin|' + password
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const chat = computed(() => window.chat({
  channel: 'feedback',
  adminPasswordHash: 'c645c3fe3a1c516937d3bdd532f322cb41d9786a3e86754d5bf0e85c92675f05',
  adminFlair: 'Admin',
}))

const password = ref('')
const hashed = ref('')
const passwords = ref(JSON.parse(localStorage.getItem('passwords') || '[]'))

async function create() {
  if (!password.value) {
    hashed.value = ''
    return
  }
  hashed.value = await hash(password.value)
  passwords.value.push({ password: password.value, hash: hashed.value })
  localStorage.setItem('passwords', JSON.stringify(passwords.value))
  password.value = ''
}
</script>