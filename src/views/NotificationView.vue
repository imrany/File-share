<script lang="ts" setup>
import { onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import MobileNav from "../components/ui/MobileNav.vue";

let peers:any=ref([])
const title="Notifications"

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col px-8 pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="mt-24 lg:mt-4">
                   Notifications
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
