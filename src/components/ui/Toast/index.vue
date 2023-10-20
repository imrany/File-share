<script setup lang="ts">
import WelcomeToast from './type/Welcome.vue'
import FirstTutorialToast from './type/FirstTutorials.vue'
import { useRoute } from 'vue-router';

const route=useRoute()
const closeToast=()=>{
    const toast=document.getElementById('toast') as HTMLDivElement
    toast.style.transition='ease-in-out'
    toast.style.transitionDuration='1s'
    toast.style.transitionDelay='2s'
    toast.style.display="none"
}
</script>
<template>
    <div id="toast" :style="route.fullPath==='/home'||route.fullPath==='/'?'background: rgba(0, 0, 0, 0.1);':''" @dblclick="closeToast" class="fixed bottom-0 top-0 left-0 right-0 z-40" style="display:none;">
        <WelcomeToast/>
        <FirstTutorialToast/>
    </div>
</template>
