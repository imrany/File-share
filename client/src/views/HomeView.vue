<script lang="ts">
export default {
    setup() {
      
       return{
        title:"Recent files"
       }
    },
}
</script>

<template>
    <p class="text-lg">{{title}}</p>
    <div class="flex justify-between my-4">
        <div class="rounded-lg border-gray-100 border-2 p-4 h-fit">
            <img src="@/assets/icons/folder.png" alt="folders" class="w-[100px] h-[100px]">
            <p class="text-center text-gray-700">Excel Checklist</p>
        </div>

        <div class="rounded-lg border-gray-100 border-2 p-4 h-fit">
            <img src="@/assets/icons/pdf.png" alt="folders" class="w-[100px] h-[100px]">
            <p class="text-center text-gray-700">Art club</p>
        </div>

        <div class="rounded-lg border-gray-100 border-2 p-4 h-fit">
            <img src="@/assets/icons/jpeg.png" alt="folders" class="w-[100px] h-[100px]">
            <p class="text-center text-gray-700">Nike_logo</p>
        </div>

         <div class="rounded-lg border-gray-100 border-2 p-4 h-fit">
            <img src="@/assets/icons/egg.png" alt="folders" class="min-w-[100px] max-w-[150px] rounded-lg h-[100px]">
            <p class="text-center text-gray-700">Summer fotos</p>
        </div>

         <div class="rounded-lg border-gray-100 border-2 p-4 h-fit">
            <img src="@/assets/icons/txt.png" alt="folders" class="w-[100px] h-[100px]">
            <p class="text-center text-gray-700">Password</p>
        </div>
    </div>
</template>