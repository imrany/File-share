<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { loader } from "../index";
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";
import FeedbackDialog from "@/components/ui/Dialog/Feedback.vue";

const router=useRouter()
const origin:any=inject("origin")
const route=useRoute()
const toast=useToast()
const data:any=ref({})
const userdata:any=inject("userdata")
const text=ref("")
const title="Privacy"
const feedbackDetails=ref({
    error:"",
    title:"",
    success:""
})

onMounted(()=>{
    fetchUserDetails()
})

async function fetchUserDetails() {
    try {
        loader.on()
        const url=!userdata.username?`${origin}/api/groups/${route.query.email}`:`${origin}/api/accounts/${route.query.email}`
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
                duration:5000,
            })
            localStorage.clear()
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
    loader.off()
    //if userdata.privacy is equal to true then change to public which is false
    text.value=data.value.privacy===true?`Public`:'Private'
}

const successCallback=(position:any)=>{
    const {latitude, longitude}= position.coords;
    console.log(latitude,longitude)
    feedbackDetails.value={
        error:"",
        title:"You've successful turned on location",
        success:"Location is on"
    }
}
const errorCallback=(error:any)=>{
    feedbackDetails.value={
        error:error.message,
        title:"Any error has occurred!",
        success:""
    }
}
const turnOnLocation=()=>{
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    const dialogElement=document.getElementById("feedback-dialog") as HTMLDialogElement
    dialogElement.showModal()
}

</script>

<template>
    <LayoutGrid>
        <template #grid-2>
           <div class="flex flex-col pb-8">
                <MobileNav :title="title"/>
                <DesktopNav :title="title"/>
                <div class="max-xl:mt-20 pb-7">
                    <div @click="turnOnLocation" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-map-marker text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Turn on location</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Turn on location.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </template>
    </LayoutGrid>
    <FeedbackDialog :feedback="feedbackDetails"/>
</template>
