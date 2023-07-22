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
            </ul>
        </div>
    </div>
</template>
