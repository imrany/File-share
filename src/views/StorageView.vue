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
    const dialogElement=document.getElementById("clear-storage") as HTMLDialogElement
    dialogElement.showModal()
};

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col sm:px-8 max-sm:items-center xl:pt-8">
                <MobileNav :title="title"/>
                <div class="grid grid-cols-2 max-sm:grid-cols-1 gap-y-10 max-xl:mt-20">
                    <div class="">
                        <div class=" bg-gray-50 rounded-[5px] px-4 w-[45vw] max-sm:w-[90vw] lg:w-[38vw] flex flex-col">
                            <p class="text-base text-gray-800 my-1">Storage</p>
                            <div class="flex text-sm text-gray-500 items-center">
                                <i class="icon pi pi-th-large mr-2"></i>
                                <p>{{capacity}}</p>
                            </div>
                            <p class="mt-1 text-sm  text-gray-500">Usage {{use_percent}}%</p>
                            <div class="h-2 my-3 bg-slate-300 rounded-xl w-[100%]">
                                <div class="h-2 px-1 bg-gray-800 rounded-xl text-white text-sm text-center" :style="`width:${use_percent.toString().slice(0,1)}%;`"></div>
                            </div>
                            <button @click="dialog_open" class="mt-1 mb-2 hover:bg-gray-600 hover:text-white bg-gray-200 text-gray-800 rounded-[5px] h-[40px] w-[120px] flex items-center justify-center">
                                <i class="icon pi pi-trash mr-1"></i>
                                <span class="text-center text-sm">Clear {{use}}MB</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            <ClearDialog :storage="capacity"/>
        </template>
    </LayoutGrid>
</template>