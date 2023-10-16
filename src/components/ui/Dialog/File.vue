<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import music from "@/assets/icons/music.png"
import sheet from "@/assets/icons/sheet.png"
import pdf from "@/assets/icons/pdf.png"
import zip from "@/assets/icons/zip.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { useRouter,useRoute } from "vue-router"
import { inject } from "vue"
import { useToast } from "vue-toast-notification"
import { socket } from "@/socket"
import { loader, share_file } from "../../.."

type file={
    file: any, 
    uploadedAt: string, 
    filename: string, 
    size: number, 
    type: string,
    id:string
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
    router.push("/home")
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
</script>
<template>
    <dialog id="file-dialog" class="shadow-lg max-sm:min-h-[102vh] max-sm:min-w-[100vw] sm:rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] h-fit scale-[0.9]">
        <div class="flex flex-col max-sm:py-2">
            <button  class="ml-[auto] px-5 py-2 outline-none" @click="dialog_close">
                <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
            </button>
            <div class="bg-gray-100">
                <img :src="music" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('audio')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="pdf" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('pdf')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="sheet" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('sheet')||props.file_object.type.includes('csv')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="zip" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('zip')||!props.file_object.type" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="video" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('video')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="convert(props.file_object.file)" :alt="props.file_object.filename" :title="props.file_object.filename" class="w-full object-cover h-[250px] max-md:h-[190px]"  v-if="props.file_object.type.includes('image')">
                <img :src="text" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/plain')" class="w-full object-contain h-[200px] max-md:h-[190px]">
                <img :src="html" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/html')" class="w-full object-contain h-[200px] max-md:h-[190px]">
            </div>
        </div>

        <div class="px-10 max-sm:px-2 py-2">
            <div class="mx-7 max-sm:text-sm">
                <p class="font-bold">{{props.file_object.filename}}</p>
                <div class="my-4 text-gray-900">
                    <p class="flex justify-between mt-1">Type<span class="text-gray-500">{{props.file_object.type}}</span></p>
                    <p class="flex justify-between">Date<span class="text-gray-500">{{props.file_object.uploadedAt}}</span></p>
                    <p class="flex justify-between">Size<span class="text-gray-500">{{convert_size(props.file_object.size)}}</span></p>
                </div>
            </div>
        </div>
      
        <div class="flex flex-col justify-center items-center w-full my-4">
            <div class="flex flex-col justify-center items-center text-sm">
               
                <div class="flex">
                    <button  title="View" @click="open(convert(props.file_object.file))" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3">
                        <i class="icon pi pi-eye "></i> 
                    </button>

                    <button title="Upload" @click="()=>uploadFile(props.file_object.file)" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-cloud-upload "></i> 
                    </button>

                    <button title="Share" @click="()=>share_file(props.file_object.filename,props.file_object.file)"  class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-share-alt "></i> 
                    </button> 

                    <button  title="Delete" @click="delete_file" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-trash "></i> 
                    </button>

                     <button  title="Download" @click="download_file(props.file_object,convert(props.file_object.file))" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-download "></i> 
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>
