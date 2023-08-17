<script lang="ts" setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import VerifyDialog from "../components/ui/Dialog/verifyEmail.vue" 

const toast=useToast()
const username=ref("")
const password=ref("")
const isLoading=ref(false)
const wait=ref("")
const open_verify_dialog=()=>{
    const dialogElement=document.getElementById("verify-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
const handleSubmit=async(e:any)=>{
    e.preventDefault()
    try {
        if(username.value.slice(0,1)!=="@"||password.value.length<7){
            toast.info("Kindly, fill in the fields as required.",{
                duration:3000,
                position:"top-right"
            }) 
        }else if(username.value.slice(0,1)==="@"&&password.value.length>7){
            isLoading.value=true
            wait.value="cursor-progress bg-gray-400"
        }
    } catch (error:any) {
        isLoading.value=false
        console.log(error.message)
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
    }
}

const checkInput=()=>{
    if(username.value.slice(0,1)!=="@"||password.value.length<7){
        isLoading.value=true
        wait.value="cursor-not-allowed"
    }else if(username.value.slice(0,1)==="@"||password.value.length>7){
        isLoading.value=false
        wait.value="cursor-pointer"
    }
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <RouterLink to="/" class="flex items-center pl-10 w-full -mt-14 mb-14" id="desktop">
            <img src="/favicon.png" class="w-[41px] h-[45px]" alt="."/>
            <p class="text-[#e9972c] ml-2 text-xl">Fileshare</p>
        </RouterLink>
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4">Sign in to <span class="text-[#e9972c]">Fileshare</span></p>
            <form class="my-3 flex flex-col w-full" @submit="handleSubmit" @keydown="checkInput" >
                <label for="username" class="ml-1 flex justify-between"><span>Enter your username</span><span class="text-red-600 text-sm" v-if="username.length>0&&username.slice(0,1)!=='@'">'@' notfound</span></label>
                <input type="text" v-model="username" id="username" name="username" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="@username" required/>
                <label for="password" class="ml-1 mt-4 flex justify-between"><span>Enter password</span> <span class="text-red-600 text-sm" v-if="password.length<8&&password.length>0">Requires a minimum of 8 letters</span></label>
                <input type="password" v-model="password" id="password" name="password" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <button :disabled="isLoading" :class="wait" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-[#e9972c] text-white">
                    Sign in
                </button>
            </form>
            <div @click="open_verify_dialog" class="text-[#e9972c] font-semibold mt-10 cursor-pointer">Create an account instead?</div>
            <VerifyDialog/>
        </div>
    </div>
</template>
