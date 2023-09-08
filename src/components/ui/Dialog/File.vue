<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import music from "@/assets/icons/music.png"
import sheet from "@/assets/icons/sheet.png"
import pdf from "@/assets/icons/pdf.png"
import zip from "@/assets/icons/zip.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { useRouter } from "vue-router"
import { inject } from "vue"
import { useToast } from "vue-toast-notification"
import { socket } from "@/socket"
import { loader } from "../../.."

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
        const url=`${origin}/upload/${userdata.email}`
        const formData=new FormData()
        formData.append("file",file)
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
            handleShare(parseRes.url)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}
async function handleShare(url:string) {
    let file_body={
        email:userdata.email,
        filename:props.file_object.filename,
        groupname:userdata.groupname,
        uploadedAt:props.file_object.uploadedAt,
        size:props.file_object.size,
        file:url,
        type:props.file_object.type,
        privacy:userdata.privacy
    }
    socket.emit('upload_to_sharedfiles',file_body,()=>{
    })
    socket.on('upload_response',(res:any)=>{
        if(res.error){
            toast.error(res.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
        }else{
            toast.success(res.msg,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
        }
    })
}
</script>
<template>
    <dialog id="file-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[90vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-2 max-sm:py-2">
       <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col justify-center items-center w-full my-4">
            <div class="flex flex-col justify-center items-center">
                <img :src="music" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('audio')" class="h-[160px] object-cover rounded-[20px]">
                <img :src="pdf" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('pdf')" class="h-[160px] object-cover rounded-[20px]">
                <img :src="sheet" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('sheet')||props.file_object.type.includes('csv')" class="h-[160px] object-cover rounded-[10px]">
                <img :src="zip" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('zip')||!props.file_object.type" class="h-[160px] object-cover  rounded-[20px]">
                <img :src="video" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('video')" class="h-[160px] object-cover  rounded-[20px]">
                <img :src="convert(props.file_object.file)" :alt="props.file_object.filename" :title="props.file_object.filename" class="w-[80%] h-[140px] rounded-[10px]"  v-if="props.file_object.type.includes('image')">
                <img :src="text" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/plain')" class="h-[160px] object-cover  rounded-[20px]">
                <img :src="html" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/html')" class="h-[160px] object-cover  rounded-[20px]">
                <div class="mx-7">
                    <div class="my-4 font-semibold">
                        <p class="text-base max-sm:text-sm text-gray-800">{{props.file_object.filename}}</p>
                        <p class="text-base max-sm:text-sm text-gray-500 mt-1">Type: {{props.file_object.type}}</p>
                        <p class="text-base max-sm:text-sm text-gray-500">Date: {{props.file_object.uploadedAt}}</p>
                        <p class="text-base max-sm:text-sm text-gray-500">Size: {{convert_size(props.file_object.size)}}</p>
                    </div>
                </div>
                <div class="flex">
                    <button @click="open(convert(props.file_object.file))" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3">
                        <i class="icon pi pi-eye text-base"></i> 
                    </button>

                    <button @click="()=>uploadFile(props.file_object.file)" v-if="!userdata.username" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-share-alt text-base"></i> 
                    </button>

                    <button @click="delete_file" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-trash text-base"></i> 
                    </button>

                     <button @click="download_file(props.file_object,convert(props.file_object.file))" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-download text-base"></i> 
                    </button>
                </div>
            </div>
        </div>
    </dialog>
</template>
