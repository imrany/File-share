<script lang="ts" setup>

</script>

<template>
    <footer class="flex bg-gray-100 px-10 py-4 mt-20 -mx-8 justify-between" id="footer">
        <div class="flex item-center">
            <img src="@/assets/icons/folder.png" alt="folders" class="w-[30px] h-[30px]">
            <p class="ml-4 mt-1">
                Name of file - 32mbs -31/2/2023
            </p>

            <div class="rounded-[50px] py-1 pr-3 pl-1 bg-black text-white ml-10">
                <span class="rounded-[20px] py-1 px-2 bg-white text-black">5</span>
                people
            </div>
        </div>
        <div class="flex">
            <div class="">
                <i class="icon pi pi-download mr-1"></i>
            </div>
             <div class="mx-4">
                <i class="icon pi pi-link mr-1"></i>
            </div>
             <div class="">
                <i class="icon pi pi-trash mr-1"></i>
            </div>
        </div>
    </footer>
</template>