<script setup lang="ts">
import {inject} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader, share_url} from "../../../"

const props=defineProps<{
    fetchFiles:any
}>()
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("filemenu-dialog") as HTMLDialogElement
    dialogElement.close()
};

function open_file_access_dialog(){
    const dialogElement=document.getElementById("shared-file-dialog") as HTMLDialogElement
    dialogElement.showModal()
    dialog_close()
}
async function handleDelete(){
    try {
        loader.on()
        dialog_close()
        let url=`${origin}/api/delete/sharedfile/${route.query.filename}`
        const response=await fetch(url,{
            method:"DELETE",
            headers:{
                "authorization":`Bearer ${userdata.token}`
            }
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
            props.fetchFiles()
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
    <dialog id="filemenu-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto] px-10" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <div @click="share_url(`${route.query.filename}`,`${origin}/uploads/${userdata.email}/${route.query.filename}`)" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-share-alt text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Share this file</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Share this file to friends via link.</span>
                    </p>
                </div>
            </div>
            <div @click="open_file_access_dialog" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-plus text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Add to allowed list</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Enable your close friends to access your file.</span>
                    </p>
                </div>
            </div>
            <div @click="handleDelete" class="px-8 max-sm:px-4 cursor-pointer hover:bg-red-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center">
                    <i class="icon pi pi-exclamation-triangle text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Delete this file</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Delete this file for good.</span>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>
