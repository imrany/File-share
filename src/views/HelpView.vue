<script lang="ts" setup>
import { inject, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "../components/ui/DesktopNav.vue";

const router=useRouter()
const userdata:any=inject("userdata")
const title="Help"


const name=!userdata.username?`group`:`account`

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7">
                    <div @click="router.push('/documentation')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-book text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Documentation</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Read our docs and find new ways and tips.</span>
                            </p>
                        </div>
                    </div>

                    <div class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-question-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Help center</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Find help through us</span>
                            </p>
                        </div>
                    </div>

                    <div class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-users text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Contact us</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Questions? Need help?</span>
                            </p>
                        </div>
                    </div>

                    <div class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-info-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">App information</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">App version, legal information</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
