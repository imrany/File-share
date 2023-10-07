<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { inject, ref } from "vue";
import { useToast } from "vue-toast-notification";

const toast=useToast()
const isLoading=ref(false)
const origin:any=inject("origin")
const wait=ref("bg-[#e9972c]")
const router=useRouter()
const error =ref("")

async function handleVerify(e:any){
    e.preventDefault()
    try {
        isLoading.value=true
        wait.value="cursor-progress bg-gray-400"
        let url=`${origin}/api/verify`
        const response=await fetch(url,{
            method:"POST",
            body:JSON.stringify({
                data:{
                    email:e.target.email.value
                }
            }),
            headers:{
                "content-type":"application/json"
            }
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
            isLoading.value=false
            wait.value="cursor-pointer bg-[#e9972c]"
            error.value=parseRes.error
        }else if(parseRes.code){
            sessionStorage.setItem("OTP",parseRes.code)
            router.push(`/verify?email=${e.target.email.value}`)
        }
        e.target.reset()
    } catch (error:any) {
        isLoading.value=false
        wait.value="cursor-pointer bg-[#e9972c]"
        error.value=error.message
        e.target.reset()
    }
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <!-- <p class="text-red-500 text-center mb-4 text-sm max-sm:text-xs">{{error}}</p> -->
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw] mb-20">
            <p class="text-2xl font-semibold mb-1 text-gray-700">Get verified</p>
            <div class="my-1 flex flex-col items-center w-full">
                <div class="flex flex-col w-full my-4 max-sm:my-2">
                    <p class="text-sm text-gray-700"><i class="icon pi pi-shield mr-1"></i>Get started by verifying your email</p>
                    <form class="flex flex-col items-center" @submit="handleVerify">
                        <input type="email" name="email" class="mt-2 border-gray-500 placeholder:text-gray-700 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="Enter your email" required/>
                        <div class="flex justify-between w-full font-semibold max-md:text-sm max-md:gap-4">
                            <button type="button" @click="router.back()" to="/" class="flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:h-[35px] max-sm:w-[120px] w-[150px] border-[1px] border-gray-300 text-black">
                                Back
                            </button>
                            <button :class="wait" :disabled="isLoading" class="w-[150px] flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:h-[35px] max-sm:w-[120px] text-white">
                                Proceed
                            </button>
                        </div>
                    </form>
                    <div @click="router.push('/signin')" class="text-[#e9972c] font-semibold mt-4 text-center text-sm max-sm:text-xs cursor-pointer" title="Sign in">I have an account?</div>
                </div>
            </div>
        </div>
    </div>
</template>
