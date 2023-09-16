<script setup lang="ts">
import {inject,ref} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader, share_url} from "../../../"

const show_input=ref(false)
const props=defineProps<{
    fetchDetails:any,
    data:any
}>()
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("profile-dialog") as HTMLDialogElement
    dialogElement.close()
};

function open_file_access_dialog(){
    const dialogElement=document.getElementById("shared-file-dialog") as HTMLDialogElement
    dialogElement.showModal()
    dialog_close()
}
async function handleUpdateName(e:any){
    try {
        e.preventDefault()
        dialog_close()
        let url=userdata.username?`${origin}/api/update/${route.query.email}`:`${origin}/api/update/${route.query.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`
            },
            body:JSON.stringify({
                name:e.target.name.value
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
            props.fetchDetails()
            cancel_input_form()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        loader.off()
        cancel_input_form()
    }
}

const show_input_form=()=>{
    show_input.value=true
}
const cancel_input_form=()=>{
    show_input.value=false
}
</script>

<template>
    <dialog id="profile-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-10">
        <button  class="ml-[auto] px-10 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <div @click="share_url(`${route.query.filename}`,`/files?file=/uploads/${userdata.email}/${route.query.filename}&filename=${route.query.filename}`)" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-image text-xl mr-4"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-xs text-sm">Update profile photo</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Update your profile photo.</span>
                    </p>
                    <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                </div>
            </div>
            <div>
                <div class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" @click="show_input_form" v-if="show_input===false">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center">
                        <i class="icon pi pi-user text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm">Name</span>
                            <span class="max-sm:text-sm text-slate-600" v-if="data.username">{{data.username}}</span>
                            <span class="max-sm:text-sm text-slate-600" v-else-if="data.groupname">{{data.groupname}}</span>
                        </p>
                        <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                    </div>
                </div>
                <form class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" @submit="handleUpdateName" v-else-if="show_input===true">
                    <div class="flex flex-col py-4 px-6 max-sm:px-3">
                        <label for="name" class="font-semibold mb-3">Enter your name</label>
                        <input class="outline-none border-b-[1px] bg-transparent border-green-500" type="text" name="name" id="name" :value="data.username?data.username:data.groupname">
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="cancel_input_form" class="mb-3">Cancel</button>
                        <button class="mb-3">Update</button>
                    </div>
                </form>
            </div>
            <div @click="open_file_access_dialog" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-shield text-xl mr-4"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-xs text-sm">Update password</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Only works if your know the old password.</span>
                    </p>
                    <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                </div>
            </div>
        </div>
    </dialog>
</template>
