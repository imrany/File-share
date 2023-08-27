<script setup lang="ts">
import { useRouter } from "vue-router"

const router=useRouter()
const props=defineProps<{
    title:string
}>()

</script>
<template>
    <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
        <div class="flex pr-10 pl-5 py-5 items-center">
            <i @click="router.back()" class="icon pi pi-arrow-left text-xl mr-6"></i>
            <p class="text-xl text-slate-800">{{props.title}}</p>
        </div>
    </div>
</template>
