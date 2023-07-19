<script setup lang="ts">
import { RouterView } from 'vue-router'

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="flex">
    <div class="bg-gray-100 md:w-[15%] px-4 py-4">
      <slot name="grid-1" ></slot>
    </div>
    <div class="md:w-[85%] px-8 py-4">
      <slot name="grid-2"></slot>
       <RouterView />
    </div>
  </div>
</template>