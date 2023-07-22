<script lang="ts" setup>
const title="Guide"
</script>
<template>
    <div class="flex flex-col">
        <p class="text-2xl">{{title}}</p>
        <div class="mt-4">
            <p class="text-black">We've listed out <code class="text-[#808080]">Shortcuts</code> and <code class="text-[#808080]">Keys</code> that may help you navigate and use this application.</p>
            <p>You can upload multiple images, audio, text, html, pdf and other documents.</p>
            <p>Upload video files less than <code class="text-[#808080]">48MB</code>.</p>
            <br/>
            <u class="mb-4 text-lg">File Shortcuts</u>
            <ul style="list-style-type: circle;" class="ml-4">
                <li class="mt-3">Click a file to open it.</li>
                <li class="mt-3">Ctrl + Click to select multiple files.</li>
                <li class="mt-3">Shift + Click to show the <code class="text-[#808080]">Delete modal</code>, then delete the file.</li>
                <li class="mt-3">To view all files, navigate to <RouterLink to="/" class="text-[#808080]"><u>All files</u></RouterLink>.</li>
                <li class="mt-3">To clear your storage or delete all your files, navigate to <RouterLink to="/storage" class="text-[#808080]"><u>Storage</u></RouterLink>.</li>
                <li class="mt-3">To check network, navigate to <RouterLink to="/network" class="text-[#808080]"><u>Network</u></RouterLink>.</li>
            </ul>
        </div>
    </div>
</template>
