<script setup lang="ts">
import WelcomeToast from './type/Welcome.vue'

const toast=()=>{
    const toast=document.getElementById('toast') as HTMLDivElement
    toast.style.transition='ease-in-out'
    toast.style.transitionDuration='1s'
    toast.style.transitionDelay='2s'
    toast.style.display="none"
}
</script>
<template>
    <div id="toast" @click="toast" class="fixed bottom-0 top-0 left-0 right-0 z-40" style="display:none;">
        <WelcomeToast/>
    </div>
</template>
