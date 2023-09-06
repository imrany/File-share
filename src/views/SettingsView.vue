<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import profile from "@/assets/images/profile.png"
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { allow_notifications, install_function, update_function, share_app, loader } from "../index";
import MobileNav from "../components/ui/MobileNav.vue";

const router=useRouter()
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const data:any=ref({})
const userdata:any=inject("userdata")
const title="Settings"

onMounted(()=>{
    fetchUserDetails()
    install_function()
    update_function()
})

async function fetchUserDetails() {
    try {
        loader.on()
        const url=!userdata.username?`${origin}/api/groups/${route.query.email}`:`${origin}/api/accounts/${route.query.email}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${userdata.token}`
            }
        })
        const parseRes=await response.json()
        if (parseRes.error) {
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            localStorage.clear()
            router.back()
        } else {
            data.value=parseRes.data
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        router.back()
    }
    loader.off()
}

const name=!userdata.username?`group`:`account`
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="mt-24 xl:mt-4  pb-7">
                    <div class="flex items-center max-sm:border-b-[1px] lg:mb-5 border-slate-200 pb-4 md:px-8 px-4">
                        <a :href="profile" v-if="data.photo===null" target="_blank" rel="noopener noreferrer">
                            <img title="My profile" :src="profile" alt="." class="w-[65px] h-[65px] rounded-[50px]">
                        </a>
                        <a :href="data.photo" target="_blank" rel="noopener noreferrer" v-else>
                            <img title="My profile" :src="data.photo" alt="." class="w-[65px] h-[65px] rounded-[50px]">
                        </a>
                        
                        <div class="flex flex-col ml-4">
                            <p v-if="data.username">{{data.username}}</p>
                            <p v-else-if="data.groupname">{{data.groupname}}</p>
                            <p class="text-slate-600 text-sm max-sm:text-xs">{{data.email}}</p>
                            <p class="text-green-600 text-xs" v-if="data.privacy===false">
                                Public
                            </p>
                            <p class="text-blue-600 text-xs" v-if="data.privacy===true">
                                Private
                            </p>
                        </div>
                        <i class="icon pi pi-pencil md:ml-14 cursor-pointer max-md:ml-auto"></i>
                    </div>
                   
                   <div id="update"  style="display:none;" class="md:px-8 px-4 cursor-pointer mt-7 hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-spinner text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Update app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Currently using version 2.0</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/account')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-key text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Account</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Upgrade account, Log out, Delete</span>
                            </p>
                        </div>
                    </div>

                    <div id="install" style="display:none;" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-download text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Install app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Install Fileshare</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/help')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-question-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Help</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Help center, Docs, contact us, privacy policy</span>
                            </p>
                        </div>
                    </div>

                    <div @click="allow_notifications" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-bell text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Notifications</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Enable notifications and always get updated</span>
                            </p>
                        </div>
                    </div>


                    <div @click="router.push(`/privacy?email=${userdata.email}`)" v-if="userdata.groupname" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-lock text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Privacy</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Visibilty status, add members</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/groups')" v-if="userdata.groupname" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-users text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Groups</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Discover other groups</span>
                            </p>
                        </div>
                    </div>

                    <div @click="share_app" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-share-alt text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Invite a friend</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Invite family and friends to Fileshare</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
