<script lang="ts" setup>
import { inject } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
import DeleteAccountDialog from "../components/ui/Dialog/DeleteAccount.vue"
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "../components/ui/DesktopNav.vue";

const router=useRouter()
const userdata:any=inject("userdata")
const title="Account"

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
           <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7">
                    <div @click="router.push('/upgrade')" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-star text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Get more storage</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Get more storage to unlock more features</span>
                            </p>
                        </div>
                    </div>

                    <div @click="logout" class="md:px-8 px-4 cursor-pointer hover:bg-yellow-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-exclamation-circle text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Logout</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Sign out of your {{name}}</span>
                            </p>
                        </div>
                    </div>

                    <div @click="delete_dialog" class="md:px-8 px-4 cursor-pointer hover:bg-red-200">
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
</template>
