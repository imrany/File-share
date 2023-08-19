<script lang="ts" setup>
import { onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";

const router=useRouter()
let peers:any=ref([])
const title="Settings"

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col px-8 pb-8 pt-4">
                 <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
                    <div class="flex px-10 py-5 items-center">
                        <i @click="router.back()" class="icon pi pi-arrow-left text-xl mr-6"></i>
                         <p class="text-xl text-slate-800">{{title}}</p>
                    </div>
                </div>
                <div class="mt-24 lg:mt-4">
                   Settings
                </div>
            </div>
        </template>
    </LayoutGrid>
    <ConnectDialog/>
</template>
