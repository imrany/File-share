<script lang="ts" setup>
import { onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";

let peers:any=ref([])
const title="Notifications"

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <DesktopNav :title="title"/>
            <div class="flex flex-col px-8 pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="max-xl:mt-24">
                   There is nothing to see here.
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
