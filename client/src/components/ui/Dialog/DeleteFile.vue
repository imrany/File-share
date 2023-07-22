<script setup lang="ts">
import indexedDB from "../../../indexedDB"
const props=defineProps<{
    filename:string
}>()

const dialog_close=()=>{
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    dialogElement.close()
    window.location.href="/"
};

async function clear(){
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const deleteItem=fileStore.index("filename")
        const deleteFile=deleteItem.getKey([props.filename])

        deleteFile.onsuccess =()=>{
            const del = fileStore.delete(deleteFile.result);
            del.onsuccess =()=>{
                console.log("File deleted")
            };
            del.onerror=()=>{
                console.log("error",del.result)
            }
        };
        deleteFile.onerror=()=>{
            console.log("error",deleteFile.result)
        }
        dialog_close()
    } catch (error) {
        console.log(error)
        dialog_close()
    }
}

</script>

<template>
    <dialog id="delete-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center placeholder:">You are about to delete <span class="text-gray-500">{{props.filename}}</span></p>
            <div class="flex justify-between">
                <button @click="clear" class="text-white bg-blue-600 rounded-[10px] h-[40px] w-[120px]">
                    Delete
                </button>
                 <button @click="dialog_close" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
