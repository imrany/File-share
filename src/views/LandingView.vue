<script lang="ts" setup>
import {useRouter} from "vue-router"
import VerifyDialog from "../components/ui/Dialog/verifyEmail.vue" 

const router=useRouter()
const open_verify_dialog=()=>{
    const dialogElement=document.getElementById("verify-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
</script>
<template>
    <div class="bg-[#0e0e0e] flex flex-col" id="landing_page">
        <div class="text-white pt-11 px-20 pb-16 w-full">
            <div class="flex justify-between items-center font-semibold">
                <div class="flex">
                    <img src="/favicon.png" class="w-[33px] h-[35px]" alt="."/>
                    <p class="text-2xl ml-2">Fileshare</p>
                </div>
                <RouterLink to="/signin" class="text-black w-[140px] h-[50px] flex justify-center items-center bg-[#eba953]">Sign in</RouterLink>
            </div>

            <div class="flex flex-col ml-20">
                <p class="font-bold text-7xl w-[500px] my-10" style="line-height:80px;">
                    Increasing the value of your storage.
                </p>
                <p class="w-[400px] mb-10">
                    We offer a faster way of sharing your files and document to your multiple receiptent.
                    Plus you will be able to store them, its secured and safe.
                </p> 

                <div class="flex justify-between items-center w-[30vw]">
                    <button class="text-black w-[150px] h-[50px] flex justify-center items-center bg-[#eba953] font-semibold" @click="open_verify_dialog">Get Started</button>
                    <button class="w-[155px] h-[50px] flex justify-center items-center border-[1px] border-[#eba953] font-semibold text-[#eba953]"><i class="mr-2 icon pi pi-download"></i> Install app</button>
                </div>
                 <div class="flex justify-between items-center mt-8 w-[35vw]">
                    <div class="flex flex-col">
                        <p class="font-bold text-4xl text-[#e9972c]">3.0M</p>
                        <p class="mt-5 text-sm w-[200px]">
                            Our peers are happy utilizing our services.
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="font-bold text-4xl text-[#eba953]">90 free</p>
                        <p class="mt-5 text-sm w-[200px]">The initial 90 days are provided to you without charges.</p>
                    </div>
                 </div>
            </div>
        </div>
        <VerifyDialog/>
    </div>
</template>
