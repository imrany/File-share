<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRouter } from "vue-router";
import { socket } from "@/socket";
import { useToast } from "vue-toast-notification";
import sheet from "@/assets/images/profile.png"
import { loader } from "..";

const userdata:any=inject("userdata")
const toast=useToast()
const router=useRouter()
let groups:any=ref([])
const title="Groups"
const error=ref("")
const fetchGroups=()=>{
    loader.on()
    socket.emit('fetch_groups',userdata.email)
    socket.on('response',(res:any)=>{
        if(res.error){
            toast.error(res.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
            error.value=res.error
        }else{
            // console.log({groups:res.Groups,count:res.count})
            groups.value=res.groups
            loader.off()
        }
    })
}
onMounted(()=>{
    fetchGroups()
})

// groupname,grouptype,
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col max-md:px-2 md:px-8 pb-8 pt-4">
                 <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
                    <div class="flex px-10 py-5 items-center">
                        <i @click="router.back()" class="icon pi pi-arrow-left text-xl mr-6"></i>
                         <p class="text-xl text-slate-800">{{title}}</p>
                    </div>
                </div>
                <div class="mt-24 lg:mt-4">
                   <div class="flex flex-col">
                    <div class="flex h-[100vh] items-center justify-center" v-if="error">
                        <p class="text-xl text-red-500">{{error}}</p>
                    </div>
                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently">
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(group, index) in groups" :key="index">
                                <div class="flex py-3 px-2 flex-grow" :title="group.groupname">
                                    <p class="flex bg-green-400 text-white font-bold text-lg justify-center items-center mr-4 w-[45px] h-[45px] max-md:w-[40px] max-md:h-[40px] rounded-md" :title="group.groupname" v-if="!group.photo">{{ group.groupname.slice(1,2) }}</p>
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold">
                                            {{group.groupname}} 
                                        </p>
                                        <p class="text-sm text-gray-500" id="type">{{group.grouptype}}</p>
                                    </div>
                                </div>
                                <div class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-users text-base"></i>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 gap-y-3 mt-2 mb-16" id="file-tabs">
                            <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-3 hover:shadow-lg" v-for="(group, index) in groups" :key="index">
                                <div  class="flex py-3 px-2 flex-grow" :title="group.groupname">
                                    <p class="flex bg-green-400 text-white font-bold justify-center items-center mr-4 w-[45px] h-[45px] max-md:w-[40px] max-md:h-[40px] rounded-md" :title="group.groupname" v-if="!group.photo">{{ group.groupname.slice(1,2) }}</p>
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold">
                                            {{group.groupname}} 
                                        </p>
                                        <p class="text-xs text-gray-500" id="type">{{group.grouptype}}</p>
                                    </div>
                                </div>
                                <div  class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                                    <i class="mt-2 icon pi pi-users text-base"></i>
                                </div>
                            </div>
                        </div>
                   </div>

                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
