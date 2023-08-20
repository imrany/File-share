<script setup lang="ts">
import { onMounted, provide } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import {loader} from "./index"
const toast=useToast()
const router=useRouter()

type Userdata={
  username: string, 
  email:string, 
  photo: any,
  token:string
}

const user_data:any=localStorage.getItem("userdata")
const userdata:Userdata=JSON.parse(user_data)
provide('userdata',userdata)

</script>

<template>
  <div class='preload'></div>
  <RouterView/>
</template>
