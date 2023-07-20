<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
</script>


<template>
    <div class="flex justify-between">
        <p class="text-lg">Recent files</p>
        <button class="w-fit px-4 py-2 flex text-sm h-fit bg-gray-200 cursor-pointer rounded-[5px]">
            <i class="icon pi pi-upload mr-2"></i> <span>Upload</span>
        </button>
    </div>

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

    <Table title="recent"/>

    <Footer/>
   
</template>