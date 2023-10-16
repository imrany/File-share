<script setup lang="ts">
import Image from "@/assets/icons/image-icon.png"
import { ref } from "vue";
import { useRoute } from "vue-router";

const props=defineProps<{
    file:any
}>()

const initial=ref(true)
const route=useRoute()
const dialog_close=()=>{
    initial.value=true
    const dialogElement=document.getElementById("file-properties-dialog") as HTMLDialogElement
    dialogElement.close()
};

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

const closeInitial=()=>{
    initial.value=false
}
</script>
<template>
    <dialog id="file-properties-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-sm:w-[90vw]  max-md:w-[80vw] h-fit text-[#808080] scale-[0.9] py-10">
        <button  class="ml-[auto] px-10 max-sm:px-5 outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <div class="px-8 max-sm:pl-3 max-sm:pr-1 cursor-pointer">
                <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                    <!-- <i class="icon pi pi-file text-sm mr-3"></i> -->
                    <p class="flex flex-col text-sm text-slate-600" v-if="initial">
                        <span><span class="font-semibold mr-1">File name:</span> {{ file.filename }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1">Type:</span> {{ file.type }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1">Size:</span> {{ convert_size(file.size) }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1" v-if="!route.fullPath.includes('/home')">Uploaded on:</span><span class="font-semibold mr-1" v-else>Added on:</span> <span  v-if="!route.fullPath.includes('/home')">{{ file.uploadedat }}</span><span v-else>{{ file.uploadedAt }}</span></span> 
                        <span class="mt-2 flex flex-col">
                            <span class="font-semibold mr-1">Who has access</span>
                            <div class="mt-1 flex flex-col">
                                <div class="flex justify-between" >
                                    <p>{{ file.email }}</p>
                                    <p>Owner</p>
                                </div>
                                <div v-if="file.allowedemails!==null&&!route.fullPath.includes('/home')">
                                    <div class="flex justify-between">
                                        <p>{{ file.allowedemails[0] }}</p>
                                        <p>Allowed</p>
                                    </div>
                                    <div class="flex justify-between" v-if="file.allowedemails.length>1">
                                        <p>{{ file.allowedemails[1] }}</p>
                                        <p>Allowed</p>
                                    </div>
                                    <div @click="closeInitial" class="flex mt-1 justify-between cursor-pointer " v-if="file.allowedemails.length>2">
                                        <div class="bg-gray-200 text-black flex justify-center items-center h-[35px] w-[35px] rounded-[50px] text-sm">+ {{ file.allowedemails.length-2 }}</div>
                                    </div>
                                </div>
                            </div>
                        </span>
                    </p>

                    <p class="flex flex-col w-full text-sm text-slate-600" v-if="!initial&&!route.fullPath.includes('/home')">
                        <span class="mt-2 flex flex-col">
                            <span class="font-semibold mr-1">Who has access</span>
                            <div class="mt-1 flex flex-col">
                                <div class="flex justify-between">
                                    <p>{{ file.email }}</p>
                                    <p>Owner</p>
                                </div>
                                <div class="flex justify-between" v-for="(item,index) in file.allowedemails" :key="index">
                                    <p>{{ item }}</p>
                                    <p>Allowed</p>
                                </div>
                            </div>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>
