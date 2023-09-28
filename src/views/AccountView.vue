<script lang="ts" setup>
import { inject,onMounted,ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter,useRoute } from "vue-router";
import DeleteAccountDialog from "../components/ui/Dialog/DeleteAccount.vue"
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "../components/ui/DesktopNav.vue";
import CreateGroup from "../components/ui/Dialog/CreateGroup.vue"
import { loader } from "..";
import { useToast } from "vue-toast-notification" 

const origin:any=inject("origin")
const router=useRouter()
const data:any=ref({})
const toast=useToast()
const route=useRoute()
const userdata:any=inject("userdata")
const title="Account"
onMounted(()=>{
    fetchUserDetails()
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

const logout=()=>{
    localStorage.removeItem('userdata')
    router.push("/signin")
}
const delete_dialog=()=>{
    const dialogElement=document.getElementById("delete-account") as HTMLDialogElement
    dialogElement.showModal()
};
const create_group=()=>{
    const dialogElement=document.getElementById("create-group-dialog") as HTMLDialogElement
    dialogElement.showModal()
};
const name=!userdata.username?`group`:`account`

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7" v-if="data">
                    <div @click="router.push('/upgrade')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon text-gray-800 pi pi-cloud text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800 text-lg">Get cloud storage</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Get started with cloud storage to unlock more features</span>
                            </p>
                        </div>
                    </div>

                    <div @click="create_group" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200" v-if="data.group_ownership===null">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi text-gray-800 pi-plus text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Create a group</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Get started with groups</span>
                            </p>
                        </div>
                    </div>

                    <div class="md:px-8 px-4 cursor-pointer hover:bg-slate-200"  v-if="data.group_ownership!==null">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi text-gray-800 pi-cog text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm text-gray-800">Group settings</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Update <span class="text-green-500">{{data.group_ownership}}</span> settings</span>
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
        </template>
    </LayoutGrid>
    <DeleteAccountDialog/>
    <CreateGroup :fetchDetails="fetchUserDetails"/>
</template>
