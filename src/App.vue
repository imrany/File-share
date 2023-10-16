<script setup lang="ts">
import { onMounted, provide } from "vue";
import { origin, userdata, fetchUserDetails } from ".";

provide('userdata',userdata)
provide('origin',origin)
onMounted(()=>{
  fetchUserDetails()
})
</script>

<template>
  <RouterView/>
</template>
