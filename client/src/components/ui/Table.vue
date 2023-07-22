<script lang="ts" setup>
import pdf from "@/assets/icons/pdf.png"
import music from "@/assets/icons/music.png"
import video from "@/assets/icons/video.png"

 defineProps<{
    title: string
    files:any[]
 }>()

function convert(file:any){
    let url =URL.createObjectURL(file)
    return url      
}
</script>

<template>
    <div class="mt-10 text-lg">
        All Files / <span class="text-gray-500">{{title}}</span>
        <table class="mt-5  w-full text-sm">
            <tr class="text-gray-500 border-collapse">
                <th class="font-normal text-left">
                    Name
                </th>

                <th class="font-normal text-left">
                    | Type
                </th>

                <th class="font-normal text-left">
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
            </tr>
        </table>
    </div>
</template>