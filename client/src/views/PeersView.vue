<script lang="ts" setup>
import { onMounted } from "vue"
import ConnectDialog from "../components/ui/Dialog/ConnectDialog.vue"
import { state } from "@/socket";

function open_dialog(){
    const dialogElement=document.getElementById("connect-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
onMounted(()=>{
    if(!state.connected){
        open_dialog()
    }
})

</script>

<template>
    <ConnectDialog/>
</template>
