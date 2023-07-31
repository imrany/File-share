<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="flex min-h-[100vh]">
    <div class="md:w-[15%] px-4 py-4  bg-black text-white" id="sideshow">
      <slot name="grid-1" ></slot>
    </div>
    <div class="md:w-[85%] bg-gray-100" id="panel">
      <slot name="grid-2"></slot>
       <RouterView />
    </div>
  </div>
</template>