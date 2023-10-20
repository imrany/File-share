<script lang='ts' setup>
import { useRoute } from 'vue-router';

const route=useRoute()
const closeToast=()=>{
    const welcome_toast=document.getElementById('toast') as HTMLDivElement
    welcome_toast.style.transition='ease-in-out'
    welcome_toast.style.transitionDuration='1s'
    welcome_toast.style.transitionDelay='2s'
    welcome_toast.style.display="none"
}
</script>
<template>
    <div v-if="route.fullPath==='/home'" class="fixed bottom-8 text-gray-700 bg-white max-sm:left-14 max-sm:right-2 sm:right-14 z-50 rounded-md shadow-md shadow-gray-500">
        <div class="flex flex-col">
            <button  class="ml-[auto] outline-none m-2" @click="closeToast">
                <i class="icon pi pi-times text-sm hover:text-[#F45858]"></i>
            </button>
            <div class="pb-4 px-8">
                <p class="text-xl font-semibold">Welcome to Wekafile</p>
                <p class="text-sm">Get started for free and take leverage of our services.</p>
                <div class="flex justify-between mt-4">
                    <button @click="closeToast" class="text-gray-100 w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-gray-600">Close</button>
                    <RouterLink to="/signin" class="text-gray-100 w-[90px] font-semibold text-sm h-[35px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-green-400">Sign in</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>