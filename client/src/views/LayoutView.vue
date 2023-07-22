<script setup lang="ts">
import { onMounted, ref } from "vue"
import { RouterLink } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
import indexedDB from "../indexedDB"

const fileCount=ref(0)
const capacity=ref("")
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

function storage(){
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(({usage, quota}) => {
      let kbs=(x:number)=>x/1000
      let mbs=(x:number)=>x/1000000
      let gbs=(x:number)=>x/1000000000
      if(usage<1000){
        capacity.value=`${usage} bytes of ${Math.round(gbs(quota))} GB used.`;
      }else if(usage<1000000){
        capacity.value=`${Math.round(kbs(usage))} KB of ${Math.round(gbs(quota))} GB used.`;
      }else if(usage<1000000000){
        capacity.value=`${Math.round(mbs(usage))} MB of ${Math.round(gbs(quota))} GB used.`;
      }else if(usage>1000000000){
        capacity.value=`${Math.round(gbs(usage))} GB of ${Math.round(gbs(quota))} GB used.`;
      }
    });
  }
} 
onMounted(()=>{
  fetchFileCount()
  storage()
})
</script>

<template>
  <main>
    <LayoutGrid>
      <template #grid-1>
        <RouterLink to="/" class="font-semibold text-xl px-8">Fileshare</RouterLink>
        <div class="flex flex-col text-[#808080] w-full">
          <div class="flex flex-col">
            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-black hover:text-white">
              <i class="icon pi pi-folder mr-3"></i>
              <span>All Files</span>
              <sup class="ml-1">{{fileCount}}</sup>
            </RouterLink>

            <RouterLink to="/" class="px-6 my-2 py-2 rounded-[8px] hover:bg-black hover:text-white">
              <i class="icon pi pi-users mr-3"></i>
              <span>Users</span>
            </RouterLink>

             <RouterLink to="/storage" class="cursor-pointer px-6 my-2 py-2 rounded-[8px] hover:bg-black hover:text-white">
              <i class="icon pi pi-th-large mr-3"></i>
              <span>Storage</span><br/>
              <small>{{capacity}}</small>
            </RouterLink>
          </div>
        </div>
      </template>

      <template #grid-2></template>
    </LayoutGrid>
  </main>
</template>
