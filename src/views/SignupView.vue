<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const router=useRouter()
const route=useRoute()
const toast=useToast()
const username=ref("")
const password=ref("")
const confirm=ref("")
const isLoading=ref(false)
const wait=ref("")
const handleSubmit=async(e:any)=>{
    e.preventDefault()
    try {
        if(username.value.length<5||password.value.length<8||confirm.value!==password.value){
            toast.info("Kindly, fill in the fields as required.",{
                duration:3000,
                position:"top-right"
            }) 
        }else if(username.value.slice(0,1)==="@"&&password.value.length>8||password.value.length===8){
            const url=`http://localhost:8000/api/auth/register`
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:route.query.email,
                    username,
                    password:confirm
                })
            })
            isLoading.value=true
            wait.value="cursor-progress bg-gray-400"
            window.location.reload()
        }
    } catch (error:any) {
        console.log(error.message)
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
    }
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <RouterLink to="/" class="flex items-center pl-10 mt-10 w-full mb-14" id="desktop">
            <img src="/favicon.png" class="w-[41px] h-[45px]" alt="."/>
            <p class="text-[#e9972c] ml-2 text-xl">Fileshare</p>
        </RouterLink>
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw] mb-20">
            <p class="text-2xl lg:text-4xl font-semibold mb-4">Get Started with <span class="text-[#e9972c]">Fileshare</span></p>
            <form class="my-3 flex flex-col w-full" @submit="handleSubmit">
                <label for="username" class="ml-1 flex justify-between max-md:text-sm"><span>Enter your preferred username</span><span class="text-red-600 text-sm" v-if="username.length>0&&username.length<5">Too short</span><span class="text-green-600 text-sm" v-else-if="username.length>4">Good</span></label>
                <input type="text" v-model="username" id="username" name="username" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Username" required/>
                <label for="password" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Enter password</span> <span class="text-red-600 text-sm" v-if="password.length<8&&password.length>0">Requires a minimum of 8 letters</span><span class="text-green-600 text-sm" v-else-if="password.length>7&&password.length<11">Good</span><span class="text-green-600 text-sm" v-else-if="password.length>10">Strong</span></label>
                <input type="password" v-model="password" id="password" name="password" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <label for="confirm" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Confirm password</span> <span class="text-red-600 text-sm" v-if="confirm!==password&&confirm.length>0">Doesn't match</span><span class="text-green-600 text-sm" v-else-if="confirm===password&&confirm.length>0">Perfect match</span></label>
                <input type="password" v-model="confirm" id="confirm" name="confirm" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <button :class="wait" :disabled="isLoading" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-[#e9972c] text-white">
                    Create account
                </button>
            </form>
        </div>
    </div>
</template>
