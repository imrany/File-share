<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
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

const userdata:any=inject("userdata")
const toast=useToast()
const router=useRouter()
let files:any=ref([])
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
            // console.log({files:res.files,count:res.count})
            files.value=res.files
            loader.off()
        }
    })
}
onMounted(()=>{
    fetchFiles()
})
function convert(file:any){
    let blob1 = new Blob([new Uint8Array(file)],{type:`${file.type}`}) 
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

function open_file(url:any,file:any){
    let aDom = document.createElement('a') 
    if(aDom){
        aDom.target="_blank"
        aDom.href = url
        aDom.download=file.filename
        aDom.click()
    }
}
const list:any=localStorage.getItem("list")
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col px-8 pb-8 pt-4">
                 <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
                    <div class="flex px-10 py-5 items-center">
                        <i @click="router.back()" class="icon pi pi-arrow-left text-xl mr-6"></i>
                         <p class="text-xl text-slate-800">{{title}}</p>
                    </div>
                </div>
                <div class="mt-24 lg:mt-4">
                   <div class="flex flex-col">
                    <div class="flex h-[100vh] items-center justify-center" v-if="error">
                        <p class="text-xl text-red-500">{{error}}</p>
                    </div>
                        <div class="grid grid-cols-5 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                            <div class="cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
                                <div @click="()=>open_file(convert(file.file),file)">
                                    <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="video" :alt="file.filename" :title="file.filename" v-if="file.type.includes('video')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
                                    <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                    <div class="mx-4 my-4 font-semibold">
                                        <p class="text-sm">{{file.filename.slice(0,20)}}</p>
                                        <p class="text-xs text-gray-500 mt-2">{{file.uploadedAt}}</p>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                                    <p>{{convert_size(file.size)}}</p>
                                    <i class="icon pi pi-download"></i>
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
                                    <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                                    <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                                    <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold">
                                            {{file.filename.slice(0,25)}} 
                                        </p>
                                        <p class="text-sm text-gray-500" id="type">{{file.type}}</p>
                                    </div>
                                </div>
                                <div @click="()=>open_file(convert(file.file),file)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-download text-base"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="file-tabs">
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                                <div @click="()=>open_file(convert(file.file),file)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                                    <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                                    <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                                    <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                                    <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                                    <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                                    <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                                    <div class="flex flex-col justify-center">
                                        <p class="text-sm">
                                            {{file.filename.slice(0,25)}} 
                                        </p>
                                    </div>
                                </div>
                                <div @click="()=>open_file(convert(file.file),file)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-download text-base"></i>
                                </div>
                            </div>
                        </div>
                   </div>

                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
