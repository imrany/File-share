<script lang="ts" setup>
import pdf from "@/assets/icons/pdf.png"
import music from "@/assets/icons/music.png"
import video from "@/assets/icons/video.png"
import html from "@/assets/icons/html.png"
import text from "@/assets/icons/txt.png"
import { useRouter } from "vue-router"

 defineProps<{
    title: string
    files:any[]
 }>()

const router=useRouter()
function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}
function open_delete_dialog(filename:string){
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    router.push(`?filename=${filename}`)
    dialogElement.showModal()
}

</script>

<template>
    <div class="mt-10 text-lg max-lg:mb-10">
        All Files / <span class="text-gray-500">{{title}}</span>
        <table class="mt-5  w-full text-sm" id="file-table">
            <tr class="text-gray-500 border-collapse">
                <th class="font-normal text-left">
                    Name
                </th>

                <th class="font-normal text-left w-[150px]">
                    | Type
                </th>

                <th class="font-normal text-left w-[150px]">
                    | Shared
                </th>

                <th class="font-normal text-left">
                    | Date of change
                </th>
            </tr>

            <tr v-for="(file, index) in files" :key="index">
                <td>
                    <a :href="convert(file.file)" target="_blank" rel="noopener noreferrer" class="flex items-center">
                        <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                        <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                        <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('image')">
                        <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                        <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                        <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                        <p class="ml-1 font-semibold">{{file.filename}}</p>
                    </a>
                </td>
                <td>
                    <p class="font-semibold">{{file.type}}</p>
                </td>
                <td>
                    <p class="font-semibold">
                        <span v-if="file.sharedTo=='Just you'">
                            {{file.sharedTo}}
                        </span>
                        <span v-else>
                            <i class="icon pi pi-users mr-3"></i>
                            {{file.sharedTo}}
                        </span>
                    </p>
                </td>

                <td>
                    <p class="font-semibold">{{file.uploadedAt}}</p>
                </td>
                <td>
                    <i @click="()=>open_delete_dialog(file.filename)" class="icon pi pi-trash cursor-pointer mr-3"></i>
                </td>
            </tr>
        </table>

        <div class="grid grid-cols-1 gap-y-3 my-4" id="file-tabs">
            <div class="flex justify-between bg-gray-100 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                <div class="flex">
                    <a :href="convert(file.file)" target="_blank" rel="noopener noreferrer" class="flex items-center">
                        <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                        <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                        <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                        <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                        <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                        <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                    </a>
                    <div class="flex flex-col">
                        <p class="text-sm">
                            {{file.filename.slice(0,25)}} 
                        </p>
                        <p class="text-sm" id="type">{{file.type}}</p>
                    </div>
                </div>
                <div class="mt-2">
                    <i @click="()=>open_delete_dialog(file.filename)" class="icon pi pi-trash max-sm:text-sm"></i>
                </div>
            </div>
        </div>
    </div>
</template>