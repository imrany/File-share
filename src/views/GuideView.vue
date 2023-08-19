<script lang="ts" setup>
import { useRouter } from "vue-router"
import LayoutGrid from "../components/LayoutGrid.vue"
const title="User manual"
const router=useRouter()
</script>
<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col px-8 pb-8 pt-4">
                 <div class="shadow-md text-slate-600 bg-white fixed top-0 left-0 right-0 z-20" id="nav-title">
                    <div class="flex px-10 py-5 items-center">
                        <i @click="router.back()" class="icon pi pi-arrow-left text-2xl mr-6"></i>
                         <p class="text-2xl text-slate-800">{{title}}</p>
                    </div>
                </div>
                <p class="text-2xl" id="storage-title">{{title}}</p>
                <div class="mt-24 lg:mt-4 ">
                    <p class="text-black">We've listed out <code class="text-[#808080]">Shortcuts</code> and <code class="text-[#808080]">Keys</code> that may help you navigate and use this application.</p>
                    <p>You can upload multiple images, audio, text, html, pdf and other documents.</p>
                    <p>Upload video files less than <code class="text-[#808080]">48MB</code>.</p>
                    <br/>
                    <u class="mb-4 text-lg">File Shortcuts</u>
                    <ul style="list-style-type: circle;" class="ml-4">
                        <li class="mt-3">Click on a file to open its file dialog.</li>
                        <li class="mt-3">Shift + Click to show the <code class="text-[#808080]">Delete modal</code>, then delete the file.</li>
                    </ul>  
                    <br/> 
                    <u class="mb-4 text-lg">Navigation Shortcuts</u>
                    <ul style="list-style-type: circle;" class="ml-4">
                        <li class="mt-3">To view all files, navigate to <RouterLink to="/" class="text-[#808080]"><u>All files</u></RouterLink>.</li>
                        <li class="mt-3">To clear your storage or delete all your files, navigate to <RouterLink to="/storage" class="text-[#808080]"><u>Storage</u></RouterLink>.</li>
                        <li class="mt-3">To check shared files and other resources, navigate to <RouterLink to="/shared" class="text-[#808080]"><u>Shared</u></RouterLink>.</li>
                    </ul>
                    <br/>
                    <u class="mb-4 text-lg">Storage</u>
                    <p>
                        Your storage usage is listed alongside the overall storage capacity.
                    </p>
                    <br/>
                    <u class="mb-4 text-lg">Legal Information</u>
                    <p class="mt-2">
                        <a href="/LICENSE" download="File share's License">Download Our <u  class="text-[#808080]">LICENSE</u></a><br/>
                        <span>Copywrite &copy; 2023. All rights reserved. </span>               
                    </p>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
