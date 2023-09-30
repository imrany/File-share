<script setup lang="ts">
import {inject} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader, share_file, share_url} from "../../../"

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
async function share(url:string,filename:string){
    try {
        const response=await fetch(url)
        const parseRes=await response.blob()
        let file=new File([parseRes],filename)
        share_file(filename,file) 
    } catch (error:any) {
        console.log(error.message)
    }
    
}
</script>

<template>
    <dialog id="filemenu-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-10">
        <button  class="ml-[auto] px-10 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <div @click="share(`${origin}/uploads/users/${userdata.email}/${route.query.filename}`,`${route.query.filename}`)" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-copy text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Share this file</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Share physical file.</span>
                    </p>
                </div>
            </div>
            <div @click="share_url(`${route.query.filename} \n`,`/files?file=./uploads/users/${userdata.email}/${route.query.filename}&filename=${route.query.filename}`)" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-share-alt text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Share file link</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Anyone with this link can view this file.</span>
                    </p>
                </div>
            </div>
            <div @click="open_file_access_dialog" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-plus text-xl mr-3"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-sm">Who can access this file?</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Specify who can access your file.</span>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>
