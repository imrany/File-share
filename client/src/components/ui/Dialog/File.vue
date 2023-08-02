<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import music from "@/assets/icons/music.png"
import pdf from "@/assets/icons/pdf.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { useRouter } from "vue-router"

type file={
    file: any, 
    uploadedAt: string, 
    filename: string, 
    size: number, 
    type: string, 
    sharedTo: string
}
const props=defineProps<{
    file_object:file
}>()

const router=useRouter()

const dialog_close=()=>{
    const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
    dialogElement.close()
    router.push("/")
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
        const deleteItem=fileStore.index("filename")
        const deleteFile=deleteItem.getKey([props.file_object.filename])

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
        window.location.reload()
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
</script>
<template>
    <dialog id="file-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-5 max-sm:py-5">
       <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col justify-center items-center w-full my-4">
            <div class="flex flex-col justify-center items-center">
                <img :src="music" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('audio')" class="w-[50%] max-sm:w-[70%] h-[160px] rounded-[20px]">
                <img :src="pdf" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('pdf')" class="w-[50%] max-sm:w-[70%] h-[160px] rounded-[20px]">
                <img :src="video" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('video')" class="w-[50%] max-sm:w-[70%] h-[160px] rounded-[20px]">
                <img :src="convert(props.file_object.file)" :alt="props.file_object.filename" :title="props.file_object.filename" class="w-[80%] h-[160px] rounded-[20px]"  v-if="props.file_object.type.includes('image')">
                <img :src="text" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/plain')" class="w-[50%] max-sm:w-[70%] h-[160px] rounded-[20px]">
                <img :src="html" :alt="props.file_object.filename" :title="props.file_object.filename" v-if="props.file_object.type.includes('text/html')" class="w-[50%] max-sm:w-[70%] h-[160px] rounded-[20px]">
                <div class="mx-6">
                    <div class="mx-4 my-4 font-semibold">
                        <p class="text-base max-sm:text-sm text-gray-800">{{props.file_object.filename}}</p>
                        <p class="text-base max-sm:text-sm text-gray-500 mt-1">Type: {{props.file_object.type}}</p>
                        <p class="text-base max-sm:text-sm text-gray-500">Date: 5/07/2023 4:30pm</p>
                        <p class="text-base max-sm:text-sm text-gray-500">Size: {{convert_size(props.file_object.size)}}</p>
                    </div>
                </div>
                <div class="flex">
                    <button @click="open(convert(props.file_object.file))" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3">
                        <i class="icon pi pi-eye text-base"></i> 
                    </button>

                    <button class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-star text-base"></i> 
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
