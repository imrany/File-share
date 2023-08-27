<script lang="ts" setup>
import { onMounted, ref } from "vue";
import ClearDialog from "../components/ui/Dialog/ClearStorage.vue"
import LayoutGrid from "../components/LayoutGrid.vue"
import { useRouter } from "vue-router";
import MobileNav from "../components/ui/MobileNav.vue";

const title="Storage"
const router=useRouter()
const capacity=ref("")
const use=ref(0)
const total=ref(0)
const use_percent=ref(0)

function storage(){
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then((data:any) => {
        let kbs=(x:number)=>x/1000
        let mbs=(x:number)=>x/1000000
        let gbs=(x:number)=>x/1000000000
        if(data.usage<1000){
            capacity.value=`${data.usage} bytes of ${Math.round(gbs(data.quota))} GB used.`;
            use.value=Math.round(mbs(data.usage))
            total.value=Math.round(mbs(data.quota))
            use_percent.value=100*use.value/total.value
        }else if(data.usage<1000000){
            capacity.value=`${Math.round(kbs(data.usage))} KB of ${Math.round(gbs(data.quota))} GB used.`;
            use.value=Math.round(mbs(data.usage))
            total.value=Math.round(mbs(data.quota))
            use_percent.value=100*use.value/total.value
        }else if(data.usage<1000000000){
            capacity.value=`${Math.round(mbs(data.usage))} MB of ${Math.round(gbs(data.quota))} GB used.`;
            use.value=Math.round(mbs(data.usage))
            total.value=Math.round(mbs(data.quota))
            use_percent.value=100*use.value/total.value
        }else if(data.usage>1000000000){
            capacity.value=`${Math.round(gbs(data.usage))} GB of ${Math.round(gbs(data.quota))} GB used.`;
            use.value=Math.round(mbs(data.usage))
            total.value=Math.round(mbs(data.quota))
            use_percent.value=100*use.value/total.value
        }
    });
  }
} 
onMounted(()=>{
    storage()
})

const dialog_open=()=>{
    const dialogElement=document.getElementById("clear-storage-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col px-8 pt-4">
                <MobileNav :title="title"/>
                <p class="text-2xl" id="storage-title">{{title}}</p>
                <div class="mt-24 lg:mt-10 shadow-md shadow-slate-300 rounded-lg px-4 w-[50vw] max-lg:w-[80vw] fle flex-col">
                    <div class="flex text-2xl items-center">
                        <i class="icon pi pi-th-large mr-3"></i>
                        <p class="text-xl">{{capacity}}</p>
                    </div>
                    <div class="">
                        <p class="mt-2 text-sm">Usage {{use_percent}}%</p>
                    </div>
                    <div class="h-2 my-3 bg-slate-300 rounded-xl" :class="`w-[100%]`">
                        <div class="h-2 px-1 bg-black rounded-xl text-white text-sm text-center" :class="`max-w-[${use_percent}%]`"></div>
                    </div>
                    <button @click="dialog_open" class="mt-6 mb-2 text-white bg-[#fd9104] rounded-[10px] h-[40px] w-[120px] flex items-center justify-center">
                        <i class="icon pi pi-trash mr-1"></i>
                        <span class="text-center text-sm">Clean {{use}}MB</span>
                    </button>
                </div>
            </div>
        </template>
    </LayoutGrid>
    <ClearDialog/>
</template>