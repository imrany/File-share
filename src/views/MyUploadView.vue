<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import sheet from "@/assets/icons/sheet.png"
import document from "@/assets/icons/document.png"
import drawing from "@/assets/icons/drawing.png"
import form from "@/assets/icons/form.png"
import site from "@/assets/icons/site.png"
import photoshop from "@/assets/icons/photoshop.png"
import slide from "@/assets/icons/slide.png"
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
import FileProperties from "../components/ui/Dialog/FileProperties.vue"
import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"

const userdata:any=inject("userdata")
const access_token:any=inject('access_token')
const origin:any=inject('origin')
const toast=useToast()
const router=useRouter()
const route=useRoute()
const file=ref({})
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
        let url=`${origin}/drive/files`
        const response=await fetch(url,{
            method:"GET",
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
            loader.off()
            error.value=parseRes.error
        }else{
            if(parseRes.files.length===0){
                error.value="No uploads"
                loader.off()
            }else{
                console.log(parseRes.files)
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

const open_file_menu_dialog=(filename:string)=>{
    const dialogElement=document.getElementById("filemenu-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
};

const list:any=localStorage.getItem("list")

let context_state:string[]=[]
function open_file_context(filename:string){
    context_state.push(filename)
    context_state.forEach((item:string)=>{
        if(item.includes(filename)){
            const context=document.getElementById(`${item}`) as HTMLDivElement
            context.style.display="flex"
        }else {
            const last_context=document.getElementById(`${item}`) as HTMLDivElement
            last_context.style.display="none"
        }
    })
}

function close_file_context(filename:string){
    const context=document.getElementById(`${filename}`) as HTMLDivElement
    context.style.display="none"
    context_state=[]
}

function close_all_contexts(){
    const contexts=document.querySelectorAll(".context")
    contexts.forEach((context:any)=>{
        context.style.display="none"
    })
} 

const open_file_properties=(fileprop:any)=>{
    file.value=fileprop
    const dialogElement=document.getElementById("file-properties-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

async function download_file(url:string,filename:string){
    try {
        const response=await fetch(url,{
            method:"GET",
            headers:{
                'authorization':access_token,
            }
        })
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
        console.log(error.message)
    }
    
}

async function fetch_image(id:string){
    try{
        const url=`${origin}/drive/files/${id}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                'authorization':access_token,
            }
        })
        const parseRes=await response.blob()
        const imageUrl = URL.createObjectURL(parseRes);
        return imageUrl
    } catch (error:any) {
        console.log(error.message)
    }
}

function open_delete_dialog(filename:string){
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
}
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col max-md:px-4 md:px-8 pb-8 md:pt-4">
                <MobileNav :title="title"/>
                <div class="max-xl:mt-16">
                    <div class="flex flex-col">
                        <div class="flex h-[70vh] items-center justify-center" v-if="error">
                            <p class="text-xl max-md:text-lg max-sm:text-sm text-red-500">{{error}}</p>
                        </div>
                        <div v-else>
                            <div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                                <div class="cursor-pointer rounded-[5px] mx-2 bg-gray-50 transition-all hover:shadow-md hover:shadow-slate-400 h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.name">
                                    <div @click="close_file_context(file.name)" :id="`${file.name}`" style="display:none;" class="transition-all scale-[90%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 -mt-4 ml-16 bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                                        <div @click="close_file_context(file.name)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                            <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                                        </div>
                                        <div @click="()=>router.push(`/files?fieldId=${file.id}&filename=${file.name}`)" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-eye mr-2"></i>
                                            <p>View</p>
                                        </div>
                                        <div @click="open_file_menu_dialog(file.name)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-share-alt mt-1 mr-2"></i>
                                            <p>Share</p>
                                        </div>
                                        <div @click="download_file(`${origin}/${file.id}`,`${file.name}`)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-download mt-1 mr-2"></i>
                                            <p>Download</p>
                                            file.kind      </div>
                                        <div  @click="()=>open_file_properties(file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                            <p>Properties</p>
                                        </div>
                                        <div @click="open_delete_dialog(file.name)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                            <i class="icon pi pi-trash mt-1 mr-2"></i>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                    <div @click="()=>router.push(`/files?fieldId=${file.id}&filename=${file.name}`)">
                                        <img :src="music" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="sheet" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.spreadsheet')||file.mimeType.includes('csv')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                        <img :src="zip" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('postscript')||!file.mimeType" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="pdf" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="document" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.document')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="slide" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.presentation')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="site" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.site')" class="w-[70px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="form" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.form')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="drawing" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('.drawing')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] h-[120px] bg-black rounded-t-[5px]" v-if="file.mimeType.includes('video')">
                                            <source :src="`https://drive.google.com/uc?id=${file.id}`" :type="file.mimeType">
                                        </video>
                                        <img :src="`https://drive.google.com/uc?id=${file.id}`" :alt="file.name" :title="file.name" class="w-[100%] object-cover h-[120px] rounded-t-[5px]" v-if="file.mimeType.includes('image/jpeg')||file.mimeType.includes('image/png')||file.mimeType.includes('image/jpg')">
                                        <img :src="photoshop" :alt="file.name" :title="file.name" class="w-[100%] object-cover h-[120px] rounded-t-[5px]" v-if="file.mimeType.includes('.photoshop')">
                                        <img :src="text" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img :src="html" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <div class="mx-4 my-4 font-semibold">
                                            <p class="text-sm text-gray-800">{{file.name.slice(0,20)}}</p>
                                            <p class="text-xs text-gray-500 mt-2">{{file.modifiedTime}}</p>
                                        </div>
                                    </div>
                                    <div @click="open_file_context(file.name)" class="flex text-gray-800 justify-between items-center text-xs px-3 py-2 rounded-b-[5px]">
                                        <p>{{convert_size(file.size)}}</p>
                                        <i class="icon pi pi-list"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                                <div :title="file.name" class="flex justify-between bg-gray-100 rounded-[5px] cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                                    <div @click="close_file_context(file.name)" :id="`${file.name}`" style="display:none;" class="transition-all scale-[95%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 -mt-8 ml-[60vw] bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                                        <div @click="close_file_context(file.name)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                            <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                                        </div>
                                        <div @click="()=>router.push(`/files?fieldId=${file.id}&filename=${file.name}`)" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-eye mr-2"></i>
                                            <p>View</p>
                                        </div>
                                        <div @click="open_file_menu_dialog(file.name)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-share-alt mt-1 mr-2"></i>
                                            <p>Share</p>
                                        </div>
                                        <div @click="download_file(`${origin}/${file.id}`,`${file.name}`)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-download mt-1 mr-2"></i>
                                            <p>Download</p>
                                        </div>
                                        <div class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                            <p>Properties</p>
                                        </div>
                                        <div @click="open_delete_dialog(file.name)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                            <i class="icon pi pi-trash mt-1 mr-2"></i>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                    <div class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] h-fit w-full">
                                        <div  @click="()=>router.push(`/files?fieldId=${file.id}&filename=${file.name}`)"  class="flex items-center flex-grow text-gray-700 ">
                                            <img :src="music" :alt="file.name" :title="file.name"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.mimeType.includes('audio')">
                                            <img :src="zip" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('zip')||!file.mimeType" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]">
                                            <img :src="pdf" :alt="file.name" :title="file.name"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.mimeType.includes('pdf')">
                                            <img :src="sheet" :alt="file.name" :title="file.name"  class="object-cover mr-1 w-[35px] h-[40px] rounded-[5px]" v-if="file.mimeType.includes('sheet')||file.mimeType.includes('csv')">
                                            <img :src="`${origin}/${file.id}`" :alt="file.name" class="mr-1 w-[40px] object-cover h-[40px] rounded-[5px]"  v-if="file.mimeType.includes('image')">
                                            <video :controls="false" :autoplay="false" name="media" class="mr-1 object-cover bg-black w-[40px] h-[40px] rounded-[5px]" v-if="file.mimeType.includes('video')">
                                                <source :src="`${origin}/${file.id}`" :type="file.mimeType">
                                            </video>
                                            <img :src="text" :alt="file.name" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.mimeType.includes('text/plain')">
                                            <img :src="html" :alt="file.name" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.mimeType.includes('text/html')">
                                            <p class="text-sm text-gray-800 ml-2">{{file.name.slice(0,25)}}</p>
                                        </div>
                                        <div  class="mr-2" @click="open_file_context(file.name)">
                                            <p class="text-sm text-gray-500 icon pi pi-list"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="grid grid-items gap-4 mt-4 mb-16" id="file-tabs">
                                <div class="shadow-md shadow-slate-300 cursor-pointer bg-white h-fit mobile-width-item" v-for="(file,id) in files" :key="id" :title="file.name">
                                    <div @click="()=>router.push(`/files?fieldId=${file.id}&filename=${file.name}`)">
                                        <img :src="music" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[17px] h-[80px] object-cover">
                                        <img :src="sheet" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('sheet')||file.mimeType.includes('csv')" class="object-cover w-[70px] ml-4 mb-6 mt-[17px] h-[80px]">
                                        <img :src="zip" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('zip')||!file.mimeType" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img :src="pdf" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('pdf')" class="w-[90px] ml-4 mb-6 object-cover mt-[16px] h-[80px]">
                                        <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] object-cover h-[120px] bg-black" v-if="file.mimeType.includes('video')">
                                            <source :src="`${origin}/${file.id}`" :type="file.mimeType">
                                        </video>
                                        <img :src="`${origin}/${file.id}`" :alt="file.name" :title="file.name" class="object-cover w-[100%] h-[120px]"  v-if="file.mimeType.includes('image')">
                                        <img :src="text" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img :src="html" :alt="file.name" :title="file.name" v-if="file.mimeType.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[15px] object-cover h-[85px]">
                                    </div>
                                    <div class="bg-gray-100 px-4 py-4 flex justify-between">
                                        <p class="text-xs">{{file.name.slice(0,15)}}...</p>
                                        <i  @click="open_file_menu_dialog(file.name)" class="icon pi pi-list"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FeedbackDialog :feedback="feedbackDetails"/>
            <FileMenu :fetchFiles="getUploads"/>
            <FileProperties :file="file"/>
            <DeleteFileDialog :filename="route.query.filename" :fetchItems="getUploads"/>
            <AllowAccess :shared_files="shared_files"/>
        </template>
    </LayoutGrid>
</template>
