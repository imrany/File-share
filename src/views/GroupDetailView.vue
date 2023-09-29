<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter, useRoute } from "vue-router";
import profile from "@/assets/images/profile.png"
import { useToast } from "vue-toast-notification";
import sheet from "@/assets/icons/sheet.png"
import music from "@/assets/icons/music.png"
import zip from "@/assets/icons/zip.png"
import pdf from "@/assets/icons/pdf.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { loader, share_url } from "..";
import MobileNav from "../components/ui/MobileNav.vue"
import DesktopNav from "@/components/ui/DesktopNav.vue";
import UpdateGroup from "../components/ui/Dialog/UpdateGroup.vue"
import DeleteAccountDialog from "../components/ui/Dialog/DeleteAccount.vue"
import UploadDialog from "../components/ui/Dialog/Upload.vue"

const userdata:any=inject("userdata")
const toast=useToast()
const router=useRouter()
const origin:any=inject('origin')
const route=useRoute()
let details:any=ref({
    files:[],
    details:{},
    count:0,
    members:0
})
const title=`${route.query.name}`
const error=ref("")
const is_member=ref(false)
const feedbackDetails=ref({
    error:"",
    title:"",
    success:""
})

const fetchFiles=async()=>{
    try {
        loader.on()
        let url=`${origin}/api/public_groups/${route.query.name}/${userdata.email}`
        const response=await fetch(url)
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
            error.value=parseRes.error
            router.back()
        }else{
            if(parseRes.files.length===0){
                error.value="No files shared"
                loader.off()
            }
            details.value.files=parseRes.files
            details.value.details=parseRes.details
            details.value.count=parseRes.count
            details.value.members=parseRes.details.members.length
            is_member.value=parseRes.details.members.includes(userdata.email)
            loader.off()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}

onMounted(()=>{
    fetchFiles()
})
function convert_size(size:number){
    let storage
    if (size>1000000) {
        const mb=Math.round(size/1000000)
        storage=`${mb} Mb`
    } else if(size>1000000000) {
            const gb=Math.round(size/1000000000)
        storage=`${gb} Gb`
    }else{
        const byte=Math.round(size/1000)
        storage=`${byte} bytes`
    }
    return storage
}

function open_file(url:string){
    let aDom = document.createElement('a') as HTMLAnchorElement
    if(aDom){
        aDom.target="_blank"
        aDom.href = url
        aDom.click()
    }
}

async function download_file(url:string,filename:string){
    try {
        const response=await fetch(url)
        const parseRes=await response.blob()
        let aDom = document.createElement('a') as HTMLAnchorElement
        if('download' in aDom){
            aDom.type = 'download'
            aDom.href =URL.createObjectURL(parseRes)
            aDom.download=filename
            aDom.target="_blank"
            aDom.click()
        } 
    } catch (error:any) {
        feedbackDetails.value={
            error:error.message,
            title:"Any error has occurred!",
            success:""
        }
        const dialogElement=document.getElementById("feedback-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    
}

function startPlay(id:string){
    const videoElement=document.getElementById(`${id}`) as HTMLVideoElement
    // videoElement.play()
    videoElement.controls=true
}
function stopPlay(id:string){
    const videoElement=document.getElementById(`${id}`) as HTMLVideoElement
    videoElement.controls=false
    videoElement.pause()
}
const update_group=()=>{
    const dialogElement=document.getElementById("group-profile-dialog") as HTMLDialogElement
    dialogElement.showModal()
};
function upload_open(){
    const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
    dialogElement.showModal()
}

const list:any=localStorage.getItem("list")
const group_link=window.location.href
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <DesktopNav :title="title" v-if="userdata"/>
            <div class="flex flex-col">
                <MobileNav :title="title"/>
                <div class="max-xl:mt-[70px]">
                   <div class="flex flex-col">
                        <div id="recently"  v-if="!userdata" class="flex mb-5 text-lg">
                            <p>{{title}}</p>
                            <RouterLink to="/signin" class="ml-auto text-[#fd9104]">Sign in to Fileshare</RouterLink>
                        </div>
                        <div class="flex flex-col mb-10 border-b-[1px] bg-slate-100 border-gray-200" id="group_hero">
                            <img :src="details.details.photo===null?profile:`${origin}/${details.details.photo}`" class="object-cover max-md:h-[40vh] h-[55vh]"/>
                            <div class="max-md:px-4 md:px-8 my-5 flex justify-between">
                                <div>
                                    <p class="text-xl mb-1 font-semibold">{{ details.details.groupname }}</p>
                                    <p class="text-green-600 text-sm max-md:text-xs" v-if="details.details.privacy===false">
                                        Public
                                    </p>
                                    <p class="text-blue-600 text-sm max-md:text-xs" v-if="details.details.privacy===true">
                                        Private
                                    </p>
                                    <p class="text-base max-md:text-sm">{{ details.details.grouptype }}</p>
                                    <div class="text-gray-500 text-sm">
                                        <p v-if="details.details.email!==userdata.email"><span class="font-semibold">Created by</span> {{details.details.email}}</p>
                                        <!-- <p v-if="details.details.email===userdata.email">My group</p> -->
                                        <p v-if="details.details.members===null">No Member</p>
                                        <p v-else><span class="font-semibold">{{ details.members }}</span> Members</p>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-center">
                                    <div v-if="details.details.email!==userdata.email" class="rounded-[50px] max-sm:text-sm flex justify-center font-semibold items-center cursor-pointer w-[100px] h-[35px] border-[1px] border-gray-400">
                                        Join
                                    </div>
                                    <div @click="update_group" v-else class="max-sm:text-sm flex justify-center items-center cursor-pointer">
                                        <i class="icon pi pi-cog mr-2"></i> <p>Settings</p>
                                    </div>
                                    <div class="flex ml-auto mt-4">
                                        <div  @click="upload_open" v-if="details.details.email===userdata.email||is_member" class="icon pi pi-upload rounded-[50px] text-sm flex justify-center items-center cursor-pointer w-[30px] h-[30px] hover:bg-slate-400 hover:text-white" title="Upload an item"></div>
                                        <div @click="share_url(`Checkout ${route.query.name} group`,group_link)" class="icon pi pi-share-alt rounded-[50px]  text-sm flex justify-center items-center cursor-pointer w-[30px] h-[30px] hover:bg-slate-400 hover:text-white" title="Share group link to friends"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex h-[40vh] items-center justify-center" v-if="error">
                            <p class="text-base text-red-500">{{error}}</p>
                        </div>
                        <div v-else>
                            <div :class="userdata?'grid-cols-5':'grid-cols-6'" class="max-md:px-4 md:px-8 pb-8 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                                <div @mousemove="startPlay(`${id}`)" @mouseleave="stopPlay(`${id}`)" class="cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]" v-for="(file,id) in details.files" :key="id" :title="file.filename">
                                    <div @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)">
                                        <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                        <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <video :controls="false" :id="`${id}`"  :autoplay="false" name="media" class="w-[100%] bg-black h-[120px] rounded-t-[20px]" v-if="file.type.includes('video')">
                                            <source :src="`${origin}/${file.file}`" :type="file.type">
                                        </video>
                                        <img :src="`${origin}/${file.file}`" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
                                        <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <div class="mx-4 my-4 font-semibold">
                                            <p class="text-sm">{{file.filename.slice(0,20)}}</p>
                                            <div class="text-sm text-gray-500" id="type">
                                                <p>
                                                    <span class="ml-auto font-normal text-xs"  v-if="userdata">
                                                        <span v-if="file.email!==userdata.email">{{file.groupname}}</span>
                                                        <span v-if="file.email===userdata.email" class="text-green-400" :title="file.groupname">You shared this file</span>
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                        <p>{{convert_size(file.size)}}</p>
                                        <!-- <i class="icon pi pi-list"></i> -->
                                        <i @click="download_file(`${origin}/${file.file}`,file.filename)"   v-if="file.email!==userdata.email" class="icon pi pi-download"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="max-md:px-4 md:px-8 pb-8 grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                                <div @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)" class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in details.files" :key="index">
                                    <div class="flex py-3 px-2 flex-grow" :title="file.filename">
                                        <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                                        <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                                        <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                                        <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                                        <img :src="`${origin}/${file.file}`" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                                        <video :controls="false" :autoplay="false" name="media" class="mr-4 bg-black w-[40px] h-[40px] rounded-md" v-if="file.type.includes('video')">
                                            <source :src="`${origin}/${file.file}`" :type="file.type">
                                        </video>
                                        <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                                        <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                                        <div class="flex flex-col">
                                            <p class="text-sm font-semibold">
                                                {{file.filename.slice(0,25)}} 
                                            </p>
                                            <div class="text-xs text-gray-500" id="type">
                                                <p>
                                                    <span  v-if="file.email!==userdata.email" class="ml-auto">{{file.groupname}}</span>
                                                    <span v-if="file.email===userdata.email" class="text-green-400" :title="file.groupname">You shared this file</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                        <!-- <i class="mt-2 icon pi pi-list text-base"></i> -->
                                        <i @click="download_file(`${origin}/${file.file}`,file.filename)"   v-if="file.email!==userdata.email" class="icon pi pi-download"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="md:px-8 max-md:px-4 pb-8 grid grid-items gap-4 mt-4 mb-16" id="file-tabs">
                                <div @mousemove="startPlay(`${id}`)" @mouseleave="stopPlay(`${id}`)" class="shadow-md shadow-slate-300 cursor-pointer bg-white h-fit mobile-width-item" v-for="(file,id) in details.files" :key="id" :title="file.filename">
                                    <div @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)">
                                        <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[17px] h-[80px] object-cover">
                                        <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="object-cover w-[70px] ml-4 mb-6 mt-[17px] h-[80px]">
                                        <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 object-cover mt-[16px] h-[80px]">
                                        <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] object-cover h-[120px] bg-black" v-if="file.type.includes('video')">
                                            <source :src="`${origin}/${file.file}`" :type="file.type">
                                        </video>
                                        <img :src="`${origin}/${file.file}`" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px]"  v-if="file.type.includes('image')">
                                        <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[15px] object-cover h-[85px]">
                                    </div>
                                    <div class="bg-gray-100 px-4 py-4 flex justify-between">
                                        <p class="text-xs">{{file.filename.slice(0,15)}}...</p>
                                        <i v-if="file.email===userdata.email"  @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)" class="icon pi pi-align-justify"></i>
                                        <i @click="download_file(`${origin}/${file.file}`,file.filename)"   v-if="file.email!==userdata.email" class="icon pi pi-download"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
    <DeleteAccountDialog :data="details.details" :fetchDetails="fetchFiles"/>
    <UpdateGroup :fetchDetails="fetchFiles" :data="details.details"/>
    <UploadDialog :error="error" :fetchItems="fetchFiles"/>
</template>
