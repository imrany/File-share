<script lang="ts" setup>
import { ref } from "vue";
defineProps<{
    error:string
}>()

const dialog_close=()=>{
    const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleUpload(e:any){
    e.preventDefault()
    try {
        const file=e.target.name.files
        console.log(file)
    } catch (error:any) {
        error.value=error.message
    }
}
</script>

<template>
   <dialog id="upload-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-red-500 text-center text-base mb-2">{{error}}</p>
            <p class="text-black">Upload file</p>

            <form class="flex flex-col items-center my-4" @submit="handleUpload">
                <input type="file" id="file" name="name" class="mt-2 border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[100%] py-2 px-4 placeholder:text-sm text-sm" required multiple/>
                <button class="mt-4 bg-black text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="icon pi pi-upload mr-3"></i>
                   <span>Upload</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
