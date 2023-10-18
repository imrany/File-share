<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter, useRoute } from "vue-router";
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
import ExitGroupDialog from "../components/ui/Dialog/ExitGroup.vue"
import FileProperties from "../components/ui/Dialog/FileProperties.vue"
import Image from "@/assets/icons/image-icon.png"
import FileDialog from "../components/ui/Dialog/File.vue"
import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"

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
const $file:any=ref({
    email:'',
    allowedemails:[],
    groupname:'',
    file: "", 
    uploadedAt: "", 
    uploadedat: "", 
    filename: "", 
    size: 0, 
    type: "", 
    id: ""
})
const title=`${route.query.name}`
const file:any=ref(
    {
        email:"",
        size: 0, 
        type: "", 
        uploadedat:"",
        filename:'',
        allowedemails:[]
    }
)
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
            details.value.members=parseRes.details.members!==null?parseRes.details.members.length:''
            is_member.value=parseRes.details.members!==null?parseRes.details.members.includes(userdata.email):false
            loader.off()
            console.log(parseRes)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}

async function handleJoin(){
    try {
        loader.on()
        let url=userdata.email!==details.value.details.email?`${origin}/api/join_group/${route.query.name}/${userdata.email}`:""
        const response=await fetch(url,{
            method:"POST",
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
            router.back()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000,
            })
           fetchFiles()
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

async function download_file(id:string,filename:string){
    try {
         toast.info(`Downloading ${filename.slice(0,18)}...`,{
            position:"top-right",
            duration:7000,
        })
        const url=`${origin}/drive/download/${id}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                'authorization':userdata.access_token
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
         toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
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
const open_exit_dialog=()=>{
    const dialogElement=document.getElementById("exit-group-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

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

function open_file_dialog(fileObj:any){
    const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
    router.push(`?filename=${fileObj.filename}`)
    $file.value=fileObj
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
                        <div class="flex flex-col mb-10 border-b-[1px] bg-slate-100 border-gray-200" id="group_hero">
                            <img  v-lazy="{ src: `https://drive.google.com/uc?id=${details.details.photo}`, loading: Image, error: Image }" class="object-cover max-md:h-[40vh] h-[55vh]"/>
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
                                        <p v-if="userdata&&details.details.email!==userdata.email">
                                            <span class="font-semibold">Created by</span> {{details.details.email}}
                                        </p>
                                        <p v-else>
                                          <span class="font-semibold">Created by</span> {{details.details.email}}
                                        </p>
                                        <!-- <p v-if="details.details.email===userdata.email">My group</p> -->
                                        <p v-if="details.details.members===null">No Member</p>
                                        <p v-else><span class="font-semibold">{{ details.members }}</span> Members</p>
                                    </div>
                                </div>
                                <div class="flex flex-col justify-center items-center" v-if="userdata">
                                    <div @click="handleJoin" class="flex justify-center items-center rounded-[50px]  text-sm cursor-pointer bg-green-400 text-white w-[100px] h-[30px]" title="Join group" v-if="details.details.email!==userdata.email&&details.details.privacy===false&&is_member===false">
                                        <i class="icon pi pi-plus mr-1 text-xs"></i>
                                        <p>Join group </p>
                                    </div>
                                    <div @click="update_group" v-else-if="details.details.email===userdata.email" class="max-sm:text-sm flex justify-center items-center cursor-pointer">
                                        <i class="icon pi pi-cog mr-2"></i> <p>Settings</p>
                                    </div>
                                    <div class="flex ml-auto mt-4">
                                        <div  @click="upload_open" v-if="details.details.email===userdata.email||is_member" class="icon pi pi-upload rounded-[50px] text-sm flex justify-center items-center cursor-pointer w-[30px] h-[30px] hover:bg-slate-400 hover:text-white" title="Upload an item"></div>
                                        <div @click="share_url(`Checkout ${route.query.name} group`,group_link)" class="icon pi pi-share-alt rounded-[50px]  text-sm flex justify-center items-center cursor-pointer w-[30px] h-[30px] hover:bg-slate-400 hover:text-white" title="Share group link to friends"></div>
                                        <div  @click="open_exit_dialog" v-if="details.details.email!==userdata.email&&is_member===true" class="icon pi pi-times rounded-[50px] text-sm flex justify-center items-center cursor-pointer w-[30px] h-[30px] hover:bg-slate-400 hover:text-white" title="Exit group"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex h-[40vh] items-center justify-center" v-if="error">
                            <p class="text-xl max-md:text-lg max-sm:text-sm text-gray-500 font-semibold">{{error}}</p>
                        </div>

                        <div v-else>
                            <div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-y-4 my-4 max-md:px-4 md:px-8 mb-16" id="recently" v-if="list=='false'||list==false">
                                <div class="cursor-pointer rounded-[5px] mx-2 bg-gray-50 transition-all hover:shadow-md hover:shadow-slate-400 h-fit w-[200px]" v-for="(file,id) in details.files" :key="id" :title="file.filename">
                                    <div @click="close_file_context(file.filename)" :id="`${file.filename}`" style="display:none;" class="transition-all scale-[90%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 mt-4  ml-16 bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                                        <div @click="close_file_context(file.filename)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                            <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                                        </div>
                                        <a target="_blank" :href="`https://drive.google.com/uc?id=${file.file}`" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-eye mr-2"></i>
                                            <p>View</p>
                                        </a>
                                        <div @click="download_file(`${file.file}`,`${file.filename}`)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-download mt-1 mr-2"></i>
                                            <p>Download</p>
                                        </div>
                                        <div @click="()=>open_file_properties(file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                            <p>Properties</p>
                                        </div>
                                        <div v-if="details.details.email===userdata.email||file.email===userdata.email" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                            <i class="icon pi pi-trash mt-1 mr-2"></i>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                    <a target="_blank" :href="`https://drive.google.com/uc?id=${file.file}`">
                                        <img v-lazy="{ src: music, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img v-lazy="{ src: sheet, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                                        <img v-lazy="{ src: zip, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img v-lazy="{ src: pdf, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] h-[120px] bg-black rounded-t-[5px]" v-if="file.type.includes('video')">
                                            <source :src="`https://drive.google.com/uc?id=${file.file}`" :type="file.type">
                                        </video>
                                        <img v-lazy="{ src: `https://drive.google.com/uc?id=${file.file}`, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" class="w-[100%] object-cover h-[120px] rounded-t-[5px]"  v-if="file.type.includes('image')">
                                        <img v-lazy="{ src: text, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <img v-lazy="{ src: html, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                                        <div class="mx-4 my-4 font-semibold">
                                            <p class="text-sm text-gray-800">{{file.filename.slice(0,20)}}</p>
                                            <p class="text-xs text-gray-500 mt-2">{{file.uploadedat}}</p>
                                        </div>
                                    </a>
                                    <div @click="open_file_context(file.filename)" class="flex text-gray-800 justify-between items-center text-xs px-3 py-2 rounded-b-[5px]">
                                        <p>{{convert_size(file.size)}}</p>
                                        <i class="icon pi pi-list"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="max-md:px-4 md:px-8 pb-8 grid grid-cols-1 mt-2 mb-16" id="recently" v-else>
                                <div :title="file.filename" class="flex justify-between bg-gray-100 mt-1 rounded-[5px] cursor-pointer hover:shadow-lg" v-for="(file, index) in details.files" :key="index">
                                    <div @click="close_file_context(file.filename)" :id="`${file.filename}`" style="display:none;" class="transition-all scale-[95%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 -mt-8 ml-[60vw] bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                                        <div @click="close_file_context(file.filename)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                            <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                                        </div>
                                        <a target="_blank" :href="`https://drive.google.com/uc?id=${file.file}`" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-eye mr-2"></i>
                                            <p>View</p>
                                        </a>
                                        <div @click="download_file(`${file.file}`,`${file.filename}`)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-download mt-1 mr-2"></i>
                                            <p>Download</p>
                                        </div>
                                        <div @click="()=>open_file_properties(file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                            <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                            <p>Properties</p>
                                        </div>
                                        <div v-if="details.details.email===userdata.email||file.email===userdata.email" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                            <i class="icon pi pi-trash mt-1 mr-2"></i>
                                            <p>Delete</p>
                                        </div>
                                    </div>
                                    <div class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] h-fit w-full">
                                        <a target="_blank" :href="`https://drive.google.com/uc?id=${file.file}`"  class="flex items-center flex-grow text-gray-700 ">
                                            <img v-lazy="{ src: music, loading: Image, error: Image }" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('audio')">
                                            <img v-lazy="{ src: zip, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]">
                                            <img v-lazy="{ src: pdf, loading: Image, error: Image }" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('pdf')">
                                            <img v-lazy="{ src: sheet, loading: Image, error: Image }" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[35px] h-[40px] rounded-[5px]" v-if="file.type.includes('sheet')||file.type.includes('csv')">
                                            <img v-lazy="{ src: `https://drive.google.com/uc?id=${file.file}`, loading: Image, error: Image }" :alt="file.filename" class="mr-1 w-[40px] object-cover h-[40px] rounded-[5px]"  v-if="file.type.includes('image')">
                                            <video :controls="false" :autoplay="false" name="media" class="mr-1 object-cover bg-black w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('video')">
                                                <source :src="`https://drive.google.com/uc?id=${file.file}`" :type="file.type">
                                            </video>
                                            <img v-lazy="{ src: text, loading: Image, error: Image }" :alt="file.filename" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.type.includes('text/plain')">
                                            <img v-lazy="{ src: html, loading: Image, error: Image }" :alt="file.filename" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.type.includes('text/html')">
                                            <p class="text-sm text-gray-800 ml-2">{{file.filename.slice(0,25)}}</p>
                                        </a>
                                        <div class="mr-2" @click="open_file_context(file.filename)">
                                            <p class="text-sm text-gray-500 icon pi pi-list"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="md:px-8 max-md:px-4 pb-8 grid grid-items gap-4 mt-4 mb-16" id="file-tabs">
                                <div class="shadow-md shadow-slate-300 cursor-pointer bg-white h-fit mobile-width-item" v-for="(file,id) in details.files" :key="id" :title="file.filename">
                                    <a target="_blank" :href="`https://drive.google.com/uc?id=${file.file}`">
                                        <img v-lazy="{ src: music, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[17px] h-[80px] object-cover">
                                        <img v-lazy="{ src: sheet, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="object-cover w-[70px] ml-4 mb-6 mt-[17px] h-[80px]">
                                        <img v-lazy="{ src: zip, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img  v-lazy="{ src: pdf, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 object-cover mt-[16px] h-[80px]">
                                        <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] object-cover h-[120px] bg-black" v-if="file.type.includes('video')">
                                            <source :src="`https://drive.google.com/uc?id=${file.file}`" :type="file.type">
                                        </video>
                                        <img v-lazy="{ src: `https://drive.google.com/uc?id=${file.file}`, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" class="object-cover w-[100%] h-[120px]"  v-if="file.type.includes('image')">
                                        <img v-lazy="{ src: text, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                                        <img v-lazy="{ src: html, loading: Image, error: Image }" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[15px] object-cover h-[85px]">
                                    </a>
                                    <div class="bg-gray-100 px-4 py-4 flex justify-between">
                                        <p class="text-xs">{{file.filename.slice(0,13)}}...</p>
                                        <i  @click="open_file_dialog(file)" class="icon pi pi-list"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
            <DeleteAccountDialog :data="details.details" :fetchDetails="fetchFiles"/>
            <ExitGroupDialog :data="details.details" :fetchDetails="fetchFiles"/>
            <UpdateGroup :fetchDetails="fetchFiles" :data="details.details"/>
            <FileDialog :file_object="$file" :fetchItems="fetchFiles"/>
            <DeleteFileDialog :filename="route.query.filename" :fetchItems="fetchFiles"/>
            <UploadDialog :error="error" :data="details.details" :fetchItems="fetchFiles"/>
            <FileProperties :file="file"/>
        </template>
    </LayoutGrid>
</template>
