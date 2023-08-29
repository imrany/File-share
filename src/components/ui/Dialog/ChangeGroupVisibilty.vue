<script setup lang="ts">
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { loader } from "../../..";
const props=defineProps<{
    change:{
        changeVisibility:any,
        text:{
            value:string
        }
    }
}>()
const wait=ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("group-visibility") as HTMLDialogElement
    dialogElement.close()
};

</script>

<template>
    <dialog id="group-visibility" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-black mb-1 text-center max-sm:text-xs">Change to {{ props.change.text.value }}</p>
            <p class="text-gray-600 mb-8 text-center text-sm max-sm:text-xs" v-if="props.change.text.value==='Private'">Once you change your group to {{ props.change.text }}, you'll only share with members and allowed recipients.</p>
            <p class="text-gray-600 mb-8 text-center text-sm max-sm:text-xs" v-if="props.change.text.value==='Public'">Once you change your group to {{ props.change.text }} and share with all.</p>
            <div class="flex gap-6 max-md:text-sm justify-between">
                <button @click="props.change.changeVisibility"  class="text-white bg-green-400 rounded-[10px] h-[40px] w-[120px]">
                    Proceed
                </button>
                 <button :class="wait" @click="dialog_close" class="text-black border-[1px] rounded-[10px] h-[40px] w-[120px]">
                    Cancel
                </button>
            </div>
        </div>
    </dialog>
</template>
