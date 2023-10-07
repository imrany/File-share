<script setup lang="ts">
import { inject } from "vue"
import indexedDB from "../../../indexedDB"
import { loader } from "@/index";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";

const props=defineProps<{
    filename:any
    fetchItems:any
}>()

const toast=useToast()
const origin:any=inject('origin')
const userdata:any=inject('userdata')
const access_token:any=inject('access_token')
const route=useRoute()
const dialog_close=()=>{
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    dialogElement.close()
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
        // window.location.href="/home"
        props.fetchItems()
    } catch (error) {
        console.log(error)
        dialog_close()
    }
}

async function handleDelete(){
    try {
        dialog_close()
        loader.on()
        let url=!route.fullPath.includes('/group')?`${origin}/api/uploads/${props.filename}`:`${origin}/api/sharedfile/${props.filename}`
        const response=await fetch(url,{
            method:"DELETE",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":'application/json'
            },
            body:JSON.stringify({
              access_token
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
            loader.off()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            window.location.reload()
           // props.fetchItems()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        loader.off()
    }
}

</script>

<template>
    <dialog id="delete-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center placeholder:">You are about to delete <span class="text-gray-500">{{props.filename}}</span></p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button v-if="route.fullPath.includes('/home')" @click="clear" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Delete
                </button>
                <button v-else @click="handleDelete" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Delete
                </button>
                 <button @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
