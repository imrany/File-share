<script setup lang="ts">
import { inject, ref } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { loader } from "../../..";
import indexedDB from "../../../indexedDB"

const origin:any=inject("origin")
const router=useRouter()
const route=useRoute()
const userdata:any=inject("userdata")
const access_token:any=inject("access_token")
const isLoading=ref(false)
const wait=ref("")
const toast=useToast()
const dialog_close=()=>{
    const dialogElement=document.getElementById("delete-account") as HTMLDialogElement
    dialogElement.close()
};
const props=defineProps<{
    data:any,
    fetchDetails:any
}>()
async function clear(){
    try {
        dialog_close()
        loader.on()
        isLoading.value=true
        wait.value="cursor-progress bg-gray-400"
        const url=!route.query.type?`${origin}/api/groups/${userdata.email}/${userdata.group_folder_id}`:`${origin}/api/accounts/${route.query.email}/${userdata.folder_id}`
        const response=await fetch(url,{
            method:"DELETE",
            headers:{
                "authorization":`Bearer ${userdata.token}`,
                "content-type":'application/json'
            },
            body:access_token
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000
            })
            loader.off()
        }else{
            if(route.query.type){
                const request=await indexedDB()
                const db:any=await request
                const transaction=db.transaction("All_files","readwrite")
                const fileStore=transaction.objectStore("All_files")
                const fileEmail=fileStore.index("email")
                const fileEmailKey = fileEmail.getAllKeys([`${userdata.email}`]);
                fileEmailKey.onsuccess=()=>{
                    fileEmailKey.result.forEach((item:any)=>{
                        const deleteFiles=fileStore.delete(item)
                    })
                    dialog_close()
                    localStorage.clear()
                    router.back()
                }
                fileEmailKey.onerror=()=>{
                    console.log("error",fileEmailKey.result)
                }
            }else if(route.query.email){
                props.fetchDetails()
            }else if(route.query.name){
                router.back()
            }
        }

    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000
        })
        console.log(error.message)
        dialog_close()
    }
    isLoading.value=false
    wait.value="cursor-pointer"
}

</script>

<template>
    <dialog id="delete-account" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[83vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-5 max-sm:py-8">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center max-sm:text-xs">You are about to delete <span v-if="data.group_ownership&&!route.query.type">{{ data.group_ownership }}</span> <span v-else-if="data.groupname">{{ data.groupname }}</span> <span v-else-if="route.query.type">account</span></p>
            <p class="text-red-500 mb-5 text-center text-sm max-sm:text-xs">Once you delete your account all your data would be lost</p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button :disabled="isLoading"  @click="clear" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Delete 
                </button>
                 <button :class="wait" @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
