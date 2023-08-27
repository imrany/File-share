<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import profile from "@/assets/images/profile.png"
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { allow_notifications, install_function, update_function, share_app, loader } from "../index";
import DeleteAccountDialog from "../components/ui/Dialog/DeleteAccount.vue"
import AddMember from "../components/ui/Dialog/AddMember.vue"
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

const add_member_dialog=()=>{
    const dialogElement=document.getElementById("add-member-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

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
const logout=()=>{
    localStorage.removeItem('userdata')
    router.push("/signin")
}
const delete_dialog=()=>{
    const dialogElement=document.getElementById("delete-account") as HTMLDialogElement
    dialogElement.showModal()
};

const name=!userdata.username?`group`:`account`

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="mt-24 lg:mt-4">
                   <div class="flex items-center max-sm:border-b-[1px] lg:mb-5 border-slate-200 pb-4 px-8">
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
                        </div>
                        <i class="icon pi pi-pencil md:ml-14 cursor-pointer max-md:ml-auto"></i>
                   </div>
                   
                   <div @click="router.push('/')" id="update" style="display:none;" class="px-8 cursor-pointer mt-7 hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-spinner text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Update app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Currently using version 2.0</span>
                            </p>
                        </div>
                    </div>

                    <div id="install" style="display:none;" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-download text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Install app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Install Fileshare</span>
                            </p>
                        </div>
                    </div>

                    <div @click="share_app" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-share-alt text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Share app</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Share Fileshare with family and friends</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/guide')" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-question-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Help</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">User manual, license, tips</span>
                            </p>
                        </div>
                    </div>

                    <div @click="allow_notifications" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-bell text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Notifications</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Enable notifications and always get updated</span>
                            </p>
                        </div>
                    </div>

                    <div @click="add_member_dialog" v-if="userdata.groupname" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-plus text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Add members</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Add members to your groups using their emails</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/groups')" v-if="userdata.groupname" class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-users text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Groups</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">find other register groups</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/upgrade')" v-if="userdata.username"  class="px-8 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-star text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Upgrade</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Upgrade your {{name}} to unlock more features</span>
                            </p>
                        </div>
                    </div>

                    <div @click="logout" class="px-8 cursor-pointer hover:bg-yellow-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-exclamation-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Logout</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Sign out of your {{name}}</span>
                            </p>
                        </div>
                    </div>

                    <div @click="delete_dialog" class="px-8 cursor-pointer mb-7 hover:bg-red-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-exclamation-triangle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Delete {{name}}</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">By deleting your {{name}}, you will lost all your data</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
    <DeleteAccountDialog/>
    <AddMember/>
</template>
