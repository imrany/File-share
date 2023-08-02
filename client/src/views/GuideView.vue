<script lang="ts" setup>
const title="Guide"
</script>
<template>
    <div class="flex flex-col px-8 pt-4">
        <p class="text-2xl">{{title}}</p>
        <div class="mt-4">
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
        </div>
    </div>
</template>
