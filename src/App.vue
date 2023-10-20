<script setup lang="ts">
import { onMounted, provide } from "vue";
import { origin, userdata, fetchUserDetails } from ".";
import Toast from './components/ui/Toast/index.vue'

provide('userdata',userdata)
provide('origin',origin)
onMounted(()=>{
  fetchUserDetails()
})
</script>

<template>
  <Toast/>
  <RouterView/>
</template>
