<script lang="ts" setup>
import { useRouter } from "vue-router";
import { socket, state } from "@/socket";
import { ref } from "vue";

// function disconnect() {
//   socket.disconnect();
// }
const photo=ref()
const show=ref(false)
const router=useRouter()
const dialog_close=()=>{
    const dialogElement=document.getElementById("connect-dialog") as HTMLDialogElement
    dialogElement.close()
    // window.location.href="/"
};

const handleConnect=async(e:any)=>{
    e.preventDefault()
    try {
        const data={
            id:e.target.userid.value,
            photo:handlePhoto(),
            platform:navigator.platform
        }
        socket.emit("peers",data);
        localStorage.setItem("userid",JSON.stringify(data))
        e.target.reset()
        // dialog_close()
        // window.location.reload()
    } catch (error:any) {
        alert(error)
    }
}

function handlePhoto(){
    const file=document.getElementById("photo") as HTMLInputElement
    photo.value=file.files[0]
    show.value=true
    return photo.value
}

function convert(image:any){
    let url =URL.createObjectURL(image)
    return url      
}
const id=JSON.parse(localStorage.getItem("userid"))
</script>

<template>
    <dialog id="connect-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <form class="flex flex-col w-full items-center" @submit="handleConnect" v-if="!state.connected">
            <label title="Add your profile picture" class="cursor-pointer -mb-2">
                <span class="flex flex-col items-center">
                    <i class="icon pi pi-user text-5xl bg-black text-white p-8 rounded-[90px]" v-if="!show"></i>
                    <img :src="convert(photo)" class="w-[120px] h-[120px] rounded-[90px]" alt="" v-if="show">
                    <input type="file" id="photo" name="photo" class="opacity-0" accept="image/*" @change="handlePhoto" required/>
                </span>
            </label>

            <label for="userid">Enter your user id</label>
            <input type="text" class="mt-1 mb-4 border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[80%] py-2 px-4 placeholder:text-sm text-sm" placeholder="John doe" name="userid" id="userid" required/>
            <div class="flex justify-center">
                <button @click="clear" class="text-white bg-blue-600 rounded-[10px] h-[40px] w-[120px]">
                    Connect
                </button>
            </div>
        </form>

        <div class="flex flex-col" v-else>
            <p class="text-black mb-5 text-center text-lg">You are connected</p>
            <p class="text-center text-lg">user id: {{id}}</p>
        </div>
    </dialog>
</template>
