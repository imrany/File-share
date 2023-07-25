<script lang="ts" setup>
import { useRouter } from "vue-router";
import { socket, state } from "@/socket";

// function disconnect() {
//   socket.disconnect();
// }

const router=useRouter()
const dialog_close=()=>{
    const dialogElement=document.getElementById("connect-dialog") as HTMLDialogElement
    dialogElement.close()
    window.location.reload()
};

const handleConnect=async(e:any)=>{
    e.preventDefault()
    try {
        const data={
            id:e.target.userid.value,
            platform:navigator.platform
        }
        socket.emit("peers",data);
        localStorage.setItem("userid",JSON.stringify(data))
        e.target.reset()
        dialog_close()
    } catch (error:any) {
        alert(error)
    }
}

</script>
<template>
    <dialog id="connect-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <form class="flex flex-col w-full" @submit="handleConnect" v-if="!state.connected">
            <p class="text-black mb-5 text-center text-lg">Connect with your peers</p>
            <label for="userid">Enter your user id</label>
            <input type="text" class="border-[1px] border-slate-500 rounded-md mt-1 mb-4 px-2 py-1 text-base" placeholder="John doe" name="userid" id="userid" required/>
            <div class="flex justify-center">
                <button @click="clear" class="text-white bg-blue-600 rounded-[10px] h-[40px] w-[120px]">
                    Connect
                </button>
            </div>
        </form>

        <div class="flex flex-col" v-else>
            <p class="text-black mb-5 text-center text-lg">You are connected</p>
            <p class="text-center text-lg">user id: </p>
        </div>
    </dialog>
</template>
