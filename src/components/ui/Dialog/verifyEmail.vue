<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const isLoading=ref(false)
const wait=ref("")
const router=useRouter()
const error =ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("verify-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleVerify(e:any){
    e.preventDefault()
    try {
        isLoading.value=true
        wait.value="cursor-progress bg-gray-400"
        router.push(`/verify?email=${e.target.email.value}`)
    } catch (error:any) {
        error.value=error.message
    }
}
</script>

<template>
   <dialog id="verify-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#0e0e0e] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <p class="text-center text-2xl font-semibold">Get verified</p>
        <div class="flex flex-col w-full">
            <p class="text-red-500 text-center text-xl">{{error}}</p>
            <form class="flex flex-col items-center my-4" @submit="handleVerify">
                <input type="email" name="email" class="mt-2 border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="Enter your work email" required/>
                <button :disabled="isLoading" class="mt-4 bg-[#e9972c] text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]" :class="wait">
                   <span>Submit</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
