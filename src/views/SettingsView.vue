<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import profile from "@/assets/images/profile.png"
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const router=useRouter()
const route=useRoute()
const toast=useToast()
const data:any=ref({})
const userdata:any=inject("userdata")
const title="Settings"

onMounted(()=>{
    fetchUserDetails()
})

async function fetchUserDetails() {
    try {
        const url=`http://localhost:8000/api/accounts/${route.params.email}`
        const response=await fetch(url,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${userdata.token}`
            }
        })
        const parseRes=await response.json()
        if (parseRes.error) {
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
            router.back()
        } else {
            data.value=parseRes.data
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        router.back()
    }
}
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8 pt-4">
                 <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
                    <div class="flex px-10 py-5 items-center">
                        <i @click="router.back()" class="icon pi pi-arrow-left text-xl mr-6"></i>
                         <p class="text-xl text-slate-800">{{title}}</p>
                    </div>
                </div>
                <div class="mt-24 lg:mt-4">
                   <div class="flex items-center max-sm:border-b-[1px] border-slate-200 pb-4 px-8">
                        <a :href="profile" v-if="data.photo===null" target="_blank" rel="noopener noreferrer">
                            <img title="My profile" :src="profile" alt="." class="w-[65px] h-[65px] rounded-[50px]">
                        </a>
                        <a :href="data.photo" target="_blank" rel="noopener noreferrer" v-else>
                            <img title="My profile" :src="data.photo" alt="." class="w-[65px] h-[65px] rounded-[50px]">
                        </a>
                        
                        <div class="flex flex-col ml-4">
                            <p>{{data.username}}</p>
                            <p class="text-slate-600 text-sm">{{data.email}}</p>
                        </div>
                        <i class="icon pi pi-pencil md:ml-14 cursor-pointer max-md:ml-auto"></i>
                   </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
