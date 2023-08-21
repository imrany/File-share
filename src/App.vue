<script setup lang="ts">
import { provide } from "vue";

type Userdata={
  username: string, 
  email:string, 
  photo: any,
  token:string
}

const origin="http://localhost:8000"
// const origin='https://fireshare-server.onrender.com'

const user_data:any=localStorage.getItem("userdata")
const userdata:Userdata=JSON.parse(user_data)
provide('userdata',userdata)
provide('origin',origin)

</script>

<template>
  <div class='preload'></div>
  <RouterView/>
</template>
