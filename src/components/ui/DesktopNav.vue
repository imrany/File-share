<script setup lang="ts">
import { useRouter } from "vue-router"

const router=useRouter()
const props=defineProps<{
    title:string
}>()

</script>
<template>
    <div class="bg-white border-b-[1px]" id="storage-title">
        <div class="flex pr-10 pl-5 py-5 items-center">
            <i @click="router.back()" class="icon pi pi-arrow-left cursor-pointer text-lg mr-10"></i>
            <p class="text-xl text-slate-800">{{props.title}}</p>
        </div>
    </div>
</template>
