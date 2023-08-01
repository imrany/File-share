<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import music from "@/assets/icons/music.png"
import pdf from "@/assets/icons/pdf.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"
import { useRouter } from "vue-router"
const props=defineProps<{
    file_object:any
}>()

const router=useRouter()
let file:any=[]

const dialog_close=()=>{
    const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
    dialogElement.close()
    router.push("/")
}

function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}
file.push(props.file_object)

</script>
<template>
    <dialog id="file-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
       <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full" v-for="(file,index) in file" :key="index">
            <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
            <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
            <img :src="video" :alt="file.filename" :title="file.filename" v-if="file.type.includes('video')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
            <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
            <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
            <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
            <div class="">
                <div class="mx-4 my-4 font-semibold">
                    <p class="text-sm">{{file.filename.slice(0,20)}}</p>
                    <p class="text-xs text-gray-500 mt-2">5/07/2023 4:30pm</p>
                </div>
            </div>
        </div>
    </dialog>
</template>
