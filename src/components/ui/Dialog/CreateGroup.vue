<script setup lang="ts">
import {inject,ref} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader, share_url} from "../../../"

const show_input=ref(false)
const update_option:any=ref(false)
const preview=ref(false)

// const props=defineProps<{
//     fetchDetails:any,
//     data:any
// }>()
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("create-group-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleUpdateName(e:any){
    try {
        e.preventDefault()
        dialog_close()
        let url=`${origin}/api/accounts/${route.query.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                username:e.target.name.value
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            // props.fetchDetails()
            cancel_input_form()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        cancel_input_form()
    }
}
async function handleUpdatePassword(e:any){
    try {
        e.preventDefault()
        dialog_close()
        if(e.target.password.value===e.target.confirm_password.value){
            let url=`${origin}/api/accounts/${route.query.email}`
            const response=await fetch(url,{
                method:"PATCH",
                headers:{
                    "authorization":`Bearer ${userdata.token}`,
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    old_password:e.target.old_password.value,
                    password:e.target.confirm_password.value
                })
            })
            const parseRes=await response.json()
            if(parseRes.error){
                toast.error(parseRes.error,{
                    position:"top-right",
                    duration:5000
                })
                close_update_password()
            }else{
                toast.success(parseRes.msg,{
                    position:"top-right",
                    duration:5000
                })
                close_update_password()
            }
        }else{
            toast.error("Password doesn't match",{
                position:"top-right",
                duration:5000
            })
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        close_update_password()
    }
    e.target.reset()
    dialog_close()
}

const uploadPhoto=async(e:any)=>{
    try {
        dialog_close()
        e.preventDefault()
        let accountType="users"
        const url=`${origin}/upload/profile/${accountType}/${userdata.email}`
        const formData=new FormData()
        formData.append("file",e.target.photo.files[0])
        const response=await fetch(url,{
            method:"POST",
            body:formData
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
        }else{
            handleUpdatePhoto(parseRes.url)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
    }
}

async function handleUpdatePhoto(path:string){
    try {
        let url=`${origin}/api/accounts/${route.query.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                photo:path
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            // props.fetchDetails()
            window.location.reload()
            close_update_photo()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        close_update_photo()
    }
}

const show_input_form=()=>{
    show_input.value=true
}
const cancel_input_form=()=>{
    show_input.value=false
}
const open_update_photo=()=>{
    update_option.value=true
}
const close_update_photo=()=>{
    update_option.value=false
    preview.value=false
}
const open_update_password=()=>{
    update_option.value=null
}
const close_update_password=()=>{
    update_option.value=false
}

function show_preview(e:any){
    preview.value=true
    const file=e.target.files[0]
    if(file){
        const reader=new FileReader()
        reader.onload=()=>{
            const previewImage=document.getElementById("preview") as HTMLImageElement
            previewImage.src=`${reader.result}`
        }
        reader.readAsDataURL(file)
    }
}
</script>

<template>
    <dialog id="create-group-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-6">
        <button  class="ml-[auto] px-5 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <form class="flex flex-col items-center">
            <div class="flex flex-col w-full" v-if="update_option===false">
                <div class="flex flex-col mb-4 items-center justify-center">
                    <p class="max-sm:text-xl text-2xl mb-2 text-gray-700 font-bold text-center">Create a  group</p>
                    <p class="text-sm text-center mx-10">Your group is where you and your friends would upload and share files.</p>
                </div>
                <div @click="open_update_photo" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                        <i class="icon pi pi-image text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm">Add group photo</span>
                            <span class="text-sm max-sm:text-xs text-slate-600">Add group your profile photo.</span>
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
                                <span class="max-sm:text-sm text-slate-600">Your group name</span>
                            </p>
                            <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                        </div>
                    </div>
                    <div class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" v-else-if="show_input===true">
                        <div class="flex flex-col py-4 px-6 max-sm:px-3">
                            <label for="name" class="font-semibold mb-1">Enter group name</label>
                            <input class="outline-none border-b-[1px] mb-3 bg-transparent border-green-500" type="text" name="name" id="name">
                            <label for="name" class="font-semibold mb-1">Specific your group info</label>
                            <input class="outline-none border-b-[1px] bg-transparent border-green-500" placeholder="eg. Gaming, Photography, About your group" type="text" name="name" id="name">
                        </div>
                        <div class="flex justify-around text-green-500 font-semibold">
                            <button type="button" @click="cancel_input_form" class="mb-3">Cancel</button>
                            <button type="button" @click="cancel_input_form" class="mb-3">Done</button>
                        </div>
                    </div>
                </div>
                <div @click="open_update_password" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                        <i class="icon pi pi-lock text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm">Privacy settings</span>
                            <span class="text-sm max-sm:text-xs text-slate-600">Specify if it's a public or private group.</span>
                        </p>
                        <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                    </div>
                </div>

                <div class="flex flex-col items-center">
                    <button class="w-[100px] items-center font-semibold mt-2 h-[30px] bg-green-400 text-white rounded-md">Create</button>
                </div>
            </div>
            <div class="flex flex-col w-full" v-else-if="update_option===true">
                <div class="px-8 max-sm:px-4">
                    <p class="text-center text-xl font-semibold text-gray-700">Group photo</p>
                    <div class="flex flex-col py-4 px-6 items-center">
                        <label class="cursor-pointer flex flex-col items-center justify-center">
                            <i class="icon pi pi-user text-4xl md:text-3xl h-[110px] text-gray-700 w-[110px] flex justify-center items-center bg-slate-300 rounded-[100px]" v-if="preview===false"></i>
                            <img v-else-if="preview===true" id="preview" class="w-[110px] h-[110px] rounded-[100px] object-cover"/>
                            <input type="file" @change="show_preview"  name="photo" accept="image/*" class="-z-10 -mb-5 opacity-0" required/>
                        </label>
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="close_update_photo" class="mb-3">Cancel</button>
                        <button type="button" @click="close_update_photo" class="mb-3">Done</button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full" v-else-if="update_option===null">
                <div class="px-8 max-sm:px-4 cursor-pointer">
                    <p class="text-center text-xl max-sm:text-lg font-semibold text-gray-700">Privacy settings</p>
                    <div class="flex flex-col py-4 px-6 max-sm:px-3 max-sm:text-sm">
                        <label for="new_password" class="mb-1">Enter your password</label>
                        <input required :minlength="8" class="mb-3 outline-none border-b-[1px] bg-transparent border-gray-500 focus:border-green-500" type="password" name="password" id="new_password">
                        <label for="confirm_password" class="mb-1">Confirm password</label>
                        <input required :minlength="8" class="outline-none border-b-[1px] bg-transparent border-gray-500 focus:border-green-500" type="password" name="confirm_password" id="confirm_password">
                        <label for="privacy" class="ml-1 flex items-center cursor-pointer mt-4 max-md:text-sm">
                            <input :checked="true" :value="false" type="checkbox" name="privacy" id="privacy" class="w-[18px] h-[18px]">
                            <span class="ml-2">Make group public</span>
                        </label>
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="close_update_password" class="mb-3">Cancel</button>
                        <button type="button" @click="close_update_password" class="mb-3">Done</button>
                    </div>
                </div>
            </div>
        </form>
    </dialog>
</template>
