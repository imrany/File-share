<script setup lang="ts">
import { useRouter } from "vue-router";
import indexedDB from "../../../indexedDB"
const dialog_close=()=>{
    const dialogElement=document.getElementById("clear-storage-dialog") as HTMLDialogElement
    dialogElement.close()
};

const router=useRouter()
async function clear(){
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const deleteFiles=fileStore.clear()

        deleteFiles.onsuccess=()=>{
            deleteFiles.result
            dialog_close()
            router.push("/home")
        }
        deleteFiles.onerror=()=>{
            console.log("error",deleteFiles.result)
        }
    } catch (error) {
        console.log(error)
    }
}

</script>

<template>
    <dialog id="clear-storage-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center placeholder:">You are about to delete all of your files and folder</p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button @click="clear" class="text-white bg-purple-800 rounded-[10px] h-[40px] w-[120px]">
                    Delete all
                </button>
                 <button @click="dialog_close" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
