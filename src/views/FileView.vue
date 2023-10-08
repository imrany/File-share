<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { share_file } from "../index";

const router=useRouter()
const route=useRoute()
const title=route.query.filename
async function download_file(){
    try {
        const url=`https://drive.google.com/uc?id=${route.query.file}`
        const response=await fetch(url)
        const parseRes=await response.blob()
        let aDom = document.createElement('a') as HTMLAnchorElement
        if('download' in aDom){
            aDom.type = 'download'
            aDom.href =URL.createObjectURL(parseRes)
            aDom.download=`${route.query.filename}`
            aDom.target="_blank"
            aDom.click()
        } 
    } catch (error:any) {
        console.log(error.message)
    }
    
}

async function share(){
    try {
        const url=`https://drive.google.com/uc?id=${route.query.file}`
        const response=await fetch(url)
        const parseRes=await response.blob()
        let file=new File([parseRes],`${route.query.filename}`)
        share_file(`${route.query.filename}`,file) 
    } catch (error:any) {
        console.log(error.message)
    }
    
}

</script>

<template>
   <object :data="`https://drive.google.com/uc?id=${route.query.file}`" type=""></object>
</template>
