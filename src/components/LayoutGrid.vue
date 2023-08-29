<script setup lang="ts">
import { inject, onMounted, ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
import indexedDB from "../indexedDB"
import { state } from "@/socket";

const userdata:any=inject("userdata")
const router=useRouter()
const fileCount=ref(0)
const status:any=ref({
  bool:true,
  message:""
})
const peerCount=ref(0)
const route=useRoute()
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
    status.value.message="No internet connection"
  }
}

</script>

<template>
  <div class="flex min-h-[100vh]">
    <div v-if="userdata" class="md:w-[15%] fixed top-0 bottom-0 shadow-sm left-0 px-4 py-5 text-gray-500" id="sideshow">
      <RouterLink to="/" class="font-bold text-2xl pr-8 pl-3 text-[#e9972c]">
        Fileshare
      </RouterLink>
      <div class="flex flex-col w-full mt-8">
        <div class="flex flex-col">
          <RouterLink to="/home" class="my-2 rounded-[10px] hover:bg-[#fd9104] hover:text-white">
            <div class="px-6 py-2 text-white rounded-[10px] bg-[#fd9104]" v-if="route.fullPath==='/home'">
              <i class="icon pi pi-folder-open mr-2"></i>
              <span>My Uploads</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
            <div class="px-6 py-2"  v-else>
              <i class="icon pi pi-folder mr-2"></i>
              <span>My Uploads</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
          </RouterLink>

          <RouterLink to="/storage" class="cursor-pointer my-2 rounded-[10px] hover:bg-[#fd9104] hover:text-white">
            <div class="text-white rounded-[10px] px-6 bg-[#fd9104] py-2" v-if="route.fullPath==='/storage'">
              <i class="icon pi pi-cloud mr-2"></i>
              <span>Storage</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-cloud mr-2"></i>
              <span>Storage</span>
            </div>
          </RouterLink>

          <RouterLink v-if="userdata.groupname" to="/peers" class="my-2 rounded-[10px] hover:bg-[#fd9104] hover:text-white">
            <div class="text-white rounded-[10px] px-6 bg-[#fd9104] py-2" v-if="route.fullPath==='/peers'">
              <i class="icon pi pi-users mr-2"></i>
              <span>Peers</span><br/>
              <small v-if="state.connected===null">Connect with your peers</small>
              <small v-else>{{peerCount}} peers are current available</small>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-users mr-2"></i>
              <span>Peers</span><br/>
              <small v-if="state.connected===null">Connect with your peers</small>
              <small v-else>{{peerCount}} peers are current available</small>
            </div>
          </RouterLink>

          <RouterLink to="/shared"  v-if="userdata.groupname" class="my-2 rounded-[10px] hover:bg-[#fd9104] hover:text-white">
            <div class="text-white rounded-[10px] px-6 bg-[#fd9104] py-2" v-if="route.fullPath.includes('/shared')">
              <i class="icon pi pi-briefcase mr-2"></i>
              <span>Shared Files</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-briefcase mr-2"></i>
              <span>Shared Files</span>
            </div>
          </RouterLink>

          <div @click="router.push(`/users?email=${userdata.email}`)" class="my-2 cursor-pointer rounded-[10px] hover:bg-[#fd9104] hover:text-white">
            <div class="text-white rounded-[10px] px-6 bg-[#fd9104] py-2" v-if="route.fullPath===`/users?email=${userdata.email}`">
              <i class="icon pi pi-cog mr-2"></i>
              <span>Settings</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-cog mr-2"></i>
              <span>Settings</span>
            </div>
          </div>

          <div class="fixed bottom-4"  v-if="!userdata.groupname">
            <button class="hover:shadow-md text-sm w-[150px] my-5 flex justify-center items-center h-[40px] bg-[#fdab3f] text-white rounded-[10px]">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
    <div :class="userdata?'xl:ml-[15%] xl:w-[85%]':'xl:w-[100%]'" class="bg-gray-50" id="panel">
      <div class='preload'></div>
      <div class="bg-black text-white" v-if="status.bool==false">
        <div class="flex justify-center items-center h-3 text-xs sm:text-sm  py-2">
          <p>{{status.message}}</p>
        </div>
      </div>
      <slot name="grid-2"></slot>
    </div>
  </div>
</template>