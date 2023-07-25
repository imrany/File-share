<script lang="ts" setup>
import { onMounted } from "vue"
import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"
import { useRoute } from "vue-router"

const route=useRoute()
function open_delete_dialog(){
    const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
onMounted(()=>{
    open_delete_dialog()
})
</script>

<template>
    <DeleteFileDialog :filename="route.params.filename"/>
</template>
