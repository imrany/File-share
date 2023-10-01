<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { loader } from "@/index";

const route=useRoute()
const toast=useToast()
const userdata:any=inject("userdata")
const origin:any=inject("origin")
const props=defineProps<{
    error:string
    fetchItems:any
}>()

const submit_error=ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
    dialogElement.close()
    submit_error.value=""
};

async function handleAdd(e:any){
    e.preventDefault()
    try {
        indexedDB().then((db:any)=>{
        const files=[]
        const file=e.target.name.files
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        files.push(...file)
        files.map((item:any)=>{
            let date=new Date()
            let newObj = Intl.DateTimeFormat('en-US', {
                timeZone: "America/New_York"
            })
            let newDate = newObj.format(date);
            let min=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`
            let time=date.getHours()>12?`${date.getHours()}:${min}PM`:`${date.getHours()}:${min}AM`
            const getFiles=fileStore.add({
                file:item,
                uploadedAt:`${newDate} ${time}`,
                filename:item.name,
                size:item.size,
                type:item.type,
                email:userdata.email,
                id:`${Math.random()}`
            })

            getFiles.onsuccess=()=>{
                setTimeout(()=>{
                    dialog_close()
                    // window.location.reload()
                    props.fetchItems()
                },500)
            }
            getFiles.onerror=()=>{
                submit_error.value="This file already exists!"
                console.log("error: failed to added to db",getFiles.error)
            }
        })
    }).catch((err)=>{
        submit_error.value=err
        console.log(err)
    })
    } catch (error:any) {
        submit_error.value=error.message
    }
}

const uploadFile=async(e:any)=>{
    dialog_close()
    loader.on()
    e.preventDefault()
    try {
        let accountType="groups"
        const file=e.target.name.files[0]
        const url=`${origin}/upload/${accountType}/${userdata.email}`
        const formData=new FormData()
        formData.append("file",file)
        const response=await fetch(url,{
            method:"POST",
            body:formData
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
        }else{
            handleUpload(parseRes.url,file)
        }
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}

async function handleUpload(path:string,file:any) {
    try {
        let date=new Date()
        let newObj = Intl.DateTimeFormat('en-US', {
            timeZone: "America/New_York"
        })
        let newDate = newObj.format(date);
        let min=date.getMinutes()<10?`0${date.getMinutes()}`:`${date.getMinutes()}`
        let time=date.getHours()>12?`${date.getHours()}:${min}PM`:`${date.getHours()}:${min}AM`
        
        let file_body={
            email:userdata.email,
            filename:file.name,
            groupname:route.query.name,
            uploadedAt:`${newDate} ${time}`,
            size:file.size,
            file:path,
            type:file.type,
        }
        let url=`${origin}/api/group_upload/${userdata.email}`
        const response=await fetch(url,{
            method:"POST",
            headers:{
                'authorization':`Bearer ${userdata.token}`,
                "content-type":"application/json"
            },
            body:JSON.stringify({
                file_body
            })
        })
        const parseRes=await response.json()
        if(parseRes.error){
            toast.error(parseRes.error,{
                position:"top-right",
                duration:5000,
            })
        }else{
            toast.success(parseRes.msg,{
                position:"top-right",
                duration:5000,
            })
            props.fetchItems()
        }
        loader.off()
    } catch (error:any) {
        toast.error(error.message,{
            position:"top-right",
            duration:5000,
        })
        loader.off()
    }
}
</script>

<template>
   <dialog id="upload-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] md:p-10 max-md:pb-6 max-md:pt-2 max-md:px-4 max-md:scale-[1.0]">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858] max-md:text-sm"></i>
        </button>
        <div class="flex flex-col w-full max-md:mt-2">
            <p class="text-yellow-500 text-center text-base mb-2 max-md:text-xs max-md:mx-6">{{props.error}}</p>
            <p class="text-red-500 text-center text-base mb-2 max-md:text-xs max-md:mx-6">{{submit_error}}</p>
            <p class="text-black max-md:text-sm" v-if="route.query.name">Upload file</p>
            <p class="text-black max-md:text-sm" v-else>Add file</p>

            <form v-if="route.query.name" class="flex flex-col items-center md:my-4" @submit="uploadFile">
                <input type="file" id="file" name="name" class="mt-2 max-md:text-xs border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[100%] py-2 px-4 placeholder:text-sm text-sm" required />
                <button class="mt-4 bg-gray-700 text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="max-md:text-xs icon text-sm pi pi-upload mr-3"></i>
                    <span class="max-md:text-xs">Upload</span>
                </button>
            </form>
            <form v-else class="flex flex-col items-center md:my-4" @submit="handleAdd">
                <input type="file" id="file" name="name" class="mt-2 max-md:text-xs border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[100%] py-2 px-4 placeholder:text-sm text-sm" required multiple/>
                <button class="mt-4 bg-gray-700 text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="max-md:text-xs icon text-sm pi pi-plus mr-3"></i>
                   <span class="max-md:text-xs">Add</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
