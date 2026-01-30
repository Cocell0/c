<template>
  <span class="tooltip">
    <slot></slot>
    <span class="tooltip-text" aria-hidden="true">
      <slot name="text"></slot>
    </span>
  </span>
</template>
