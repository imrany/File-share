<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { share_file } from "../index";

const router=useRouter()
const route=useRoute()
const title=route.query.filename
async function download_file(){
    try {
        const url=`https://drive.google.com/uc?id=${route.query.file}`
        const response=await fetch(url)
        const parseRes=await response.blob()
        let aDom = document.createElement('a') as HTMLAnchorElement
        if('download' in aDom){
            aDom.type = 'download'
            aDom.href =URL.createObjectURL(parseRes)
            aDom.download=`${route.query.filename}`
            aDom.target="_blank"
            aDom.click()
        } 
    } catch (error:any) {
        console.log(error.message)
    }
    
}

async function share(){
    try {
        const url=`https://drive.google.com/uc?id=${route.query.file}`
        const response=await fetch(url)
        const parseRes=await response.blob()
        let file=new File([parseRes],`${route.query.filename}`)
        share_file(`${route.query.filename}`,file) 
    } catch (error:any) {
        console.log(error.message)
    }
    
}

</script>

<template>
    <div class="flex flex-col bg-black min-h-[100vh] text-white">
        <div class="">
            <div class="flex pr-10 pl-5 max-md:pl-2 py-2 max-md:py-4 items-center">
                <i @click="router.back()" class="icon pi pi-arrow-left cursor-pointer text-lg mr-3"></i>
                <p class="text-base max-sm:text-sm">{{title}}</p>
            </div>
        </div>
        <div class="flex w-[100vw]">
            <div class="flex flex-col items-center w-[5vw] mt-8" id="storage-title">
                <div class="flex items-center justify-center hover:rounded-md transition-all rounded-[50px] bg-white h-8 w-8 text-black">
                    <i title="Close" @click="router.back()" class="icon pi pi-times cursor-pointer text-sm p-5"></i>
                </div>
                <div class="my-4 flex items-center justify-center hover:rounded-md transition-all rounded-[50px] bg-white h-8 w-8 text-black">
                    <i title="Download" @click="()=>download_file()" class="icon pi pi-download cursor-pointer text-sm p-5"></i>
                </div>
                <div class="flex items-center justify-center hover:rounded-md transition-all rounded-[50px] bg-white h-8 w-8 text-black">
                    <i title="Share" @click="()=>share()" class="icon pi pi-share-alt cursor-pointer text-sm p-5"></i>
                </div>
            </div>
            
            <div class="flex items-center justify-center flex-grow">
                 <object :data="`https://drive.google.com/uc?id=${route.query.file}&sz=w{10}-h{10}`" type="" class="object-contain w-full max-sm:w-[100vw] h-[93vh]"></object>
            </div>
        </div>
     </div>
</template>
