<script lang="ts" setup>
import indexedDB from "../../../indexedDB"
import { ref } from "vue";
defineProps<{
    error:string
}>()

const submit_error=ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleUpload(e:any){
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
            })

            getFiles.onsuccess=()=>{
                setTimeout(()=>{
                    dialog_close()
                    window.location.reload()
                },500)
            }
            getFiles.onerror=()=>{
                submit_error.value=getFiles.error
                console.log("error: file to added to db",getFiles)
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
</script>

<template>
   <dialog id="upload-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] md:p-10 max-md:pb-6 max-md:pt-2 max-md:px-4 max-md:scale-[1.0]">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858] max-md:text-sm"></i>
        </button>
        <div class="flex flex-col w-full max-md:mt-2">
            <p class="text-red-500 text-center text-base mb-2 max-md:text-xs max-md:mx-6">{{error}}</p>
            <p class="text-black max-md:text-sm">Upload file</p>

            <form class="flex flex-col items-center md:my-4" @submit="handleUpload">
                <input type="file" id="file" name="name" class="mt-2 max-md:text-xs border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[100%] py-2 px-4 placeholder:text-sm text-sm" required multiple/>
                <button class="mt-4 bg-black text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="max-md:text-xs icon pi pi-upload mr-3"></i>
                   <span class="max-md:text-xs">Upload</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
