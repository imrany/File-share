<script lang="ts" setup>
import { onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
import MobileNav from "../components/ui/MobileNav.vue";

const router=useRouter()
const title="Upgrade"

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col px-8 pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="mt-24 lg:mt-4">
                   Upgrade
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
