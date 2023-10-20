<script lang='ts' setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const a=ref('a')
const route=useRoute()
const closeToast=()=>{
    const welcome_toast=document.getElementById('toast') as HTMLDivElement
    welcome_toast.style.transition='ease-in-out'
    welcome_toast.style.transitionDuration='1s'
    welcome_toast.style.transitionDelay='2s'
    welcome_toast.style.display="none"
}
const flow=(step:string)=>{
    a.value=step
}
</script>
<template>
    <div class="flex flex-col justify-center items-center h-[100vh] w-full" v-if="route.fullPath==='/home'">
        <div class="text-gray-700 bg-white sm:right-14 z-50 max-sm:mx-[10vw] rounded-md shadow-md shadow-gray-500">
            <div class="flex flex-col">
                <button  class="ml-[auto] outline-none m-2" @click="closeToast">
                    <i class="icon pi pi-times text-sm hover:text-[#F45858]"></i>
                </button>
                <div class="pb-4 px-8 lg:w-[35vw] md:w-[45vw] sm:w-[55vw]">
                    <div v-if="a==='a'">
                        <p class="text-xl font-semibold">Welcome to Wekafile</p>
                        <p class="text-sm mt-1">
                            <span>
                                Hello I'm <b>Marco</b>, your personal AI assistant. I'm here to help you.
                                Proceed with me, step by step, and in no time you would be able to use Wekafile like a prop.
                            </span>
                        </p>
                        <div class="flex justify-between mt-4">
                            <button @click="closeToast" class="text-gray-600 border-[1px] w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center">Close</button>
                            <button @click="flow('b')" class="text-gray-100 w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-green-400">Proceed</button>
                        </div>
                    </div>
                    <div v-if="a==='b'">
                        <p class="text-xl font-semibold">How do Wekafile work?</p>
                        <p class="text-sm mt-1">
                            <span>
                                Hello I'm <b>Marco</b>, your personal AI assistant. I'm here to help you.
                                Proceed with me, step by step, and in no time you would be able to use Wekafile like a prop.
                            </span>
                        </p>
                        <div class="flex justify-between mt-4">
                            <button @click="flow('a')" class="text-gray-600 border-[1px] w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center">Previous</button>
                            <button class="text-gray-100 w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-green-400">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>