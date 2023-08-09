<script setup lang="ts">
import { onMounted, ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
import indexedDB from "../indexedDB"
import { state } from "@/socket";

const fileCount=ref(0)
const status:any=ref({
  bool:true,
  message:""
})
const peerCount=ref(0)
const route=useRoute()
const router=useRouter()
async function fetchFileCount(){
  try {
    const request=await indexedDB()
    const db:any=await request
    const transaction=db.transaction("All_files","readwrite")
    const fileStore=transaction.objectStore("All_files")
    const getFiles=fileStore.getAll()

    getFiles.onsuccess=()=>{
      fileCount.value=getFiles.result.length
    }
    getFiles.onerror=()=>{
      console.log("error",getFiles.result)
    }
  } catch (error) {
    alert(error)
  }
}
const fetchPeerCount=async()=>{
  const request=await indexedDB()
  const db:any=await request
  const transaction=db.transaction("peers","readwrite")
  const peersStore=transaction.objectStore("peers")
  const getPeers=peersStore.getAll()

  getPeers.onsuccess=()=>{
      peerCount.value=getPeers.result.length
  }
  getPeers.onerror=()=>{
      console.log("error",getPeers.result)
  }
}

onMounted(()=>{
  fetchFileCount()
  fetchPeerCount()
  getStatus()
})

if(state.connected==="true"){
  peerCount.value=0
}

const view_license=()=>{
    let aDom = document.createElement('a')
    if(aDom){
        aDom.target="_blank"
        aDom.href = '/LICENSE'
        aDom.click()
    }
}

function getStatus(){
  if(!navigator.onLine){
    status.value.bool=false
    status.value.message="No internet"
  }
}
</script>

<template>
  <div class="flex min-h-[100vh]">
    <div class="md:w-[15%] px-4 py-4  bg-black text-white" id="sideshow">
      <RouterLink to="/" class="font-semibold text-xl px-8">Fileshare</RouterLink>
      <div class="flex flex-col w-full mt-10">
        <div class="flex flex-col">
          <RouterLink to="/" class="my-2 rounded-[10px] hover:bg-purple-800 hover:text-white">
            <div class="px-6 py-2 hover:text-white rounded-[10px] bg-purple-800" v-if="route.fullPath==='/'">
              <i class="icon pi pi-folder-open mr-3"  ></i>
              <span>All Files</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
            <div class="px-6 py-2"  v-else>
              <i class="icon pi pi-folder mr-3"></i>
              <span>All Files</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
          </RouterLink>

          <RouterLink to="/storage" class="cursor-pointer my-2 rounded-[10px] hover:bg-purple-800 hover:text-white">
            <div class="hover:text-white rounded-[10px] px-6 bg-purple-800 py-2" v-if="route.fullPath==='/storage'">
              <i class="icon pi pi-th-large mr-3"></i>
              <span>Storage</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-th-large mr-3"></i>
              <span>Storage</span>
            </div>
          </RouterLink>

          <RouterLink to="/peers" class="my-2 rounded-[10px] hover:bg-purple-800 hover:text-white">
            <div class="hover:text-white rounded-[10px] px-6 bg-purple-800 py-2" v-if="route.fullPath==='/peers'">
              <i class="icon pi pi-globe mr-3"></i>
              <span>Peers</span><br/>
              <small v-if="state.connected===null">Connect with your peers</small>
              <small v-else>{{peerCount}} peers are current available</small>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-globe mr-3"></i>
              <span>Peers</span><br/>
              <small v-if="state.connected===null">Connect with your peers</small>
              <small v-else>{{peerCount}} peers are current available</small>
            </div>
          </RouterLink>

          <RouterLink to="/guide" class="cursor-pointer my-2 rounded-[10px] hover:bg-purple-800 hover:text-white">
            <div class="hover:text-white rounded-[10px] px-6 bg-purple-800 py-2" v-if="route.fullPath==='/guide'">
              <i class="icon pi pi-clone mr-3"></i>
              <span>Guide</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-clone mr-3"></i>
              <span>Guide</span>
            </div>
          </RouterLink>

          <div @click="view_license" class="cursor-pointer my-2 rounded-[10px] hover:bg-purple-800 hover:text-white">
            <div class="hover:text-white rounded-[10px] px-6 hover:bg-purple-800 py-2">
              <i class="icon pi pi-lock mr-3"></i>
              <span>LICENSE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md:w-[85%] bg-gray-100" id="panel">
      <div class="bg-purple-500 text-white" v-if="status.bool==false">
        <div class="flex justify-center items-center h-3 text-sm font-semibold py-2">
          <p>{{status.message}}</p>
        </div>
      </div>
      <slot name="grid-2"></slot>
    </div>
  </div>
</template>