<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import music from "@/assets/icons/music.png"
import sheet from "@/assets/icons/sheet.png"
import pdf from "@/assets/icons/pdf.png"
import zip from "@/assets/icons/zip.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import doc from "@/assets/icons/document.png"
import html from "@/assets/icons/html.png"
import { useRouter,useRoute } from "vue-router"
import { inject } from "vue"
import { useToast } from "vue-toast-notification"
import { loader, share_file } from "../../.."
import Image from "@/assets/icons/image-icon.png"

type file={
    email:string,
    allowedemails:any,
    groupname:string,
    file: any, 
    uploadedAt: string, 
    uploadedat: string, 
    filename: string, 
    size: number, 
    type: string,
    id?:string
}
const props=defineProps<{
    file_object:file,
    fetchItems:any
}>()

const userdata:any=inject("userdata")
const origin:any=inject("origin")
const router=useRouter()
const route=useRoute()
const toast=useToast()

const dialog_close=()=>{
    const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
    dialogElement.close()
}

function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}
const open=(url:any)=>{
    dialog_close()
    let aDom = document.createElement('a')
    if(aDom){
        aDom.target="_blank"
        aDom.href = url
        aDom.click()
    }
}

const download_file=(data:any,url:any)=>{
    dialog_close()
    let aDom = document.createElement('a')
    if('download' in aDom){
        aDom.type = 'download'
        aDom.href = url
        aDom.download = `${data.filename}`
        aDom.target="_blank"
        aDom.click()
    }
}

async function delete_file(){
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const deleteItem=fileStore.index("id")
        const deleteFile=deleteItem.getKey([props.file_object.id])

        deleteFile.onsuccess =()=>{
            const del = fileStore.delete(deleteFile.result);
            del.onsuccess =()=>{
                console.log("File deleted")
            };
            del.onerror=()=>{
                console.log("error",del.result)
            }
        };
        deleteFile.onerror=()=>{
            console.log("error",deleteFile.result)
        }
        props.fetchItems()
        dialog_close()
    } catch (error) {
        console.log(error)
        dialog_close()
    }
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

const uploadFile=async(file:File)=>{
    dialog_close()
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
            handleUpload(parseRes.id)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}
async function handleUpload(fieldId:string) {
    try {
        let file_body={
            email:userdata.email,
            filename:props.file_object.filename,
            username:userdata.username,
            uploadedAt:props.file_object.uploadedAt,
            size:props.file_object.size,
            file:fieldId,
            type:props.file_object.type,
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

async function download_upload(id:string,filename:string){
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
function open_delete_dialog(filename:string){
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    dialogElement.showModal()
    dialog_close()
    router.push(`?filename=${filename}`)
}
const open_file_menu_dialog=(filename:string)=>{
    dialog_close()
    const dialogElement=document.getElementById("filemenu-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
};
</script>
<template>
    <dialog id="file-dialog" @click="dialog_close" class="shadow-lg max-sm:min-h-[102vh] max-sm:min-w-[100vw] sm:rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] h-fit scale-[0.9]">
        <div class="flex flex-col">
            <button  class="ml-[auto] max-sm:py-2 px-5 py-2 outline-none" @click="dialog_close">
                <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
            </button>
            <div v-if="route.fullPath.includes('/home')" @click="open(convert(props.file_object.file))" class="bg-gray-100 cursor-pointer">
                <img :src="music" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('audio')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="pdf" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('pdf')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="doc" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('doc')||file.type.includes('odt')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="sheet" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('sheet')||props.file_object.type.includes('csv')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="zip" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('zip')||!props.file_object.type" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="video" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('video')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="convert(props.file_object.file)" :alt="props.file_object.filename" :title="props.file_object.filename" class="w-full object-cover h-[250px] max-md:h-[190px]"  v-if="props.file_object.type.includes('image')">
                <img :src="text" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/plain')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="html" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/html')" class="w-full object-contain h-[200px] max-md:h-[190px]">
            </div>
            <div v-else @click="open(`https://drive.google.com/uc?id=${props.file_object.file}`)" class="bg-gray-100 cursor-pointer">
                <img :src="music" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('audio')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="pdf" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('pdf')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="doc" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('doc')||file.type.includes('odt')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="sheet" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('sheet')||props.file_object.type.includes('csv')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="zip" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('zip')||!props.file_object.type" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="video" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('video')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img v-lazy="{ src: `https://drive.google.com/uc?id=${props.file_object.file}`, loading: Image, error: Image }" :alt="props.file_object.filename" :title="props.file_object.filename" class="w-full object-cover h-[250px] max-md:h-[190px]"  v-if="props.file_object.type.includes('image')">
                <img :src="text" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/plain')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="html" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/html')" class="w-full object-contain h-[200px] max-md:h-[190px]">
            </div>
        </div>

        <div class="px-10 max-sm:px-2 pt-2">
            <div class="mx-7 text-sm">
                <p class="font-bold text-base">{{props.file_object.filename}}</p>
                <div class="my-4 text-gray-900">
                    <p class="flex justify-between mt-1">Type<span class="text-gray-500">{{props.file_object.type}}</span></p>
                    <p class="flex justify-between">Date<span class="text-gray-500"  v-if="!route.fullPath.includes('/home')">{{props.file_object.uploadedat}}</span> <span v-else class="text-gray-500">{{props.file_object.uploadedAt}}</span></p>
                    <p class="flex justify-between">Size<span class="text-gray-500">{{convert_size(props.file_object.size)}}</span></p>
                    <p class="flex justify-between">Location<span class="text-gray-500" v-if="route.fullPath.includes('/home')">Browser</span><span class="text-gray-500" v-else-if="route.fullPath.includes('/group')">wekafile_{{props.file_object.groupname}}</span><span class="text-gray-500" v-else>wekafile_{{userdata.username}}</span></p>
                </div>
                <span class="flex flex-col my-5 sm:my-10">
                    <span class="font-semibold mr-1">Who has access</span>
                    <div class="mt-1 flex flex-col">
                        <div class="flex justify-between" >
                            <p class="text-gray-900">{{ props.file_object.email }}</p>
                            <p class="text-gray-500">Owner</p>
                        </div>
                        <div v-if="props.file_object.allowedemails!==null&&!route.fullPath.includes('/home')">
                            <div class="flex justify-between">
                                <p>{{ props.file_object.allowedemails[0] }}</p>
                                <p>Allowed</p>
                            </div>
                            <div class="flex justify-between" v-if="props.file_object.allowedemails.length>1">
                                <p>{{ props.file_object.allowedemails[1] }}</p>
                                <p>Allowed</p>
                            </div>
                            <div  class="flex mt-1 justify-between cursor-pointer " v-if="props.file_object.allowedemails.length>2">
                                <div class="bg-gray-200 text-black flex justify-center items-center h-[35px] w-[35px] rounded-[50px] text-sm">+ {{ props.file_object.allowedemails.length-2 }}</div>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        </div>
      
        <div class="grid grid-cols-3 mb-1 w-full text-sm">
            <button  title="View" v-if="route.fullPath.includes('/home')" @click="open(convert(props.file_object.file))" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center">
                <i class="icon pi pi-eye mr-1"></i> View
            </button>
            <button  title="View" v-else @click="open(`https://drive.google.com/uc?id=${props.file_object.file}`)" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center">
                <i class="icon pi pi-eye mr-1"></i> View
            </button>
            <button title="Upload" v-if="route.fullPath.includes('/home')&&userdata.access_token" @click="()=>uploadFile(props.file_object.file)" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-cloud-upload mr-1"></i> Upload
            </button>
            <RouterLink to="/provider" title="Upload" v-else-if="route.fullPath.includes('/home')&&userdata.access_token===null||!userdata.access_token" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-cloud-upload mr-1"></i> Upload
            </RouterLink>
            <button title="Share" v-if="route.fullPath.includes('/home')" @click="()=>share_file(props.file_object.filename,props.file_object.file)"  class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-share-alt mr-1"></i> Share
            </button> 
            <button title="Share" v-else @click="open_file_menu_dialog(props.file_object.filename)"  class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-share-alt mr-1"></i> Share
            </button> 
            <button  title="Download" v-if="route.fullPath.includes('/home')" @click="download_file(props.file_object,convert(props.file_object.file))" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-download mr-1"></i> Download
            </button>
            <button  title="Download" v-else @click="download_upload(`${props.file_object.file}`,`${props.file_object.filename}`)" class="hover:bg-slate-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-download mr-1"></i> Download
            </button>
            <button  title="Delete" @click="open_delete_dialog(props.file_object.filename)" class="hover:bg-red-200 w-full h-[40px] flex justify-center items-center" >
                <i class="icon pi pi-trash mr-1"></i> Delete
            </button>
        </div>
    </dialog>
</template>
