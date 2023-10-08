<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import profile from "@/assets/images/profile.png"
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { allow_notifications, install_function, update_function, share_app, loader } from "../index";
import MobileNav from "../components/ui/MobileNav.vue";
import ProfileDialog from "@/components/ui/Dialog/Profile.vue";

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
        const url=`${origin}/api/accounts/${route.query.email}`
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
            localStorage.removeItem("userdata")
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


const open_profile=()=>{
    const dialogElement=document.getElementById("profile-dialog") as HTMLDialogElement
    dialogElement.showModal()
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
                        <div class="flex cursor-pointer items-center flex-grow">
                            <div @click="open_profile" v-if="data.photo===null" class=" w-[65px] h-[65px] rounded-[50px] bg-slate-300 flex justify-center items-center">
                                <i title="My profile" class="icon pi pi-user text-2xl text-gray-700 max-sm:text-lg"></i>
                            </div>
                            <RouterLink :to="`/files?file=${data.photo}&filename=profile.png`" v-else>
                                <img title="My profile" :src="`https://drive.google.com/uc?id=${data.photo}`" alt="." class="object-cover w-[65px] h-[65px] rounded-[50px]">
                            </RouterLink>
                            
                            <div class="flex flex-col ml-4 flex-grow" @click="open_profile">
                                <p>{{data.username}}</p>
                                <p class="text-slate-600 text-sm max-sm:text-xs">{{data.email}}</p>
                            </div>
                        </div>
                        <i class="icon pi pi-qrcode md:text-lg cursor-pointer ml-auto"></i>
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

                    <div @click="router.push(`/account?email=${userdata.email}`)" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-key text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Account</span>
                                <span class="text-sm max-sm:text-xs text-slate-600"><span v-if="data.group_ownership!==null">{{ data.group_ownership }} settings,</span> <span v-else>Create a group,</span> Log out, Delete</span>
                            </p>
                        </div>
                    </div>

                    <div id="install" style="display:none;" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-download text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Install app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Install Wekafile</span>
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


                    <div @click="router.push(`/privacy?email=${userdata.email}`)" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-lock text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Privacy</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Location</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/groups')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-users text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Groups</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Discover groups</span>
                            </p>
                        </div>
                    </div>

                    <div @click="share_app" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-share-alt text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Invite a friend</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Invite family and friends to Wekafile</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ProfileDialog :fetchDetails="fetchUserDetails" :data="data"/>
        </template>
    </LayoutGrid>
</template>
