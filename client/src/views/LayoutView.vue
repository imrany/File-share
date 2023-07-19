<script setup lang="ts">
import { RouterLink } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
</script>

<template>
  <main>
    <LayoutGrid>
      <template #grid-1>
        <RouterLink to="/" class="font-semibold text-xl px-8">cryptiony</RouterLink>
        <div class="flex flex-col text-[#808080] w-full mt-5">
          <div class="flex flex-col">
            <RouterLink to="/dashboard" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-chart-pie mr-3"></i>
              <span>Dashboard</span>
            </RouterLink>

            <RouterLink to="/transactions" class="px-6 py-2 my-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-chart-line mr-3"></i>
              <span>Transactions</span>
            </RouterLink>

            <RouterLink to="/taxes" class="px-6 py-2 my-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-briefcase mr-3"></i>
              <span>Taxes</span>
            </RouterLink>

            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-user mr-3"></i>
              <span>Profile</span>
            </RouterLink>
          </div>

          <div class="flex flex-col mt-[144px] border-t-[1px] border-gray-300 pt-4">
            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-globe mr-2"></i>
              <span>Language</span>
            </RouterLink>

             <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-clone mr-2"></i>
              <span>Docs</span>
            </RouterLink>

            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-sign-out mr-2"></i>
              <span>Log out</span>
            </RouterLink>            
          </div>
        </div>
      </template>

      <template #grid-2></template>
    </LayoutGrid>
  </main>
</template>
