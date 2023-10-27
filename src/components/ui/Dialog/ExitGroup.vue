<script setup lang="ts">
import { inject } from "vue"
import { useRoute } from "vue-router"
import { useToast } from "vue-toast-notification"
import {loader} from "../../../index"

const toast=useToast()
const route=useRoute()
const userdata:any=inject("userdata")
const origin:any=inject('origin')
const props=defineProps<{
    data:any
    fetchDetails:any
}>()

const dialog_close=()=>{
    const dialogElement=document.getElementById("exit-group-dialog") as HTMLDialogElement
    dialogElement.close()
};


async function handle_exit(){
    try {
        loader.on()
        let url=userdata.email!==props.data.email?`${origin}/api/exit_group/${route.query.name}/${userdata.email}`:""
        const response=await fetch(url,{
            method:"POST",
            headers:{
                'authorization':`Bearer ${userdata.token}`,
                "content-type":"application/json"
            }
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
            loader.off()
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000,
            })
           props.fetchDetails()
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
    dialog_close()
}

</script>

<template>
    <dialog id="exit-group-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[83vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center max-sm:text-xs">You are about to exit from <span class="text-gray-500">{{props.data.groupname}}</span></p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button @click="handle_exit" class="text-white bg-red-600 rounded-[10px] h-[40px] w-[120px]">
                    Exit
                </button>
                 <button @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
