<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import {loader} from "./index"
const toast=useToast()
const router=useRouter()

const user_details:any=localStorage.getItem("user_details")
const userdetail:any=JSON.parse(user_details)
provide('user-details',userdetail)

</script>

<template>
  <div class='preload'></div>
  <RouterView/>
</template>
