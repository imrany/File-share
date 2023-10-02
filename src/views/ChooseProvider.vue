<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';

const router=useRouter()
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()

const handleSubmit=async()=>{
    try {
        const url=`${origin}/api/auth/register`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:sessionStorage.getItem('sign_up_data')
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
            sessionStorage.clear()
        }
    } catch (error:any) {
        toast.error(error.message,{
            duration:3000,
            position:"top-right"
        })
    }
}

onMounted(()=>{
    // if(sessionStorage.getItem('sign_up_data')){
    //     handleSubmit()
    // }else{
    //     router.back()
    // }
})
function signin(){
    sessionStorage.clear()
    router.push("/signin")
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <!-- <p class="text-red-500 text-center mb-4 text-sm max-sm:text-xs">{{error}}</p> -->
        <div class="flex flex-col justify-center items-center md:w-[450px] max-md:w-[80vw]">
            <p class="text-2xl font-semibold mb-1 max-md:text-xl">Choose your cloud platform</p>
            <div class="my-1 flex flex-col items-center w-full">
                <div class="flex flex-col w-full my-4 max-sm:my-2">
                    <p class="text-sm text-gray-700 mb-1"><i class="icon pi pi-google mr-1"></i>Proceed with google drive</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-white bg-blue-500 flex shadow-sm shadow-slate-400 justify-center items-center w-full h-[40px] rounded-md">Google drive</a>
                    </div>
                    <!-- <p class="text-sm text-gray-700 mb-1 mt-5"><i class="icon pi pi-box mr-1"></i>Proceed with dropbox</p>
                    <div class="flex flex-col items-center">
                        <a :href="`${origin}/drive/auth/google`" class="font-semibold text-gray-700 bg-white border-[1px] border-slate-400 flex justify-center items-center w-full h-[40px] rounded-md">Dropbox</a>
                    </div> -->
                </div>
                <p class="text-sm text-gray-700 my-4 text-center"> 
                    Creating an account means you allow wekafile to manage file on your behalf
                    and agree with our <a href="#" class="underline">Terms of Service</a> and 
                    <a href="#" class="underline">Privacy Policy</a>.
                </p>
                <p class="text-sm mb-2">
                    Already have an account? <span @click="signin" class="ml-2 text-[#e9972c] font-semibold cursor-pointer">Sign in</span>
                </p>
            </div>
        </div>
    </div>
</template>
