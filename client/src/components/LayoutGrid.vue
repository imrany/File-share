<script setup lang="ts">
import { RouterView } from 'vue-router'

defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="flex flex-col px-10 py-4">
    <div>
      <slot name="grid-1" ></slot>
    </div>
    <div class="md:w-[85%] px-8 py-4">
      <slot name="grid-2"></slot>
       <RouterView />
    </div>
  </div>
</template>