<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import indexedDB from "../../../indexedDB"
const userdata:any=inject("userdata")
const props=defineProps<{
    storage:string
}>()
const dialog_close=()=>{
    const dialogElement=document.getElementById("clear-storage") as HTMLDialogElement
    dialogElement.close()
};

const router=useRouter()
async function clear(){
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        
        const fileEmail=fileStore.index("email")
        const fileEmailKey = fileEmail.getAllKeys([`${userdata.email}`]);
        fileEmailKey.onsuccess=()=>{
            console.log(fileEmailKey.result)
            fileEmailKey.result.forEach((item:any)=>{
                const deleteFiles=fileStore.delete(item)
            })
            dialog_close()
            router.push("/home")
        }
        fileEmailKey.onerror=()=>{
            console.log("error",fileEmailKey.result)
        }
    } catch (error) {
        console.log(error)
    }
}

</script>

<template>
    <dialog id="clear-storage" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:py-8 max-sm:px-7">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full max-md:mt-2">
            <p class="text-black mb-2 text-center max-sm:text-xs">You are about clear your {{ props.storage }}</p>
            <p class="text-red-500 mb-5 text-center text-sm max-sm:text-xs">Once you clear, your local added files would be lost</p>

            <div class="flex gap-6 max-md:text-sm justify-between">
                <button   @click="clear" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Delete 
                </button>
                 <button  @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
