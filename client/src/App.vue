<script setup lang="ts">
import { onMounted, provide, reactive } from "vue";
import { useToast } from "vue-toast-notification";
const user_details:any=reactive({})
const toast=useToast()

onMounted(()=>{
  fetch_User_Details()
})
provide('user-details',user_details)

async function fetch_User_Details() {
  try {
    const url=`http://localhost:8000/api/user`
    const response=await fetch(url,{
      method:"GET",
      headers:{
        "authorization":`Basic ${localStorage.getItem("token")}`
      },
    })
    const parseRes=await response.json()
    console.log(parseRes)
  } catch (error:any) {
    toast.error(error.message,{
      duration:3000,
      position:"top"
    })
  }
}
</script>

<template>
  <RouterView/>
  <notifications group="foo" />
</template>
