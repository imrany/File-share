<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import {loader} from "../"

const router=useRouter()
const origin:any=inject("origin")
const userdata:any=inject("userdata")
const access_token:any=inject("access_token")
const route=useRoute()
const toast=useToast()

const handleSubmit=async()=>{
    try {
    loader.on()
        const url=`${origin}/api/provider/user/${userdata.email}`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "content-type":"application/json",
                'authorization':`Bearer ${userdata.token}`
            },
            body:JSON.stringify({
                data:{
                    username:userdata.username
                },
                access_token:route.query.access_token
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                duration:3000,
                position:"top-right"
            })
            loader.off()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            let access_token:any=route.query.access_token
            localStorage.setItem("access_token",access_token)
            router.back()
        }
    } catch (error:any) {
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
        loader.off()
    }
}

onMounted(()=>{
    if(route.query.access_token&&!access_token){
        //create first time user upload folder
        handleSubmit()
    }else if(route.query.access_token&&access_token){
        //refreshes access token
        let access_token:any=route.query.access_token
        localStorage.setItem("access_token",access_token)
        router.back()
    }
})
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
    <div class="preload"></div>
        <!-- <p class="text-red-500 text-center mb-4 text-sm max-sm:text-xs">{{error}}</p> -->
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw]">
            <p class="text-2xl font-semibold mb-1 max-md:text-xl">Choose your cloud storage provider</p>
            <div class="my-1 flex flex-col items-center w-full" v-if="!access_token">
                <div class="flex flex-col w-full my-4 max-sm:my-2">
                    <p class="text-sm text-gray-700 mb-1"><i class="icon pi pi-google mr-1"></i>Proceed with google drive</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-white bg-blue-500 flex shadow-sm shadow-slate-400 justify-center items-center w-full h-[40px] rounded-md">Google drive</a>
                    </div>
                    <!-- <p class="text-sm text-gray-700 mb-1 mt-3"><i class="icon pi pi-box mr-1"></i>Proceed with dropbox</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-gray-700 bg-white border-[1px] border-slate-400 flex justify-center items-center w-full h-[40px] rounded-md">Dropbox</a>
                    </div> -->
                </div>
                <p class="text-sm text-gray-700 my-4 text-center"> 
                    By choosing a cloud storage, you allow Wekafile to manage files and folders on your behalf
                    in the your cloud storage provider you choose above. Read and agree to our <a href="#" class="underline">Terms of Service</a> and 
                    <a href="#" class="underline">Privacy Policy</a>.
                </p>
            </div>

            <div class="my-1 flex flex-col items-center w-full" v-else>
                <div class="flex flex-col w-full my-4 max-sm:my-2">
                    <p class="text-sm text-gray-700 mb-1"><i class="icon pi pi-google mr-1"></i>Refresh access token</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-white bg-blue-500 flex shadow-sm shadow-slate-400 justify-center items-center w-full h-[40px] rounded-md">Google drive</a>
                    </div>
                    <!-- <p class="text-sm text-gray-700 mb-1 mt-3"><i class="icon pi pi-box mr-1"></i>Proceed with dropbox</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-gray-700 bg-white border-[1px] border-slate-400 flex justify-center items-center w-full h-[40px] rounded-md">Dropbox</a>
                    </div> -->
                </div>
            </div>
        </div>
    </div>
</template>
