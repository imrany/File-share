<script setup lang="ts">
import { useRoute } from "vue-router";

const props=defineProps<{
    file:any
}>()

const route=useRoute()
const dialog_close=()=>{
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
                    <p class="flex flex-col text-sm text-slate-600">
                        <span><span class="font-semibold mr-1">File name:</span> {{ file.filename }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1">Type:</span> {{ file.type }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1">Size:</span> {{ convert_size(file.size) }}</span>
                        <span class="mt-2" v-if="route.fullPath.includes('/group')"><span class="font-semibold mr-1">Shared by:</span> {{ file.email }}</span>
                        <span class="mt-2"><span class="font-semibold mr-1">Uploaded on:</span> {{ file.uploadedat }}</span>
                    </p>
                </div>
            </div>
        </div>
    </dialog>
</template>
