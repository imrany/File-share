<script lang="ts" setup>
import { inject, onMounted, ref } from "vue"
import LayoutGrid from "../components/LayoutGrid.vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { loader } from "../index";
import AddMember from "../components/ui/Dialog/AddMember.vue"
import MobileNav from "../components/ui/MobileNav.vue";
import DesktopNav from "@/components/ui/DesktopNav.vue";
import ChangeVisibility from "../components/ui/Dialog/ChangeGroupVisibilty.vue";
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

const add_member_dialog=()=>{
    const dialogElement=document.getElementById("add-member-dialog") as HTMLDialogElement
    dialogElement.showModal()
};

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

const name=!userdata.username?`group`:`account`
const change_visibility=async()=>{
    try {
        loader.on()
        const privacy:boolean=data.value.privacy===true?false:true
        const url=`${origin}/api/groups_visibility/${route.query.email}`
        const response=await fetch(url,{
            method:"PATCH",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                privacy
            })
        })
        const parseRes=await response.json()
        if (parseRes.error) {
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
        } else {
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000,
            })
            localStorage.setItem("userdata",JSON.stringify(parseRes.data))
            fetchUserDetails()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        fetchUserDetails()
    }
    loader.off()
    close_change_visibilty_dialog()
}
const open_change_visibilty_dialog=()=>{
    const dialogElement=document.getElementById("group-visibility") as HTMLDialogElement
    dialogElement.showModal()
};
const close_change_visibilty_dialog=()=>{
    const dialogElement=document.getElementById("group-visibility") as HTMLDialogElement
    dialogElement.close()
};
let change={
    changeVisibility:change_visibility,
    text
}

const successCallback=(position:any)=>{
    const {latitude, longitude}= position.coords;
    console.log(latitude,longitude)
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
                            <i class="icon pi pi-map text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Turn on location</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Turn on location.</span>
                            </p>
                        </div>
                    </div>

                    <div @click="add_member_dialog" v-if="userdata.groupname" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" >
                            <i class="icon pi pi-plus text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Add a new members</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Add a members to your group using their emails</span>
                            </p>
                        </div>
                    </div>

                    <div @click="open_change_visibilty_dialog" v-if="userdata.groupname" class="md:px-8 px-4 cursor-pointer hover:bg-slate-200">
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" v-if="data.privacy===true">
                            <i class="icon pi pi-globe text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Change to Public</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Share with all</span>
                            </p>
                        </div>
                        <div class="px-6 max-sm:px-3 py-4 flex items-center" v-if="data.privacy===false">
                            <i class="icon pi pi-lock text-xl mr-3"></i>
                            <p class="flex flex-col">
                                <span class="max-sm:text-sm">Change to Private</span>
                                <span class="text-sm max-sm:text-xs text-slate-600">Share with only members and allowed recipients.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </LayoutGrid>
    <AddMember/>
    <ChangeVisibility :change="change"/>
    <FeedbackDialog :feedback="feedbackDetails"/>
</template>
