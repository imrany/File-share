<script lang="ts" setup>
import { socket } from "@/socket";
import { ref } from 'vue';
const isLoading=ref(false)
const value=ref("")

function  onSubmit() {
    isLoading.value = true;

    socket.timeout(5000).emit("create-something", value.value, () => {
      isLoading.value = false;
    });
}
</script>
<template>
  <form @submit.prevent="onSubmit">
    <input v-model="value" />

    <button type="submit" :disabled="isLoading">Submit</button>
  </form>
</template>