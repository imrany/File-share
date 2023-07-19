<script setup lang="ts">
import { RouterLink } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
</script>

<template>
  <main>
    <LayoutGrid>
      <template #grid-1>
        <RouterLink to="/" class="font-semibold text-2xl">Taxes</RouterLink>
        <div class="flex mt-4 pb-2 border-b border-gray-20">
          <RouterLink to="/" class="">2023/2022</RouterLink>
        </div>
      </template>

      <template #grid-2></template>
    </LayoutGrid>
  </main>
</template>
