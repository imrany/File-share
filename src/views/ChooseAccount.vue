<script lang="ts" setup>
import { useRouter } from 'vue-router';
import VerifyDialog from "../components/ui/Dialog/verifyEmail.vue" 
import VerifyGroupDialog from "../components/ui/Dialog/verifyGroupEmail.vue" 

const router=useRouter()
const open_verify_dialog=()=>{
    const dialogElement=document.getElementById("verify-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
const open_verify_group=()=>{
    const dialogElement=document.getElementById("verify-group-dialog") as HTMLDialogElement
    dialogElement.showModal()
};
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <RouterLink to="/" class="flex fixed top-10 items-center left-10 w-full mb-14" id="desktop">
            <img src="/favicon.png" class="w-[41px] h-[45px]" alt="."/>
            <p class="text-[#e9972c] ml-2 text-xl">Fileshare</p>
        </RouterLink>
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw] mb-20">
            <p class="text-2xl font-semibold mb-1 text-gray-600">Get started with your choice</p>
            <div class="my-1 flex flex-col items-center w-full">
                <button @click="open_verify_group" title="For my team" class="w-full font-semibold flex my-3 mt-6 justify-center items-center rounded-[10px] border-gray-300 hover:bg-green-400 hover:border-none hover:text-white h-[40px]  border-[1px] text-black">
                    <i class="icon pi pi-users text-xl max-md:text-sm mr-3"></i>
                    <span class="max-md:text-sm">Group account</span>
                </button>
                <button @click="open_verify_dialog" title="For my personal use" class="w-full font-semibold flex my-3 mt-3 justify-center items-center rounded-[10px] border-gray-300 hover:bg-[#e9972c] hover:border-none hover:text-white h-[40px]  border-[1px] text-black">
                    <i class="icon pi pi-user text-xl max-md:text-sm mr-3"></i>
                    <span class="max-md:text-sm">Personal account</span>
                </button>
                <div class="flex justify-between w-full max-md:text-sm max-md:gap-4">
                    <button type="button" @click="router.back()" to="/" class="hover:bg-gray-500 hover:border-none hover:text-white flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:h-[35px] max-sm:w-[120px] w-[150px] border-[1px] border-gray-300 text-black">
                        Back
                    </button>
                    <button @click="router.push('/signin')" class="w-[150px] flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:h-[35px] max-sm:w-[120px] bg-[#e9972c] text-white">
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    </div>
    <VerifyDialog/>
    <VerifyGroupDialog/>
</template>
