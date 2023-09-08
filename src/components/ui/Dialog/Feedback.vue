<script lang="ts" setup>
const props=defineProps<{
    feedback:{
        title:string,
        error?:string,
        success?:string
    }
}>()
const dialog_close=()=>{
    const dialogElement=document.getElementById("feedback-dialog") as HTMLDialogElement
    dialogElement.close()
};
const reload=()=>window.location.reload();

</script>

<template>
   <dialog id="feedback-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[83vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-8">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-5 text-center text-xl">{{props.feedback.title}}</p>
            <p class="text-red-500 mb-5 text-center text-sm max-sm:text-xs">{{props.feedback.error}}</p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button @click="reload" class="text-white bg-green-400 rounded-[10px] h-[40px] w-[120px]">
                    Reload 
                </button>
                 <button @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Close
                </button>
            </div>
        </div>
    </dialog>
</template>
