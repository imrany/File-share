<script lang="ts" setup>
import Table from "../components/ui/Table.vue"
import Footer from "../components/ui/Footer.vue"
import indexedDB from "../indexedDB"
import sheet from "@/assets/icons/sheet.png"
import music from "@/assets/icons/music.png"
import zip from "@/assets/icons/zip.png"
import pdf from "@/assets/icons/pdf.png"
import doc from "@/assets/icons/document.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import UploadDialog from "../components/ui/Dialog/Upload.vue"
import FileDialog from "../components/ui/Dialog/File.vue"
import CreateDialog from "../components/ui/Dialog/CreateFolder.vue"
import SearchDialog from "../components/ui/Dialog/Search.vue"
import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"
import { inject, onMounted, ref } from "vue"
import { allow_notifications } from "../index";
import { useRouter, useRoute } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
import { useToast } from 'vue-toast-notification';
import { share_file, loader } from "../index"
import FileProperties from "../components/ui/Dialog/FileProperties.vue"
import pop_sound from "@/assets/sounds/pop.mp3"

const router=useRouter()
const route=useRoute()
const toast=useToast()
const capacity=ref("")
const error:any=ref(true)
const message:any=ref('')
const profile_btn=ref('')
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const sub_folder=ref("Files")
const header="Categories"
const file_format:any=ref({
    application:{
        count:0,
        tatol_size:"0 Mb",
        other_file:0
    },
    audio:{
        count:0,
        tatol_size:"0 Mb",
        other_file:0
    },
    video:{
        count:0,
        tatol_size:"0 Mb",
        other_file:0
    },
    image:{
        count:0,
        tatol_size:"0 Mb",
        other_file:0
    }
})
let files:any=ref()
let $file:any=ref(
    {
        file: "", 
        uploadedAt: "", 
        filename: "", 
        size: 0, 
        type: "", 
        id: ""
    }
)
const list:any=ref(false)
const select_value=ref("")

function upload_open(){
    const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
function create_open(){
    const dialogElement=document.getElementById("create-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
function search_open(){
    const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
    dialogElement.showModal()
}

function open_delete_dialog(filename:string){
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
}

async function open_file_dialog(filename:string){
    const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
    router.push(`?open=${filename}`)

    const request=await indexedDB()
    const db:any=await request
    const transaction=db.transaction("All_files","readwrite")
    const fileStore=transaction.objectStore("All_files")
    const singleFile=fileStore.index("filename")
    const getFile=singleFile.get([route.query.open])

    getFile.onsuccess=()=>{
        $file.value=getFile.result
        dialogElement.showModal()
    }
    getFile.onerror=()=>{
        console.log("error",getFile.result)
        dialogElement.close()
        router.push("/home")
    }
}

function open_file(url:any,e:any,filename:string){
    if(e.shiftKey){
        open_delete_dialog(filename)
    }else {
        let aDom = document.createElement('a')
        if(aDom){
            aDom.target="_blank"
            aDom.href = url
            aDom.click()
        }
    }
}

function show_list() {
    list.value=true
    localStorage.setItem("list",'true')
}
function hide_list() {
    list.value=false
    localStorage.setItem("list",'false')
}

const fetchFiles=async()=>{
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")

        const fileEmail=fileStore.index("email")
        const fileEmailKey = fileEmail.getAll([`${userdata.email}`]);
        fileEmailKey.onsuccess=()=>{
            if (fileEmailKey.result.length!==0){
                error.value=false
                files.value=fileEmailKey.result
                let type_application:any=[]
                let type_audio:any=[]
                let type_video:any=[]
                let type_image:any=[]
                fileEmailKey.result.forEach((i:any)=>{
                    if(i.type.includes("application")){
                        type_application.push(i)
                        file_format.value.application.count=type_application.length
                        file_format.value.application.total_size=convert_size(i.size)
                        file_format.value.application.other_file=`-${files.value.length-file_format.value.application.count}`
                    }else  if(i.type.includes("audio")){
                        type_audio.push(i)
                        file_format.value.audio.count=type_audio.length
                        file_format.value.audio.total_size=convert_size(i.size)
                        file_format.value.audio.other_file=`-${files.value.length-file_format.value.audio.count}`
                    }else  if(i.type.includes("video")){
                        type_video.push(i)
                        file_format.value.video.count=type_video.length
                        file_format.value.video.total_size=convert_size(i.size)
                        file_format.value.video.other_file=`-${files.value.length-file_format.value.video.count}`
                    }else  if(i.type.includes("image")){
                        type_image.push(i)
                        file_format.value.image.count=type_image.length
                        file_format.value.image.total_size=convert_size(i.size)
                        file_format.value.image.other_file=`-${files.value.length-file_format.value.image.count}`
                    }
                })
            }else{
                message.value="No local files, get started by adding files."
                // upload_open()
            }
        }
        
    } catch (error:any) {
        console.log(error.message)
    }
}

onMounted(()=>{
    fetchFiles()
    storage()
    list.value=localStorage.getItem("list")
    profile_btn.value=userdata.email.slice(0,2).toUpperCase()
    openFirstTutorialToast()
})

let results:any=[]
async function handleSearchTerm(){
    let term=route.query.search_term||route.query.sort_term
    if (term) {
        const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
        dialogElement.close()

        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const fileEmail=fileStore.index("email")
        const fileEmailKey = fileEmail.getAll([`${userdata.email}`]);
    
        fileEmailKey.onsuccess=()=>{
            fileEmailKey.result.forEach((i:any)=>{
                if (i.filename.includes(route.query.search_term)||i.type.includes(route.query.search_term)) {
                    const folder_view=document.getElementById("folder_view") as HTMLDivElement
                    const back_link=document.getElementById("back_link") as HTMLDivElement
                    folder_view.style.display="none"
                    back_link.style.display="flex"
                    results.push(i)
                    files.value=results
                    router.push("/home")
                }else{
                    console.log(`Cannot find ${term}`)
                }
            })
        }
    } 
}

function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}

function storage(){
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then((data:any) => {
        let kbs=(x:number)=>x/1000
        let mbs=(x:number)=>x/1000000
        let gbs=(x:number)=>x/1000000000
        if(data.usage<1000){
            capacity.value=`${data.usage} bytes/${Math.round(gbs(data.quota))} Gb`;
        }else if(data.usage>1000000){
            capacity.value=`${Math.round(mbs(data.usage))} Mb/${Math.round(gbs(data.quota))} Gb`;
        }else if(data.usage>1000000000){
            capacity.value=`${Math.round(gbs(data.usage))} Mb/${Math.round(gbs(data.quota))} Gb`;
        }else{
            capacity.value=`${Math.round(kbs(data.usage))} Kb/${Math.round(gbs(data.quota))} Gb`;
        }
        });
    }
} 

const handleFilter=()=>{
    router.push(`?search_term=${select_value.value}`)
    sub_folder.value=`${select_value.value}s`
}


const handleCategory=(e:any)=>{
    router.push(`?search_term=${e.target.value}`)
    sub_folder.value=`${e.target.value}s`
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

const reload=()=>{
    window.location.reload()
}

const handleSearch=(e:any)=>{
    let value:string=e.target.value
    if(value.includes('marco')||value.includes('Marco')){
        openMarco()
    }else{
        router.push(`?search_term=${value}`)
        handleSearchTerm()
    }
}

const show_menu=()=>{
    const menu=document.getElementById("menu") as HTMLDivElement
    menu.style.display="block"
}
const close_menu=()=>{
    const menu=document.getElementById("menu") as HTMLDivElement
    menu.style.display="none"
}

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

const uploadFile=async(file:File,file_object:any)=>{
    loader.on()
    try {
        const url=!route.fullPath.includes('/group')?`${origin}/drive/upload/users/${userdata.folder_id}`:`${origin}/drive/upload/groups/${userdata.folder_id}`
        const formData=new FormData()
        formData.append("file",file)
        const response=await fetch(url,{
            method:"POST",
            body:formData,
            headers:{
                'authorization':userdata.access_token,
            }
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
        }else{
            handleUpload(parseRes.id,file_object)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}
async function handleUpload(fieldId:string,file:any) {
    try {
        let file_body={
            email:userdata.email,
            filename:file.filename,
            username:userdata.username,
            uploadedAt:file.uploadedAt,
            size:file.size,
            file:fieldId,
            type:file.type,
        }
        let url=`${origin}/api/uploads/${userdata.email}`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                'authorization':`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                file_body
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000,
            })
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
    }
    loader.off()
}

const download_file=(data:any,url:any)=>{
    let aDom = document.createElement('a')
    if('download' in aDom){
        aDom.type = 'download'
        aDom.href = url
        aDom.download = `${data.filename}`
        aDom.target="_blank"
        aDom.click()
    }
}

const open_file_properties=(fileprop:any)=>{
    $file.value=fileprop
    const dialogElement=document.getElementById("file-properties-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

const openMarco=()=>{
    const toast=document.getElementById('toast') as HTMLDivElement
    toast.style.transition='ease-in-out 1s'
    toast.style.transitionDelay='1s'
    toast.style.transitionDuration='2s'
    toast.style.display="flex"
}

const openFirstTutorialToast=()=>{
    let firstTime:any=localStorage.getItem('first-time')
    setTimeout(()=>{
        if(firstTime===true||!firstTime){
            new Audio(pop_sound).play()
            const toast=document.getElementById('toast') as HTMLDivElement
            toast.style.transition='ease-in-out 1s'
            toast.style.transitionDelay='1s'
            toast.style.transitionDuration='2s'
            toast.style.display="flex"
        }
    },500)
}

</script>

<template>
<LayoutGrid>
    <template #grid-2>
        <div @dblclick="close_all_contexts">
            <div class="flex justify-between mb-5 pr-8 py-[5px] border-b-[1px] bg-white border-gray-200" id="nav">
                <div class="flex items-center">
                    <button class="flex text-sm justify-center items-center text-gray-700 border-r-[1px] border-gray-200 font-semibold w-[120px] h-[35px]" @click="upload_open" title="Add file">
                        <i class="icon pi pi-plus mr-2"></i> 
                        <p>Add file</p>
                    </button>
                    <button title="Your storage" class="flex text-sm justify-center items-center text-gray-500 font-semibold w-[200px] h-[35px]">
                        <i class="icon pi pi-th-large mr-2"></i> 
                        <p>
                            <span>{{capacity}}</span> 
                            <span class="ml-2">Storage</span>
                        </p>
                    </button>
                </div>

                <div class="flex items-center justify-center border-l-[1px] pl-4 border-gray-200">
                    <button  title="toggle theme" class="hover:bg-gray-300 transition-all rounded-[5px] w-[35px] h-[35px] text-xs flex justify-center items-center">
                        <i class="icon pi pi-moon text-base"></i> 
                        <!-- <i class="icon pi pi-sun text-base"></i>  -->
                    </button>

                    <button v-if="!error" @click="search_open" title="Search for a file or folder" class="hover:bg-gray-300 transition-all rounded-[5px] w-[35px] h-[35px] text-xs flex justify-center items-center">
                        <i class="icon pi pi-search text-base"></i> 
                    </button>

                    <button @click="allow_notifications" title="notifications" class=" w-[35px] h-[35px] text-xs flex justify-center items-center hover:bg-gray-300 transition-all rounded-[5px] mr-1" >
                        <i class="icon pi pi-bell text-base"></i> 
                    </button>

                    <button @click="router.push(`/users?email=${userdata.email}`)" title="notifications" class=" w-[35px] h-[35px] text-xs flex justify-center items-center bg-orange-500 hover:rounded-[5px] transition-all rounded-[20px] mr-1" >
                        <span class="text-xs text-white">{{profile_btn}}</span> 
                    </button>
                </div>
            </div>
            <div id="file-tabs" class="fixed z-20 top-0 left-0 right-0 bg-white shadow-sm shadow-slate-300 pb-2">
                <div class="flex bg-[#fffbf7] mx-4 text-base px-4 pt-4 mt-4 pb-4 rounded-[40px] shadow-sm shadow-slate-600 justify-between items-center font-semibold" >
                    <button class="icon pi pi-list ml-3 mr-2" @click="show_menu"></button>
                    <div class="flex flex-grow items-center  px-2">
                        <input type="text" @change="handleSearch" class="bg-transparent font-normal max-md:w-[70vw] max-sm:w-[60vw] outline-none" placeholder="Search for File"/>
                        <i class="icon pi pi-search text-slate-600 ml-auto"></i>
                    </div>
                </div>

                <div class="fixed bg-[#fffbf7] top-0 left-0 right-0 bottom-0" id="menu" @click="close_menu">
                    <div class="flex flex-col">
                        <RouterLink to="/home" class="flex items-center border-b-[1px]  pt-8 pb-4 px-10">
                            <img src="/favicon.png" class="w-[30px] h-[35px]" alt="."/>
                            <p class="text-lg ml-2 text-slate-800">Wekafile</p>
                            <i class="icon pi pi-plus ml-auto" @click="upload_open"></i> 
                        </RouterLink>

                        <RouterLink to="/storage" class="hover:bg-slate-200 flex flex-col justify-center  pt-5 pb-4 px-10">
                            <p class="text-base ml-2 text-slate-800 mb-2"><i class="icon pi pi-th-large mr-3"></i>Storage</p>
                            <p class="text-sm ml-2 text-slate-600">{{capacity}}</p>
                        </RouterLink>

                        <RouterLink to="/uploads" class="hover:bg-slate-200 flex flex-col justify-center  py-4 px-10">
                            <p class="text-base ml-2 text-slate-800 mb-2"><i class="icon pi pi-cloud-upload mr-3"></i>My uploads</p>
                        </RouterLink>

                            <RouterLink to="/shared" class="hover:bg-slate-200 flex flex-col justify-center  py-4 px-10">
                            <p class="text-base ml-2 text-slate-800 mb-2"><i class="icon pi pi-briefcase mr-3"></i>Shared files</p>
                        </RouterLink>
                            <button @click="allow_notifications" class="hover:bg-slate-200 flex flex-col justify-center  py-4 px-10">
                            <p class="text-base ml-2 text-slate-800 mb-2"><i class="icon pi pi-bell mr-3"></i>Notifications</p>
                        </button>
                        <button @click="router.push(`/users?email=${userdata.email}`)" class="hover:bg-slate-200 flex flex-col justify-center  py-4 px-10">
                            <p class="text-base ml-2 text-slate-800 mb-2"><i class="icon pi pi-cog mr-3"></i>Settings</p>
                        </button>
                    </div>
                </div>
            </div>

            <div class="flex sm:h-[70vh] h-[100vh] items-center justify-center" v-if="error">
                <p class="text-xl max-md:text-lg max-sm:text-sm text-gray-500 font-semibold">{{message}}</p>
            </div>
            <div class="max-md:mt-[70px] max-md:px-6 px-8 max-md:py-8" v-else>
                <div id="folder_view">
                    <div class="flex justify-between" id="folder_view">
                        <div class="">
                            <p class="max-md:text-base text-2xl font-semibold">{{header}}</p>
                            <div class="flex mt-2 mb-4">
                                <div class="text-gray-500 text-sm flex">
                                    <p>Filter by: </p>
                                    <select name="type" @click="handleFilter" v-model="select_value" class="text-gray-700 font-semibold bg-transparent ml-2 focus:outline-0">
                                        <option disabled value="">Types</option>
                                        <option value="image">images</option>
                                        <option value="video">videos</option>
                                        <option value="application">documents</option>
                                        <option value="text">Texts</option>
                                    </select> 
                                </div>
                            </div>
                        </div>

                        <div class="" id="recently">
                            <div class="bg-white flex rounded-[50px] hover:shadow-lg" v-if="list=='false'||list==false">
                                <button @click="hide_list" class="bg-gray-600 shadow-lg text-white w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
                                    <i class="icon pi pi-th-large text-base"></i> 
                                </button>

                                <button @click="show_list" class=" text-gray-800 w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                                    <i class="icon pi pi-list text-base"></i> 
                                </button>
                            </div>
                            <div class="bg-white flex rounded-[50px] hover:shadow-lg" v-else>
                                <button @click="hide_list" class="text-gray-800 w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
                                    <i class="icon pi pi-th-large text-base"></i> 
                                </button>

                                <button @click="show_list" class="bg-gray-600 text-white  w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                                    <i class="icon pi pi-list text-base"></i> 
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="">
                        <div class="grid max-lg:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 mb-10" v-if="list=='false'||list==false" id="recently">
                            <button @click="handleCategory" value="image" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-[300px] max-lg:w-[45vw]">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-image text-lg"></i>
                                    <p class="text-sm ml-2">Images</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.image.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="audio" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-[300px]  max-lg:w-[45vw]">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-play text-lg"></i>
                                    <p class="text-sm ml-2">Audio</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.audio.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="video" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-[300px] max-lg:w-[45vw]">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-video text-lg"></i>
                                    <p class="text-sm ml-2">Videos</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.video.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="application" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-[300px] max-lg:w-[45vw]">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-file text-lg"></i>
                                    <p class="text-sm ml-2">Documents</p>
                                </div>
                                <div class="">
                                    <p class="text-xs text-gray-500">{{file_format.application.count}} files</p>
                                </div>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="recently" v-else>
                            <button @click="handleCategory" value="image" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-image text-lg"></i>
                                    <p class="text-sm ml-2">Images</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.image.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="audio" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-play text-lg"></i>
                                    <p class="text-sm ml-2">Audio</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.audio.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="video" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-video text-lg"></i>
                                    <p class="text-sm ml-2">Videos</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.video.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="application" class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-file text-lg"></i>
                                    <p class="text-sm ml-2">Documents</p>
                                </div>
                                <div class="">
                                    <p class="text-xs text-gray-500">{{file_format.application.count}} files</p>
                                </div>
                            </button>
                        </div>

                        <div class="grid grid-cols-1  gap-y-3 mt-4 mb-14" id="file-tabs">
                            <button @click="handleCategory" value="image" class="flex py-3 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-image text-2xl"></i>
                                    <p class="text-sm ml-2">Images</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.image.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="audio" class="flex py-3 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-play text-2xl"></i>
                                    <p class="text-sm ml-2">Audio</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.audio.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="video" class="flex py-3 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-video text-2xl"></i>
                                    <p class="text-sm ml-2">Videos</p>
                                </div>
                                <div class="">
                                    <!-- <p>{{file_format.audio.total_size}}</p> -->
                                    <p class="text-xs text-gray-500">{{file_format.video.count}} files</p>
                                </div>
                            </button>
                            <button @click="handleCategory" value="application" class="flex py-3 px-2 justify-center items-center cursor-pointer rounded-[5px] border bg-gray-100 h-fit w-full">
                                <div class="flex items-center flex-grow text-gray-700 ">
                                    <i class="icon pi pi-file text-2xl"></i>
                                    <p class="text-sm ml-2">Documents</p>
                                </div>
                                <div class="">
                                    <p class="text-xs text-gray-500">{{file_format.application.count}} files</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <p class="max-md:text-base text-2xl text-gray-700 font-semibold mt-10">{{sub_folder}}</p>
                <div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                    <div class="cursor-pointer rounded-[5px] mx-2 bg-gray-50 transition-all hover:shadow-md hover:shadow-slate-400 h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
                        <div @click="close_file_context(file.filename)" :id="`${file.filename}`" style="display:none;" class="transition-all scale-[90%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 -mt-4 ml-16 bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                            <div @click="close_file_context(file.filename)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                            </div>
                            <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-eye mr-2"></i>
                                <p>View</p>
                            </div>
                            <div  @click="()=>uploadFile(file.file,file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-cloud-upload mt-1 mr-2"></i>
                                <p>Upload</p>
                            </div>
                            <div @click="()=>share_file(file.filename,file.file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-share-alt mt-1 mr-2"></i>
                                <p>Share</p>
                            </div>
                            <div @click="download_file(file,convert(file.file))" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-download mt-1 mr-2"></i>
                                <p>Download</p>
                            </div>
                            <div @click="()=>open_file_properties(file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                <p>Properties</p>
                            </div>
                            <div @click="open_delete_dialog(file.filename)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                <i class="icon pi pi-trash mt-1 mr-2"></i>
                                <p>Delete</p>
                            </div>
                        </div>
                        <div @dblclick="($event)=>open_file(convert(file.file),$event,file.filename)">
                            <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                            <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="doc" :alt="file.filename" :title="file.filename" v-if="file.type.includes('.doc')||file.type.includes('.odt')||file.type.includes('/msword')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] h-[120px] bg-black rounded-t-[5px]" v-if="file.type.includes('video')">
                                <source :src="convert(file.file)" :type="file.type">
                            </video>
                            <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] object-cover h-[120px] rounded-t-[5px]"  v-if="file.type.includes('image')">
                            <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <div class="mx-4 my-4 font-semibold">
                                <p class="text-sm text-gray-800">{{file.filename.slice(0,20)}}</p>
                                <p class="text-xs text-gray-500 mt-2">{{file.uploadedAt}}</p>
                            </div>
                        </div>
                        <div @click="open_file_context(file.filename)" class="flex text-gray-800 justify-between items-center text-xs px-3 py-2 rounded-b-[5px]">
                            <p>{{convert_size(file.size)}}</p>
                            <i class="icon pi pi-list"></i>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                    <div :title="file.filename" class="flex justify-between bg-gray-100 rounded-[5px] cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                        <div @click="close_file_context(file.filename)" :id="`${file.filename}`" style="display:none;" class="transition-all scale-[90%] context flex flex-col text-sm z-[200] absolute shadow-slate-500 -mt-14 ml-[60vw] bg-white text-gray-800 w-[200px] rounded-md shadow-sm">
                            <div @click="close_file_context(file.filename)" class="p-2 bg-gray-500 rounded-t-[5px] flex items-center cursor-pointer">
                                <i class="icon ml-auto pi pi-times mr-2 font-bold text-white"></i>
                            </div>
                            <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="p-2 border-b-[1px] flex items-center cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-eye mr-2"></i>
                                <p>View</p>
                            </div>
                            <div  @click="()=>uploadFile(file.file,file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-cloud-upload mt-1 mr-2"></i>
                                <p>Upload</p>
                            </div>
                            <div @click="()=>share_file(file.filename,file.file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-share-alt mt-1 mr-2"></i>
                                <p>Share</p>
                            </div>
                            <div @click="download_file(file,convert(file.file))" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-download mt-1 mr-2"></i>
                                <p>Download</p>
                            </div>
                            <div @click="()=>open_file_properties(file)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200">
                                <i class="icon pi pi-info-circle mt-1 mr-2"></i>
                                <p>Properties</p>
                            </div>
                            <div @click="open_delete_dialog(file.filename)" class="p-2 border-b-[1px] flex cursor-pointer hover:bg-slate-200 hover:text-red-500">
                                <i class="icon pi pi-trash mt-1 mr-2"></i>
                                <p>Delete</p>
                            </div>
                        </div>
                        <div class="flex py-2 px-2 justify-center items-center cursor-pointer rounded-[5px] h-fit w-full">
                            <div  @dblclick="($event)=>open_file(convert(file.file),$event,file.filename)"  class="flex items-center flex-grow text-gray-700 ">
                                <img :src="music" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('audio')">
                                <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]">
                                <img :src="pdf" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('pdf')">
                                <img :src="doc" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('.doc')||file.type.includes('.odt')||file.type.includes('/msword')">
                                <img :src="sheet" :alt="file.filename" :title="file.filename"  class="object-cover mr-1 w-[35px] h-[40px] rounded-[5px]" v-if="file.type.includes('sheet')||file.type.includes('csv')">
                                <img :src="convert(file.file)" :alt="file.filename" class="mr-1 w-[40px] object-cover h-[40px] rounded-[5px]"  v-if="file.type.includes('image')">
                                <video :controls="false" :autoplay="false" name="media" class="mr-1 object-cover bg-black w-[40px] h-[40px] rounded-[5px]" v-if="file.type.includes('video')">
                                    <source :src="convert(file.file)" :type="file.type">
                                </video>
                                <img :src="text" :alt="file.filename" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.type.includes('text/plain')">
                                <img :src="html" :alt="file.filename" class="object-cover mr-1 w-[40px] h-[40px] rounded-[5px]"  v-if="file.type.includes('text/html')">
                                <p class="text-sm text-gray-800 ml-2">{{file.filename.slice(0,25)}}</p>
                            </div>
                            <div  class="mr-2" @click="open_file_context(file.filename)">
                                <p class="text-sm text-gray-500 icon pi pi-list"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-items gap-4 mt-4 mb-16" id="file-tabs">
                    <div class="shadow-md shadow-slate-300 cursor-pointer bg-white h-fit mobile-width-item" v-for="(file,id) in files" :key="id" :title="file.filename">
                        <div @click="($event)=>open_file(convert(file.file),$event,file.filename)">
                            <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[17px] h-[80px] object-cover">
                            <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')||file.type.includes('csv')" class="object-cover w-[70px] ml-4 mb-6 mt-[17px] h-[80px]">
                            <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')||!file.type" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                            <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 object-cover mt-[16px] h-[80px]">
                            <img :src="doc" :alt="file.filename" :title="file.filename" v-if="file.type.includes('.doc')||file.type.includes('.odt')||file.type.includes('/msword')" class="w-[90px] ml-4 mb-6 object-cover mt-[16px] h-[80px]">
                            <video :controls="false" :id="`${id}`" :autoplay="false" name="media" class="w-[100%] object-cover h-[120px] bg-black" v-if="file.type.includes('video')">
                                <source :src="convert(file.file)" :type="file.type">
                            </video>
                            <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="object-cover w-[100%] h-[120px]"  v-if="file.type.includes('image')">
                            <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] object-cover h-[80px]">
                            <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[15px] object-cover h-[85px]">
                        </div>
                        <div class="bg-gray-100 px-4 py-4 flex justify-between">
                            <p class="text-xs">{{file.filename.slice(0,13)}}...</p>
                            <i @click="open_file_dialog(file.filename)" class="icon pi pi-list"></i>
                        </div>
                    </div>
                </div>

                <div class="ml-2 my-8 cursor-pointer flex items-center text-gray-800" id="back_link" style="display:none;" @click="reload">
                    <i class="icon pi pi-arrow-left text-sm mr-1"></i>
                    <p >Back</p>
                </div>
            </div>

            <!-- <Footer/> -->
            <DeleteFileDialog :filename="route.query.filename" :fetchItems="fetchFiles"/>
            <SearchDialog :searchFunction="handleSearchTerm()"/>
            <FileProperties :file="$file"/>
            <FileDialog :file_object="$file" :fetchItems="fetchFiles"/>
            <UploadDialog :error="message" :fetchItems="fetchFiles"/>
            <CreateDialog/>
        </div>
    </template>
</LayoutGrid>
</template>
