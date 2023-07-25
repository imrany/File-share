<script lang="ts" setup>
import { onMounted } from "vue"
import ConnectDialog from "../components/ui/Dialog/ConnectDialog.vue"
import { state } from "@/socket";

let peers=state.peers
function open_dialog(){
    const dialogElement=document.getElementById("connect-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
onMounted(()=>{
    if(!state.connected){
        open_dialog()
    }
})
function convert(image:any){
    let url =URL.createObjectURL(image)
    return url      
}
</script>

<template>
    <div class="flex flex-col mt-8" v-if="state.connected">
            <div class="grid grid-cols-4 gap-x-20">
                <div class="" v-for="(peer,index) in peers" :key="index">
                    <div class="flex items-center">
                        <img :src="convert(peer.photo)" class="w-[100px] mr-3 h-[100px] rounded-[90px]" alt="" v-if="peer.photo">
                        <i class="icon pi pi-user mr-3 text-xl bg-black text-white flex justify-center items-center w-12 h-12 rounded-[90px]" v-else></i>
                        <p class="">{{peer.id}}</p>
                    </div>
                </div>
        </div>
    </div>
    <ConnectDialog/>
</template>
