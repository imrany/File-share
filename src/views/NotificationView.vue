<script lang="ts" setup>
import LayoutGrid from "../components/LayoutGrid.vue";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";
import Image from "@/assets/icons/image-icon.png"

type updateType={
    photo:string,
    username:string,
    email:string,
    filename:string,
    groupname:string,
    uploadedAt:string
}
const title="Notifications"
const update:string|any=localStorage.getItem('update')
const update_object:updateType=JSON.parse(update)
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7" v-if="update_object">
                    <div class="md:px-8 sm:px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <a target="_blank" :href="`https://drive.google.com/uc?id=${update_object.photo}`" class="mr-3">
                                <img v-lazy="{ src: `https://drive.google.com/uc?id=${update_object.photo}`, loading: Image, error: Image }" :title="update_object.groupname" alt="." class="object-cover w-[65px] h-[65px] max-md:h-[45px] max-md:w-[75px] rounded-[50px]">
                            </a>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">{{update_object.groupname}}</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">{{update_object.username}} has just upload {{update_object.filename}} on {{update_object.groupname}}</span>
                            </p>
                        </div>
                    </div>

                </div>
                <div class="flex flex-col h-[100vh] justify-center items-center" v-else>
                    <p class="text-xl max-md:text-lg max-sm:text-sm text-gray-500 font-semibold">No Notifications</p>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
