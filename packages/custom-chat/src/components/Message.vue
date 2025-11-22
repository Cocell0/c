<template>
  <div class="message-bubble">
    <div class="avatar"></div>
    <div class="message-container">
      <span role="paragraph" class="name">{{ comment.user.nickname || comment.user.name || comment.user.visualId() }}</span>
      <p class="message">{{ comment.message }}</p>
    </div>
  </div>
</template>
<script setup>
import { defineProps } from 'vue';

defineProps({
  comment: {
    type: Object,
    required: false,
  },
})
</script>
<style lang="scss" scoped>
.message-bubble {
  display: flex;

  .avatar {
    height: 64px;
    width: 64px;
    background-color: black;
    border-radius: var(--spacing--full);
    margin-right: var(--spacing--C);
  }

  p {
    margin: 0;
  }

  .message-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .name {
      user-select: text;
    }
  }
}
</style>