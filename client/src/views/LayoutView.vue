<script setup lang="ts">
import { RouterLink } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"

const date=new Date();
const year=date.getFullYear()
</script>

<template>
  <main>
    <LayoutGrid>
      <template #grid-1>
        <RouterLink to="/" class="font-semibold text-xl px-8">Fileshare</RouterLink>
        <div class="flex flex-col text-[#808080] w-full mt-5">
          <div class="flex flex-col">
            <RouterLink to="/dashboard" class="px-6 my-2 py-2 rounded-[8px] hover:bg-blue-200 hover:text-blue-600">
              <i class="icon pi pi-folder mr-3"></i>
              <span>All Files</span>
              <sup class="ml-1">25</sup>
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

          <div class="flex flex-col mt-[144px] text-sm">
            <RouterLink to="/" class="px-6">
             Privacy policy
            </RouterLink>

             <RouterLink to="/" class="px-6 my-2">
              Terms of use
            </RouterLink>

            <div class="border-t-[1px] border-gray-300 pt-4 mt-6 text-xs">
              <strong>Copyright &copy; {{year}} All rights reserved.</strong>           
            </div>
          </div>
        </div>
      </template>

      <template #grid-2></template>
    </LayoutGrid>
  </main>
</template>
