<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { socket } from "@/socket";
import { useToast } from "vue-toast-notification";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";
import { loader } from "..";
import { useRouter } from "vue-router";
import Image from "@/assets/icons/image-icon.png"

const userdata:any=inject("userdata")
const origin:any=inject("origin")
const toast=useToast()
const router=useRouter()
let groups:any=ref([])
const title="Groups"
const error=ref("")
const fetchGroups=async()=>{
    try{
        loader.on()
        const url=`${origin}/api/fetch_groups/${userdata.email}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                "Authorization":`Bearer ${userdata.token}`
            }
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
            error.value=parseRes.error
        }else{
            // console.log({groups:parseRes.groups,count:parseRes.count})
            groups.value=parseRes.groups
            error.value=parseRes.groups.length===0?"No groups":""
            loader.off()
        }
    }catch(error:any){
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
        error.value=error.message
    }
}
onMounted(()=>{
    fetchGroups()
})

// groupname,grouptype,
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col  pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-[71px]">
                   <div class="flex flex-col">
                        <div class="flex h-[70vh] items-center justify-center" v-if="error">
                            <p class="text-xl max-md:text-lg max-sm:text-sm text-red-500">{{error}}</p>
                        </div>
                        <div v-else class="grid grid-cols-1" id="recently" v-for="(group, index) in groups" :key="index">
                            <div @click="router.push(`/group?name=${group.groupname}`)" class="flex justify-between cursor-pointer  hover:bg-slate-200" >
                                <div class="flex py-3 px-6 flex-grow" :title="group.groupname">
                                    <img v-lazy="{ src: `https://drive.google.com/uc?id=${group.photo}`, loading: Image, error: Image }" class="flex mr-4 w-[45px] h-[45px] max-md:w-[40px] max-md:h-[40px] rounded-md" :title="group.groupname"/>
                                    <div class="flex flex-col">
                                        <p class="text-sm font-semibold">
                                            {{group.groupname}} 
                                        </p>
                                        <p class="text-sm text-gray-500" id="type">{{group.grouptype}}</p>
                                    </div>
                                </div>
                                <div class=" py-3 px-5  pl-4">
                                    <!-- <i class="mt-2 icon pi pi-users text-lg"></i> -->
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1" id="file-tabs" v-for="(group, index) in groups" :key="index">
                            <div @click="router.push(`/group?name=${group.groupname}`)" class="flex px-1 justify-between cursor-pointer  hover:bg-slate-200">
                                <div  class="flex py-5 px-2 flex-grow" :title="group.groupname">
                                    <img  v-lazy="{ src: `https://drive.google.com/uc?id=${group.photo}`, loading: Image, error: Image }" class="flex mr-4 w-[45px] h-[45px] max-md:w-[40px] max-md:h-[40px] rounded-md" :title="group.groupname"/>
                                    <div class="flex flex-col">
                                        <p class="text-xs font-semibold">
                                            {{group.groupname}} 
                                        </p>
                                        <p class="text-xs text-gray-500" id="type">{{group.grouptype}}</p>
                                    </div>
                                </div>
                                <div  class=" py-3 px-5  pl-4">
                                    <!-- <i class="mt-2 icon pi pi-users text-base"></i> -->
                                </div>
                            </div>
                        </div>
                   </div>

                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
