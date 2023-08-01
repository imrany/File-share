<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import indexedDB from "../indexedDB"
import music from "@/assets/icons/music.png"
import pdf from "@/assets/icons/pdf.png"
import video from "@/assets/icons/video.png"
import text from "@/assets/icons/txt.png"
import html from "@/assets/icons/html.png"

const route=useRoute()
let file:any=ref([])

let result=[]
async function fetchFile(){
    try {
        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const singleFile=fileStore.index("filename")
        const getFile=singleFile.get([route.params.filename])

        getFile.onsuccess=()=>{
            result.push(getFile.result)
            file.value=result
            console.log(file.value)
        }
        getFile.onerror=()=>{
            console.log("error",getFile.result)
        }
    } catch (error) {
            console.log(error)
    }
}
function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}
onMounted(()=>{
    fetchFile()
})
</script>
<template>
    <div class="flex flex-col px-8 pt-6">
       <div class="grid grid-cols-5 gap-y-4 my-4">
            <div class="cursor-pointer rounded-[20px] mx-2 border hover:border-purple-800 bg-white h-fit w-[200px]" v-for="(file,id) in file" :key="id" :title="file.filename">
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
        </div>
    </div>
</template>
