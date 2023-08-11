<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import {loader} from "./index"
const toast=useToast()
const router=useRouter()

provide('user-details',JSON.parse(localStorage.getItem("user_details")))

</script>

<template>
  <div class='preload'></div>
  <RouterView/>
</template>
