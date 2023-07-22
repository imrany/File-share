<script lang="ts" setup>
import { useRouter } from "vue-router";

const router=useRouter()

const back=()=>{
  router.go(-1)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[100vh]">
    <p class="text-2xl text-[#0e0e0e]">Oops, this page doesn't exist</p>
    <button @click="back" class="w-[100px] my-5 flex justify-center items-center h-[40px] bg-black text-white rounded-[10px]">
      Back
    </button>
  </div>
</template>

