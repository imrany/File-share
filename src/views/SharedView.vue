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

const userdata:any=inject("userdata")
const toast=useToast()
const router=useRouter()
const route=useRoute()
let files:any=ref([])
const shared_files=ref([])
const title="Shared Files"
const error=ref("")
const fetchFiles=()=>{
    loader.on()
    socket.emit('fetch_from_sharedfiles',userdata.email)
    socket.on('response',(res:any)=>{
        if(res.error){
            toast.error(res.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
            error.value=res.error
        }else{
            if(res.files.length===0){
                error.value="No files shared"
                loader.off()
            }else{
                // console.log({files:res.files,count:res.count})
                files.value=res.files
                shared_files.value=res.files
                loader.off()
            }
        }
    })
}

onMounted(()=>{
    fetchFiles()
})
function convert(file:any){
    let blob1 = new Blob([new Uint8Array(file)],{type:`${file.type}`}) 
    // let file1=new File([blob1],file.filename)
    let url =URL.createObjectURL(blob1)
    return url      
}

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

let view_item:any=ref({
    url:"",
    file:{
        file: "", 
        uploadedAt: "", 
        filename: "", 
        size: 0, 
        type: "", 
        sharedTo: ""
    }
})
const viewElement=ref(false)
function open_file(url:any,file:any){
    viewElement.value=true
    view_item.value={
        url,
        file
    }
    // let aDom = document.createElement('a') 
    // if(aDom){
    //     aDom.target="_blank"
    //     aDom.href = url
    //     // aDom.download=file.filename
    //     aDom.click()
    // }
}
function closed_view(){
    viewElement.value=false
}

function open_file_access_dialog(filename:string){
    const dialogElement=document.getElementById("shared-file-dialog") as HTMLDialogElement
    router.push(`?share=${filename}`)
    dialogElement.showModal()
}

function startPlay(id:string){
    const videoElement=document.getElementById(`${id}`) as HTMLVideoElement
    videoElement.play()
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
                <div class="mt-24 lg:mt-4">
                   <div class="flex flex-col">
                    <div class="flex h-[100vh] items-center justify-center" v-if="error">
                        <p class="text-xl text-red-500">{{error}}</p>
                    </div>
                        <div class="grid grid-cols-5 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                            <div @mousemove="startPlay(`${id}`)" @mouseleave="stopPlay(`${id}`)" class="cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
                                <div @click="()=>open_file(convert(file.file),file)">
                                    <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <video :controls="false" :id="`${id}`"  :autoplay="false" name="media" class="w-[100%] bg-black h-[120px] rounded-t-[20px]" v-if="file.type.includes('video')">
                                        <source :src="convert(file.file)" :type="file.type">
                                    </video>
                                    <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
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
                                <div @click="open_file_access_dialog(file.filename)" v-if="file.email===userdata.email" class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                    <p>{{convert_size(file.size)}}</p>
                                    <i class="icon pi pi-list"></i>
                                </div>
                                <div v-if="file.email!==userdata.email" class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                    <p>{{convert_size(file.size)}}</p>
                                    <i class="icon pi pi-users"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                                <div @click="()=>open_file(convert(file.file),file)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                                    <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                                    <video :controls="false" :autoplay="false" name="media" class="mr-4 bg-black w-[40px] h-full rounded-md" v-if="file.type.includes('video')">
                                        <source :src="convert(file.file)" :type="file.type">
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
                                <div v-if="file.email===userdata.email" @click="open_file_access_dialog(file.filename)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-list text-base"></i>
                                </div>
                                <div v-if="file.email!==userdata.email" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-download text-base"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-y-3 -mt-6 mb-16" id="file-tabs">
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                                <div @click="()=>open_file(convert(file.file),file)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                                    <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                                    <video :controls="false" :autoplay="false" name="media" class="mr-4 bg-black w-[40px] h-full rounded-md" v-if="file.type.includes('video')">
                                        <source :src="convert(file.file)" :type="file.type">
                                    </video>
                                    <!-- <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')"> -->
                                    <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                                    <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                                    <div class="flex flex-col justify-center">
                                        <p class="text-xs">
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
                                <div v-if="file.email===userdata.email" @click="open_file_access_dialog(file.filename)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-list text-base"></i>
                                </div>
                                <div v-if="file.email!==userdata.email" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-download text-base"></i>
                                </div>
                            </div>
                        </div>
                   </div>

                    <div class="fixed top-0 botton-0 left-0 bg-black right-0 z-20" v-if="viewElement===true">
                        <div @click="closed_view" class="fixed top-5 left-5 bg-white text-gray-800 rounded-[50px] cursor-pointer">
                            <div class="flex items-center justify-center w-[30px] h-[30px]">
                                <i class="icon pi pi-times text-base"></i>
                            </div>
                        </div>
                        <div class="flex flex-col items-center justify-center h-[100vh]">
                            <img :src="view_item.url" :alt="view_item.file.filename" class="sm:max-w-[80vw] md:h-[100vh]"  v-if="view_item.file.type.includes('image')">
                            <video :controls="true" :autoplay="true" class="sm:max-w-[80vw] md:h-[100vh]"  name="media" v-if="view_item.file.type.includes('video')">
                                <source :src="view_item.url" :type="view_item.file.type">
                            </video>
                            <video :controls="true" :autoplay="true" name="media" v-if="view_item.file.type.includes('audio')">
                                <source :src="view_item.url" :type="view_item.file.type">
                            </video>

                            <embed id="plugin" v-if="view_item.file.type.includes('application')" :type="view_item.file.type" :original-url="view_item.url" :src="`chrome-extension://${view_item.url}`" background-color="4283586137" javascript="allow" full-frame="" pdf-viewer-update-enabled="">
                        </div>
                    </div>
                </div>
            </div>
            <AllowAccess :shared_files="shared_files"/>
        </template>
    </LayoutGrid>
</template>
