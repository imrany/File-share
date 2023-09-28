<script setup lang="ts">
import {inject,ref } from "vue"
import { useToast } from "vue-toast-notification"

const show_input=ref(false)
const update_option:any=ref(false)
const preview=ref(false)
const groupname=ref('')
const grouptype=ref('')
const groupphoto=ref()
const groupprivacy=ref(false)
const error=ref('')

let date=new Date()
let newObj = Intl.DateTimeFormat('en-US', {
    timeZone: "America/New_York"
})
let newDate = newObj.format(date);
let min=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`
let time=date.getHours()>12?`${date.getHours()}:${min}PM`:`${date.getHours()}:${min}AM`
const lastLogin=`${newDate} ${time}`;
const platform=navigator.platform

const userdata:any=inject("userdata")
const origin:any=inject("origin")
const props=defineProps<{
    fetchDetails:any
}>()

const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("create-group-dialog") as HTMLDialogElement
    dialogElement.close()
};



async function handleSubmit(path:string){
    try {
        let url=`${origin}/api/auth/group/register`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                groupname:groupname.value,
                grouptype:grouptype.value,
                email:`${userdata.email}`,
                lastLogin,
                userPlatform:platform, 
                privacy:groupprivacy.value,
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
            props.fetchDetails()
            close_update_photo()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        console.log(error.message)
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
    show_input.value=false
}
const close_update_password=()=>{
    update_option.value=false
}

function show_preview(e:any){
    preview.value=true
    error.value=""
    const file=e.target.files[0]
    groupphoto.value=e.target.files[0]
    if(file){
        const reader=new FileReader()
        reader.onload=()=>{
            const previewImage=document.getElementById("preview") as HTMLImageElement
            previewImage.src=`${reader.result}`
        }
        reader.readAsDataURL(file)
    }
}

async function submit_group_photo(e:any){
    try {
        e.preventDefault()
        if(groupname.value&&groupprivacy.value&&grouptype.value&&groupphoto.value){
            let accountType="groups"
            const url=`${origin}/upload/profile/${accountType}/${userdata.email}`
            const formData=new FormData()
            formData.append("file",groupphoto.value)
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
                handleSubmit(parseRes.url)
                dialog_close()
            }
        }else if(groupname.value.length===0){
            show_input_form()
            error.value="*Please enter your group name"
        }else if(grouptype.value.length===0){
            show_input_form()
            error.value="*Please enter your group info"
        }else if(groupprivacy.value===undefined){
            open_update_password()
            error.value="*Please specify your group privacy"
        }else if(groupphoto.value===undefined){
            open_update_photo()
            error.value="*Please add your group photo"
        }
        console.log(groupname.value,groupprivacy.value,grouptype.value,groupphoto.value)
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
    }
}
</script>

<template>
    <dialog id="create-group-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-6">
        <button  class="ml-[auto] px-5 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <form @submit="submit_group_photo" class="flex flex-col items-center" id="create_group_form">
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
                                <span class="maxvue-handbook.pdf-sm:text-xs text-sm">Name</span>
                                <span class="max-sm:text-sm text-slate-600">Your group name</span>
                            </p>
                            <i class="icon pi pi-pencil max-sm:text-sm ml-auto"></i>
                        </div>
                    </div>
                    <div class="px-8 max-sm:px-4 cursor-pointer hover:bg-slate-200" v-else-if="show_input===true">
                        <div class="flex flex-col py-4 px-6 max-sm:px-3">
                            <label for="name" class="font-semibold mb-1 flex items-center">Enter group name <span class="ml-auto text-sm text-red-500 font-normal">{{error}}</span></label>
                            <input v-model="groupname" class="outline-none border-b-[1px] mb-3 bg-transparent border-green-500" type="text" name="name" id="name">
                            <label for="name" class="font-semibold mb-1 flex items-center">Specific your group info <span class="ml-auto text-sm text-red-500 font-normal">{{error}}</span></label>
                            <input v-model="grouptype" class="outline-none border-b-[1px] bg-transparent border-green-500" placeholder="eg. Gaming, Photography, About your group" type="text" name="name" id="name">
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
                    <button class="w-[100px] items-center font-semibold mt-2 h-[35px] bg-green-400 text-white rounded-md">Create</button>
                </div>
            </div>
            <div class="flex flex-col w-full" v-else-if="update_option===true">
                <div class="px-8 max-sm:px-4">
                    <p class="text-center text-xl font-semibold text-gray-700">Group photo</p>
                    <div class="flex flex-col py-4 px-6 items-center">
                        <label class="cursor-pointer flex flex-col items-center justify-center">
                            <span class="text-sm text-red-500 font-normal">{{error}}</span>
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
                        <label for="privacy" class="ml-1 flex items-center cursor-pointer mt-4 max-md:text-sm">
                            <input :checked="true" v-model="groupprivacy" :value="false" type="checkbox" name="privacy" id="privacy" class="w-[18px] h-[18px]">
                            <span class="ml-2 flex items-center">Make group public <span class="ml-auto text-sm text-red-500 font-normal">{{error}}</span></span>
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
