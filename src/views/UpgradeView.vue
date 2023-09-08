<script lang="ts" setup>
import { onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";

const router=useRouter()
const title="Upgrade"
let packages=[
    {
        capacity:'250mb per month',
        call:'Get 250 Mb of cloud storage',
        price:250
    },
    {
        capacity:'500mb per month',
        call:'Get 500 Mb of cloud storage',
        price:500
    },
    {
        capacity:'750mb per month',
        call:'Get 750 mb of cloud storage',
        price:750
    },
    {
        capacity:'1Gb per month',
        call:'Get 1 Gb of cloud storage',
        price:1024
    },
    {
        capacity:'1.25Gb per month',
        call:'Get 1.25 Gb of cloud storage',
        price:1273
    },
]
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <DesktopNav :title="title"/>
            <div class="flex flex-col sm:px-8 max-sm:items-center pb-8 md:pt-4">
                <MobileNav :title="title"/>
                <div class="max-xl:mt-24">
                    <div class="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-2 md:gap-y-4">
                        <div class="shadow-sm shadow-slate-400 rounded-lg px-4 max-sm:w-[90vw]  flex flex-col" v-for="(item,index) in packages" :key="index">
                            <div class="flex mt-4 text-2xl max-md:text-base items-center">
                                <i class="icon pi pi-cloud mr-2"></i>
                                <p class="text-xl">{{ item.capacity }}</p>
                            </div>
                            <p class="mt-2 max-md:mt-4 text-sm">{{item.call}}</p>
                            <button class="mt-4 mb-2 text-white bg-green-400 rounded-[10px] h-[40px] w-[120px] flex items-center justify-center">
                                <span class="text-center text-sm">View plan</span>
                            </button>
                        </div>    
                    </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
