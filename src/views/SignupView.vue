<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const router=useRouter()
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const username=ref("")
const password=ref("")
const confirm=ref("")
const isLoading=ref(false)
const wait=ref("")
let date=new Date()
let newObj = Intl.DateTimeFormat('en-US', {
    timeZone: "America/New_York"
})
let newDate = newObj.format(date);
let min=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`
let time=date.getHours()>12?`${date.getHours()}:${min}PM`:`${date.getHours()}:${min}AM`
const lastLogin=`${newDate} ${time}`;
const platform=navigator.platform

const handleSubmit=async(e:any)=>{
    e.preventDefault()
    try {
        if(username.value.length<5||password.value.length<8||confirm.value!==password.value){
            toast.info("Kindly, fill in the fields as required.",{
                duration:3000,
                position:"top-right"
            }) 
        }else if(username.value.length>5&&password.value.length>8||password.value.length===8){
            isLoading.value=true
            wait.value="cursor-progress bg-gray-400"
            const url=`${origin}/api/auth/register`
            const response=await fetch(url,{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    email:route.query.email,
                    username:username.value,
                    password:confirm.value,
                    lastLogin,
                    userPlatform:platform
                })
            })
           const parseRes=await response.json()
           if(parseRes.error){
                toast.error(parseRes.error,{
                    duration:3000,
                    position:"top-right"
                })
            }else{
                toast.success(parseRes.msg,{
                    position:"top-right",
                    duration:5000
                })
                const user_data=JSON.stringify(parseRes.data)
                localStorage.setItem("userdata",user_data)
                sessionStorage.removeItem("OTP")
                window.location.reload()    
           }
        }
        isLoading.value=false
        wait.value="cursor-pointer bg-[#e9972c]"
    } catch (error:any) {
        isLoading.value=false
        wait.value="cursor-pointer bg-[#e9972c]"
        console.log(error.message)
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
    }
}

onMounted(()=>{
    if(!sessionStorage.getItem("OTP")){
        router.back()
    }
})
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw] mb-20">
            <p class="text-2xl lg:text-4xl font-semibold mb-4">Get Started with <span class="text-[#e9972c]">Wekafile</span></p>
            <form class="my-3 flex flex-col w-full" @submit="handleSubmit">
                <label for="username" class="ml-1 flex justify-between max-md:text-sm"><span>Enter your preferred username</span><span class="text-red-600 text-sm" v-if="username.length>0&&username.length<5">Too short</span><span class="text-green-600 text-sm" v-else-if="username.length>4">Good</span></label>
                <input type="text" v-model="username" id="username" name="username" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Username" required/>
                <label for="password" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Enter password</span> <span class="text-red-600 text-sm" v-if="password.length<8&&password.length>0">Requires a minimum of 8 letters</span><span class="text-green-600 text-sm" v-else-if="password.length>7&&password.length<11">Good</span><span class="text-green-600 text-sm" v-else-if="password.length>10">Strong</span></label>
                <input type="password" v-model="password" id="password" name="password" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <label for="confirm" class="ml-1 mt-4 flex justify-between max-md:text-sm"><span>Confirm password</span> <span class="text-red-600 text-sm" v-if="confirm!==password&&confirm.length>0">Doesn't match</span><span class="text-green-600 text-sm" v-else-if="confirm===password&&confirm.length>0">Perfect match</span></label>
                <input type="password" v-model="confirm" id="confirm" name="confirm" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Password" required/>
                <div class="flex justify-between gap-2 max-sm:text-sm">
                    <button type="button" @click="router.back()" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] w-[150px] border-[1px] border-gray-400 text-black">
                        Back
                    </button>
                    <button :class="wait" :disabled="isLoading" class="w-[150px] font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] bg-[#e9972c] text-white">
                        Register Account
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
