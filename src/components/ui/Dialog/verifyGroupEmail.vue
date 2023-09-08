<script lang="ts" setup>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const toast=useToast()
const isLoading=ref(false)
const origin:any=inject("origin")
const wait=ref("bg-green-400")
const router=useRouter()
const error =ref("")
const dialog_close=()=>{
    error.value=''
    const dialogElement=document.getElementById("verify-group-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleVerify(e:any){
    e.preventDefault()
    try {
        isLoading.value=true
        wait.value="cursor-progress bg-gray-400"
        let url=`${origin}/api/verify/group`
        const response=await fetch(url,{
            method:"POST",
            body:JSON.stringify({
                email:e.target.email.value
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
            wait.value="cursor-pointer bg-green-400"
            error.value=parseRes.error
        }else if(parseRes.code){
            sessionStorage.setItem("group_code",parseRes.code)
            router.push(`/verify?email=${e.target.email.value}`)
            dialog_close()
        }
        e.target.reset()
    } catch (error:any) {
        isLoading.value=false
        wait.value="cursor-pointer bg-green-400"
        error.value=error.message
        e.target.reset()
    }
}
</script>

<template>
   <dialog id="verify-group-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[90vw] h-fit text-[#0e0e0e] scale-[0.9] max-sm:scale-[0.8] p-10 max-sm:py-10 max-sm:px-7">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <p class="text-center text-2xl font-semibold">Get verified</p>
        <div class="flex flex-col w-full">
            <form class="flex flex-col items-center my-4 max-sm:my-2" @submit="handleVerify">
                <p class="text-red-500 text-center mb-1 text-sm max-sm:text-xs">{{error}}</p>
                <input type="email" name="email" class="mt-2 border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="Enter your company email" required/>
                <button :disabled="isLoading" class="mt-4 text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]" :class="wait">
                   <span>Submit</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
