<script lang="ts">
import {onMounted, ref} from "vue"
import {useRoute} from "vue-router"
export default {
    setup() {
        const location=ref("")
        onMounted(()=>{
            location.value=useRoute().path
        })

       return{
        title:"Taxes",
        route:location
       }
    }
}
</script>

<template>
    <p class="text-2xl">{{title}}</p>
    <p>{{$route.path}} ok</p>
</template>