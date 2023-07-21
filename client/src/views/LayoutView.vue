<script setup lang="ts">
import { RouterLink } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"

</script>

<template>
  <main>
    <LayoutGrid>
      <template #grid-1>
        <RouterLink to="/" class="font-semibold text-xl px-8">Fileshare</RouterLink>
        <div class="flex flex-col text-[#808080] w-full">
          <div class="flex flex-col">
            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-black hover:text-white">
              <i class="icon pi pi-folder mr-3"></i>
              <span>All Files</span>
              <sup class="ml-1">25</sup>
            </RouterLink>

            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-black hover:text-white">
              <i class="icon pi pi-users mr-3"></i>
              <span>Users</span>
            </RouterLink>
          </div>
        </div>
      </template>

      <template #grid-2></template>
    </LayoutGrid>
  </main>
</template>
