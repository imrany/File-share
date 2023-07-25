<script lang="ts" setup>
import { onMounted, ref } from "vue"
import ConnectDialog from "../components/ui/Dialog/ConnectDialog.vue"
import indexedDB from"../indexedDB";
import { state } from "@/socket";

let peers=ref([])
function open_dialog(){
    const dialogElement=document.getElementById("connect-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
onMounted(()=>{
    if(!state.connected){
        open_dialog()
    }else{
        fetchPeers()
    }
})

const fetchPeers=async()=>{
    const request=await indexedDB()
    const db:any=await request
    const transaction=db.transaction("peers","readwrite")
    const peersStore=transaction.objectStore("peers")
    const getPeers=peersStore.getAll()

    getPeers.onsuccess=()=>{
        peers.value=getPeers.result
    }
    getPeers.onerror=()=>{
        console.log(getPeers.result)
        open_dialog()
    }
}

function convert(image:any){
    let blob1 = new Blob([new Uint8Array(image)],{type:`image/png`}) 
    let url =URL.createObjectURL(blob1)
    return url      
}
</script>

<template>
    <div class="flex flex-col mt-8" v-if="state.connected">
            <div class="grid grid-cols-4 gap-x-20">
                <div class="" v-for="peer in peers" :key="peer.userid">
                    <div class="flex items-center">
                        <img :src="convert(peer.photo)" :alt="peer.photo" class="w-[100px] mr-3 h-[100px] rounded-[90px]" alt="" v-if="peer.photo">
                        <i class="icon pi pi-user mr-3 text-xl bg-black text-white flex justify-center items-center w-12 h-12 rounded-[90px]" v-else></i>
                        <p class="">{{peer.userid}}</p>
                    </div>
                </div>
        </div>
    </div>
    <ConnectDialog/>
</template>
