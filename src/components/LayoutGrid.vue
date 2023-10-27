<script setup lang="ts">
import { inject, onMounted, ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import indexedDB from "../indexedDB"

const userdata:any=inject("userdata")
const router=useRouter()
const fileCount=ref(0)
const status:any=ref({
  bool:true,
  message:""
})
const route=useRoute()
async function fetchFileCount(){
  try {
    const request=await indexedDB()
    const db:any=await request
    const transaction=db.transaction("All_files","readwrite")
    const fileStore=transaction.objectStore("All_files")
    const fileEmail=fileStore.index("email")
    const fileEmailKey = fileEmail.getAll([`${userdata.email}`]);
    fileEmailKey.onsuccess=()=>{
      fileCount.value=fileEmailKey.result.length
    }
    fileEmailKey.onerror=()=>{
      console.log("error",fileEmailKey.result)
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

function getStatus(){
  if(!navigator.onLine){
    status.value.bool=false
    status.value.message="No internet connection"
  }
}

let token=userdata.access_token?JSON.parse(userdata.access_token):null
</script>

<template>
  <div class="flex min-h-[100vh]">
    <div v-if="userdata" class="md:w-[15%] fixed bg-gray-100 top-0 bottom-0 shadow-sm left-0 px-2 pt-[8px] pb-5 text-gray-600" id="sideshow">
      <RouterLink to="/" class="font-bold text-xl pr-8 pl-3 text-[#e9972c]">
        Wekafile
      </RouterLink>
      <div class="flex flex-col w-full mt-4">
        <div class="flex flex-col">
          <RouterLink to="/home" class="rounded-[5px] hover:bg-gray-300 ">
            <div class="px-6 py-2 text-gray-700 rounded-[5px] bg-gray-300 transition-all" v-if="route.fullPath.includes('/home')">
              <i class="icon pi pi-folder-open mr-2"></i>
              <span>My files</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
            <div class="px-6 py-2 text-gray-500 hover:text-gray-700"  v-else>
              <i class="icon pi pi-folder mr-2"></i>
              <span>My files</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </div>
          </RouterLink>

          <RouterLink :to="userdata.access_token?'/uploads':'/provider'" class="cursor-pointer my-1 rounded-[5px] hover:bg-gray-300">
            <div class="text-gray-700 rounded-[5px] px-6 bg-gray-300 py-2 transition-all" v-if="route.fullPath.includes('/uploads')">
              <i class="icon pi pi-cloud-upload mr-2"></i>
              <span>My uploads</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-cloud-upload mr-2"></i>
              <span>My uploads</span>
            </div>
          </RouterLink>

          <RouterLink to="/storage" class="cursor-pointer rounded-[5px] hover:bg-gray-300 hover:text-gray-700">
            <div class="text-gray-700 rounded-[5px] px-6 bg-gray-300 py-2 transition-all" v-if="route.fullPath==='/storage'">
              <i class="icon pi pi-th-large mr-2"></i>
              <span>Storage</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-th-large mr-2"></i>
              <span>Storage</span>
            </div>
          </RouterLink>

          <RouterLink to="/shared" class="my-1 rounded-[5px] hover:bg-gray-300 hover:text-gray-700">
            <div class="text-gray-700 rounded-[5px] px-6 bg-gray-300 py-2 transition-all" v-if="route.fullPath.includes('/shared')">
              <i class="icon pi pi-briefcase mr-2"></i>
              <span>Shared files</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-briefcase mr-2"></i>
              <span>Shared files</span>
            </div>
          </RouterLink>

          <div @click="router.push(`/users?email=${userdata.email}`)" class="cursor-pointer rounded-[5px] hover:bg-gray-300 hover:text-gray-700">
            <div class="text-gray-700 rounded-[5px] px-6 bg-gray-300 py-2 transition-all" v-if="route.fullPath===`/users?email=${userdata.email}`">
              <i class="icon pi pi-cog mr-2"></i>
              <span>Settings</span>
            </div>
            <div class="px-6 py-2" v-else>
              <i class="icon pi pi-cog mr-2"></i>
              <span>Settings</span>
            </div>
          </div>

          <div class="fixed bottom-4">
            <button v-if="!token||token===null" @click="router.push('/provider')" class="hover:shadow-md font-semibold text-sm w-[150px] my-5 flex justify-center items-center h-[40px] text-white bg-gray-600 rounded-[20px]">
              Cloud storage
            </button>
            <button  v-else-if="!token.refresh_token||token.refresh_token===null" @click="router.push('/provider')" class="hover:shadow-md font-semibold text-sm w-[150px] my-5 flex justify-center items-center h-[40px] text-white bg-gray-600 rounded-[20px]">
              Refresh token 
            </button>
          </div>
        </div>
      </div>
    </div>
    <div :class="userdata?'xl:ml-[15%] xl:w-[85%]':'xl:w-[100%]'" class="bg-white" id="panel">
      <div class='preload'></div>
      <div class="bg-gray-800 text-white" v-if="status.bool==false">
        <div class="flex justify-center items-center h-3 text-xs sm:text-sm  py-2">
          <p>{{status.message}}</p>
        </div>
      </div>
      <slot name="grid-2"></slot>
    </div>
  </div>
</template>
