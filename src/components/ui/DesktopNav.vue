<script setup lang="ts">
import { useRouter } from "vue-router"

const router=useRouter()
const props=defineProps<{
    title:string
}>()

</script>
<template>
    <div class="bg-white border-b-[1px]" id="storage-title">
        <div class="flex pr-10 pl-5 py-3 items-center">
            <i @click="router.back()" class="icon pi pi-arrow-left cursor-pointer text-sm mr-4"></i>
            <p class="text-lg text-slate-800">{{props.title}}</p>
        </div>
    </div>
</template>
