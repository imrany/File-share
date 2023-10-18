<script lang="ts" setup>
import { inject,onMounted,ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter,useRoute } from "vue-router";
import DeleteAccountDialog from "../components/ui/Dialog/DeleteAccount.vue"
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "../components/ui/DesktopNav.vue";
import CreateGroup from "../components/ui/Dialog/CreateGroup.vue"
import UpdateGroup from "../components/ui/Dialog/UpdateGroup.vue"

import { loader } from "..";
import { useToast } from "vue-toast-notification" 

const origin:any=inject("origin")
const router=useRouter()
const data:any=ref({})
const toast=useToast()
const route=useRoute()
const userdata:any=inject("userdata")
const title="Account"
const name=`account`

onMounted(()=>{
    fetchUserDetails()
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
            localStorage.clear()
            router.back()
        } else {
            const userdt:any=JSON.stringify(parseRes.data)
            localStorage.setItem('userdata',userdt)
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
    localStorage.clear()
    router.push("/signin")
}
const delete_dialog=()=>{
    router.push(`/account?email=${route.query.email}&type=${name}`)
    const dialogElement=document.getElementById("delete-account") as HTMLDialogElement
    dialogElement.showModal()
};
const create_group=()=>{
    const dialogElement=document.getElementById("create-group-dialog") as HTMLDialogElement
    dialogElement.showModal()
};
const update_group=()=>{
    router.push(`/account?email=${route.query.email}`)
    const dialogElement=document.getElementById("group-profile-dialog") as HTMLDialogElement
    dialogElement.showModal()
};
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7" v-if="data">
                    <div @click="create_group" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200" v-if="data.group_ownership===null&&data.access_token!==null">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi text-gray-800 pi-plus text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Create a group</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Get started with groups</span>
                            </p>
                        </div>
                    </div>

                    <div @click="update_group" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200"  v-if="data.group_ownership!==null">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi text-gray-800 pi-cog text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">{{data.group_ownership}} settings</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Update your group settings</span>
                            </p>
                        </div>
                    </div>

                    <div @click="router.push('/provider')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" v-if="!userdata.access_token||userdata.access_token===null">
                            <i class="icon pi text-gray-800 pi-cloud-upload text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Cloud storage</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Choose a cloud storage provider and backup your files.</span>
                            </p>
                        </div>
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" v-else>
                            <i class="icon pi text-gray-800 pi-clock text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Refresh token</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Refresh your access token when you face any problem.</span>
                            </p>
                        </div>
                    </div>

                    <div @click="logout" class="md:px-8 px-4 cursor-pointer hover:bg-yellow-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon text-gray-800 pi pi-exclamation-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Logout</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Sign out of your {{name}}</span>
                            </p>
                        </div>
                    </div>

                    <div @click="delete_dialog" class="md:px-8 px-4 cursor-pointer hover:bg-red-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon text-gray-800 pi pi-exclamation-triangle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Delete {{name}}</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">By deleting your {{name}}, you will lost all your data</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteAccountDialog :data="data" :fetchDetails="fetchUserDetails"/>
            <CreateGroup :fetchDetails="fetchUserDetails"/>
            <UpdateGroup :fetchDetails="fetchUserDetails" :data="data"/>
        </template>
    </LayoutGrid>
</template>
