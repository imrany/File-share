<script lang="ts" setup>
import LayoutGrid from "../components/LayoutGrid.vue"
import MobileNav from "../components/ui/MobileNav.vue";
const title="User manual"
</script>
<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex flex-col px-8 pb-8 pt-4 max-sm:text-sm">
                <MobileNav :title="title"/>
                <p class="text-2xl" id="storage-title">{{title}}</p>
                <div class="mt-16 lg:mt-4 ">
                    <p class="text-black">We've listed out <code class="text-[#808080]">Shortcuts</code> and <code class="text-[#808080]">Keys</code> that may help you navigate and use this application.</p>
                    <p>You can upload multiple images, audio, text, html, pdf and other documents.</p>
                    <p>Upload video files less than <code class="text-[#808080]">48MB</code>.</p>
                    <br/>
                    <u class="mb-4 text-lg max-sm:text-base">File Shortcuts</u>
                    <ul style="list-style-type: circle;" class="ml-4">
                        <li class="mt-3">Click on a file to open its file dialog.</li>
                        <li class="mt-3">Shift + Click to show the <code class="text-[#808080]">Delete modal</code>, then delete the file.</li>
                    </ul>  
                    <br/> 
                    <u class="mb-4 text-lg max-sm:text-base">Navigation Shortcuts</u>
                    <ul style="list-style-type: circle;" class="ml-4">
                        <li class="mt-3">To view all files, navigate to <RouterLink to="/home" class="text-[#808080]"><u>All files</u></RouterLink>.</li>
                        <li class="mt-3">To clear your storage or delete all your files, navigate to <RouterLink to="/storage" class="text-[#808080]"><u>Storage</u></RouterLink>.</li>
                        <li class="mt-3">To check shared files and other resources, navigate to <RouterLink to="/shared" class="text-[#808080]"><u>Shared</u></RouterLink>.</li>
                    </ul>
                    <br/>
                    <u class="mb-4 text-lg max-sm:text-base">Storage</u>
                    <p>
                        Your storage usage is listed alongside the overall storage capacity.
                    </p>
                    <br/>
                    <u class="mb-4 text-lg max-sm:text-base">Legal Information</u>
                    <p class="mt-2">
                        <a href="/LICENSE" download="File share's License">Download Our <u  class="text-[#808080]">LICENSE</u></a><br/>
                        <span>Copywrite &copy; 2023. All rights reserved. </span>               
                    </p>
                </div>
            </div>
        </template>
    </LayoutGrid>
</template>
