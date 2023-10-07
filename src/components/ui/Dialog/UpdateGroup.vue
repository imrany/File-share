<script setup lang="ts">
import {inject,ref} from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader, share_url} from "../../../"

const show_input=ref(false)
const update_option:any=ref(false)
const preview=ref(false)
const show_checkbox=ref(false)
const show_remove_member=ref(false)

const props=defineProps<{
    fetchDetails:any,
    data:any
}>()
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const access_token:any=inject("access_token")
const route=useRoute()
const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("group-profile-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleUpdateName(e:any){
    try {
        e.preventDefault()
        dialog_close()
        let body=!props.data.grouptype?{groupname:e.target.name.value}:{groupname:e.target.name.value,grouptype:e.target.type.value}
        let url=route.query.email?`${origin}/api/groups/${route.query.email}`:`${origin}/api/groups/${userdata.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify(body)
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
            props.fetchDetails()
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

async function handleUpdatePrivacy(e:any) {
    try {
        e.preventDefault()
        dialog_close()
        let url=route.query.email?`${origin}/api/groups/${route.query.email}`:`${origin}/api/groups/${userdata.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                privacy:e.target.privacy.value
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
            props.fetchDetails()
            show_privacy_checkbox_cancel()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        show_privacy_checkbox_cancel()
    }
}

async function handleUpdateAddMember(e:any){
    try {
        e.preventDefault()
        dialog_close()
        let url=route.query.email?`${origin}/api/groups/${route.query.email}`:`${origin}/api/groups/${userdata.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                member:e.target.member.value,
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
            props.fetchDetails()
            close_update_password()
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

async function handleRemoveMember(e:any){
    try {
        e.preventDefault()
        dialog_close()
        let url=route.query.email?`${origin}/api/groups_member/${route.query.email}`:`${origin}/api/groups_member/${userdata.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                member:e.target.member.value,
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
            show_remove_member_section_cancel()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000
            })
            show_remove_member_section_cancel()
            props.fetchDetails()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        show_remove_member_section_cancel()
    }
    e.target.reset()
    dialog_close()
}

const uploadPhoto=async(e:any)=>{
    try {
        dialog_close()
        e.preventDefault()
        let accountType="groups"
        const url=`${origin}/drive/upload/${accountType}/${props.data.group_folder_id}`
        const formData=new FormData()
        formData.append("file",e.target.photo.files[0])
        const response=await fetch(url,{
            method:"POST",
            body:formData,
            headers:{
                'authorization':access_token,
            }
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

async function handleUpdatePhoto(fileId:string){
    try {
        let url=route.query.email?`${origin}/api/groups/${route.query.email}`:`${origin}/api/groups/${userdata.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                groupphoto:fileId
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
const show_privacy_checkbox=()=>{
    show_checkbox.value=true
}
const show_privacy_checkbox_cancel=()=>{
    show_checkbox.value=false
}
const show_remove_member_section=()=>{
    show_remove_member.value=true
}
const show_remove_member_section_cancel=()=>{
    show_remove_member.value=false
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

const delete_dialog=()=>{
    dialog_close()
    const dialogElement=document.getElementById("delete-account") as HTMLDialogElement
    dialogElement.showModal()
};
</script>

<template>
    <dialog id="group-profile-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-10">
        <button  class="ml-[auto] px-10 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full" v-if="update_option===false">
            <div @click="open_update_photo" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-image text-xl mr-4"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-xs text-sm">Update group photo</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Update your group photo.</span>
                    </p>
                    <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                </div>
            </div>
            <div>
                <div class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" @click="show_input_form" v-if="show_input===false">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center">
                        <i class="icon pi pi-users text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm"  v-if="!data.grouptype">Update group name</span>
                            <span class="max-sm:text-xs text-sm"  v-else-if="data.grouptype">Update group details</span>
                            <span v-if="data.group_ownership" class="max-sm:text-sm text-slate-600">{{data.group_ownership}}</span>
                            <span v-if="data.groupname" class="max-sm:text-sm text-slate-600">{{data.groupname}}</span>
                        </p>
                        <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                    </div>
                </div>
                <form class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" @submit="handleUpdateName" v-else-if="show_input===true">
                    <div class="flex flex-col py-4 px-6 max-sm:px-3">
                        <label for="name" class="font-semibold mb-3">Update group name</label>
                        <input v-if="data.group_ownership" class="outline-none border-b-[1px] bg-transparent border-green-500" type="text" name="name" id="name" :value="data.group_ownership">
                        <input v-if="data.groupname" class="outline-none border-b-[1px] bg-transparent border-green-500" type="text" name="name" id="name" :value="data.groupname">
                        <label  v-if="data.grouptype" for="name" class="font-semibold mb-3 mt-2">Update group info</label>
                        <input  v-if="data.grouptype" class="outline-none border-b-[1px] bg-transparent border-green-500" type="text" name="type" id="type" :value="data.grouptype">
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="cancel_input_form" class="mb-3">Cancel</button>
                        <button class="mb-3">Update</button>
                    </div>
                </form>
            </div>
            <div @click="open_update_password" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-plus text-xl mr-4"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-xs text-sm">Add a member</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Add members to your group.</span>
                    </p>
                    <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                </div>
            </div>
            <div>
                <div @click="show_remove_member_section" class="px-8 max-sm:px-4 cursor-pointer hover:bg-yellow-100" v-if="show_remove_member===false">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                        <i class="icon pi pi-exclamation-circle text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm">Remove a member</span>
                            <span class="text-sm max-sm:text-xs text-slate-600">Remove member from your group.</span>
                        </p>
                        <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                    </div>
                </div>
                <form class="px-8 max-sm:px-4 cursor-pointer hover:bg-yellow-100" @submit="handleRemoveMember" v-else-if="show_remove_member===true">
                    <div class="flex flex-col py-4 px-6 max-sm:px-3">
                        <div class="flex flex-col py-4 px-6 max-sm:px-3 max-sm:text-sm">
                            <label for="member" class="mb-1">Enter member's account email</label>
                            <input required  class="mb-3 outline-none border-b-[1px] bg-transparent focus:border-yellow-500 border-gray-500" type="email" name="member" id="member">
                        </div>
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="show_remove_member_section_cancel" class="mb-3">Cancel</button>
                        <button class="mb-3 text-yellow-500">Remove</button>
                    </div>
                </form>
            </div>
            <div v-if="!route.query.email">
                <div @click="show_privacy_checkbox" class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" v-if="show_checkbox===false">
                    <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                        <i class="icon pi pi-lock text-xl mr-4"></i>
                        <p class="flex flex-col">
                            <span class="max-sm:text-xs text-sm">Privacy settings</span>
                            <span class="text-sm max-sm:text-xs text-slate-600">Specify if it's a public or private group.</span>
                        </p>
                        <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                    </div>
                </div>
                <form class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" @submit="handleUpdatePrivacy" v-else-if="show_checkbox===true">
                    <div class="flex flex-col py-4 px-6 max-sm:px-3">
                        <label for="privacy" class="ml-1 flex items-center cursor-pointer mt-4 max-md:text-sm">
                            <input :checked="true" :value="data.privacy===true?false:true" type="checkbox" name="privacy" id="privacy" class="w-[18px] h-[18px]">
                            <span class="ml-2 flex items-center" v-if="data.privacy===true">Make group public </span>
                            <span class="ml-2 flex items-center" v-else>Make group private</span>
                        </label>
                    </div>
                    <div class="flex justify-around text-green-500 font-semibold">
                        <button type="button" @click="show_privacy_checkbox_cancel" class="mb-3">Cancel</button>
                        <button class="mb-3">Update</button>
                    </div>
                </form>
            </div>

            <div @click="delete_dialog" class="px-8 max-sm:px-4 cursor-pointer hover:bg-red-200" v-if="show_remove_member===false">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <i class="icon pi pi-exclamation-triangle text-xl mr-4"></i>
                    <p class="flex flex-col">
                        <span class="max-sm:text-xs text-sm">Delete group</span>
                        <span class="text-sm max-sm:text-xs text-slate-600">Delete <span v-if="data.groupname">{{ data.groupname }}</span> <span v-else>{{ data.group_ownership }}</span>.</span>
                    </p>
                    <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-full" v-else-if="update_option===true">
            <form class="px-8 max-sm:px-4" @submit="uploadPhoto">
                <p class="text-center text-xl font-semibold text-gray-700">Update photo</p>
                <div class="flex flex-col py-4 px-6 items-center">
                    <label class="cursor-pointer flex flex-col items-center justify-center">
                        <i class="icon pi pi-user text-4xl md:text-3xl h-[110px] text-gray-700 w-[110px] flex justify-center items-center bg-slate-300 rounded-[100px]" v-if="preview===false&&data.photo===null"></i>
                        <img v-else-if="preview===false" :src="`${origin}/${data.photo}`" class="w-[110px] h-[110px] rounded-[100px] object-cover"/>
                        <img v-else-if="preview===true" id="preview" class="w-[110px] h-[110px] rounded-[100px] object-cover"/>
                        <input type="file" @change="show_preview"  name="photo" accept="image/*" class="-z-10 -mb-5 opacity-0" required/>
                    </label>
                </div>
                <div class="flex justify-around text-green-500 font-semibold">
                    <button type="button" @click="close_update_photo" class="mb-3">Cancel</button>
                    <button class="mb-3">Save</button>
                </div>
            </form>
        </div>
        <div class="flex flex-col w-full" v-else-if="update_option===null">
            <form class="px-8 max-sm:px-4 cursor-pointer" @submit="handleUpdateAddMember">
                <p class="text-center text-xl max-sm:text-lg font-semibold text-gray-700">Add a member</p>
                <div class="flex flex-col py-4 px-6 max-sm:px-3 max-sm:text-sm">
                    <label for="member" class="mb-1">Enter member's account email</label>
                    <input required  class="mb-3 outline-none border-b-[1px] bg-transparent focus:border-green-500 border-gray-500" type="email" name="member" id="member">
                </div>
                <div class="flex justify-around text-green-500 font-semibold">
                    <button type="button" @click="close_update_password" class="mb-3">Cancel</button>
                    <button class="mb-3">Submit</button>
                </div>
            </form>
        </div>
    </dialog>
</template>
