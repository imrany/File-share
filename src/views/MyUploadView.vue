<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter, useRoute } from "vue-router";
import { socket } from "@/socket";
import { useToast } from "vue-toast-notification";
import sheet from "@/assets/icons/sheet.png"
import music from "@/assets/icons/music.png"
import zip from "@/assets/icons/zip.png"
import pdf from "@/assets/icons/pdf.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { loader } from "..";
import AllowAccess from "../components/ui/Dialog/AllowAcces.vue"
import MobileNav from "../components/ui/MobileNav.vue"
import FileMenu from "../components/ui/Dialog/FileMenu.vue"
import FeedbackDialog from "@/components/ui/Dialog/Feedback.vue";

const userdata:any=inject("userdata")
const origin:any=inject('origin')
const toast=useToast()
const router=useRouter()
const route=useRoute()
let files:any=ref([])
const shared_files=ref([])
const title="My uploads"
const error=ref("")
const feedbackDetails=ref({
    error:"",
    title:"",
    success:""
})

async function getUploads(){
    try{
        let url=`${origin}/api/uploads/${userdata.email}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                'authorization':`Bearer ${userdata.token}`,
                "content-type":"application/json"
            }
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
            error.value=parseRes.error
        }else{
            if(parseRes.files.length===0){
                error.value="No uploads"
                loader.off()
            }else{
                files.value=parseRes.files
                shared_files.value=parseRes.files
                loader.off()
            }
        }
    }catch(error:any){
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
        error.value=error.message
        // router.back()
    }
}

onMounted(()=>{
    getUploads()
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

const open_file_menu_dialog=(filename:string)=>{
    const dialogElement=document.getElementById("filemenu-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
};

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
const list:any=localStorage.getItem("list")
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col max-md:px-4 md:px-8 pb-8 pt-4">
                <MobileNav :title="title"/>
                <div class="max-xl:mt-24">
                   <div class="flex flex-col">
                    <div class="flex h-[70vh] items-center justify-center" v-if="error">
                        <p class="text-xl text-red-500">{{error}}</p>
                    </div>
                        <div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                            <div @mousemove="startPlay(`${id}`)" @mouseleave="stopPlay(`${id}`)" class="cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
                                <div @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)">
                                    <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
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
                                                <span class="ml-auto font-normal text-xs">
                                                    <span v-if="file.email!==userdata.email">{{file.groupname}}</span>
                                                    <span v-if="file.email===userdata.email" class="text-green-400" :title="file.groupname">You shared this file</span>
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div @click="open_file_menu_dialog(file.filename)" v-if="file.email===userdata.email" class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                    <p>{{convert_size(file.size)}}</p>
                                    <i class="icon pi pi-list"></i>
                                </div>
                                <div @click="download_file(`${origin}/${file.file}`,file.filename)" v-if="file.email!==userdata.email" class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                    <p>{{convert_size(file.size)}}</p>
                                    <i class="icon pi pi-download"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                                <div @click="()=>router.push(`/files?file=${file.file}&filename=${file.filename}`)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                                    <img :src="`${origin}/${file.file}`" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                                    <video :controls="false" :autoplay="false" name="media" class="mr-4 bg-black w-[40px] h-full rounded-md" v-if="file.type.includes('video')">
                                        <source :src="`${origin}/${file.file}`" :type="file.type">
                                    </video>
                                    <!-- <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm" > -->
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
                                <div v-if="file.email===userdata.email" @click="open_file_menu_dialog(file.filename)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-list text-base"></i>
                                </div>
                                <div @click="download_file(`${origin}/${file.file}`,file.filename)"   v-if="file.email!==userdata.email" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-download text-base"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-items gap-4 mt-4 mb-16" id="file-tabs">
                            <div @mousemove="startPlay(`${id}`)" @mouseleave="stopPlay(`${id}`)" class="shadow-md shadow-slate-300 cursor-pointer bg-white h-fit mobile-width-item" v-for="(file,id) in files" :key="id" :title="file.filename">
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
                                    <i v-if="file.email===userdata.email" @click="open_file_menu_dialog(file.filename)" class="icon pi pi-list"></i>
                                    <i @click="download_file(`${origin}/${file.file}`,file.filename)"   v-if="file.email!==userdata.email" class="icon pi pi-download"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackDialog :feedback="feedbackDetails"/>
            <FileMenu :fetchFiles="fetchFiles"/>
            <AllowAccess :shared_files="shared_files"/>
        </template>
    </LayoutGrid>
</template>
