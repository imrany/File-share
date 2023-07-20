<script lang="ts" setup>
 defineProps<{
    title: string
 }>()
</script>

<template>
    <p class="mt-10 text-lg">
        All Files / <span class="text-gray-500">{{title}}</span>
        <table class="mt-5  w-full text-sm">
                <tr class="text-gray-500 border-collapse">
                    <th class="font-normal text-left">
                        Name
                    </th>

                    <th class="font-normal text-left">
                        | Type
                    </th>

                    <th class="font-normal text-left">
                        | Shared
                    </th>

                    <th class="font-normal text-left">
                        | Date of change
                    </th>
                </tr>

                <tr>
                    <td class="flex items-center">
                        <img src="@/assets/icons/folder.png" alt="folders" class="w-[40px] h-[40px]">
                        <p class="ml-1 font-semibold">Excel Checklist</p>
                    </td>
                    <td>
                        <p class="font-semibold">Folder</p>
                    </td>
                    <td>
                        <p class="font-semibold">Just you</p>
                    </td>

                    <td>
                        <p class="font-semibold">31/10/2023 - <span>22:19</span></p>
                    </td>
                </tr>

                <tr>
                    <td class="flex items-center">
                        <img src="@/assets/icons/pdf.png" alt="folders" class="w-[40px] h-[40px]">
                        <p class="ml-1 font-semibold">Art Club</p>
                    </td>
                    <td>
                        <p class="font-semibold">pdf</p>
                    </td>
                    <td>
                        <p class="font-semibold">Just you</p>
                    </td>

                    <td>
                        <p class="font-semibold">31/10/2023 - <span>22:19</span></p>
                    </td>
                </tr>

                <tr>
                    <td class="flex items-center">
                        <img src="@/assets/icons/txt.png" alt="folders" class="w-[40px] h-[40px]">
                        <p class="ml-1 font-semibold">Password</p>
                    </td>
                    <td>
                        <p class="font-semibold">Text</p>
                    </td>
                    <td>
                        <p class="font-semibold">Just you</p>
                    </td>

                    <td>
                        <p class="font-semibold">31/10/2023 - <span>22:19</span></p>
                    </td>
                </tr>

                <tr>
                    <td class="flex items-center">
                    <i class="icon pi pi-link text-3xl bg-gray-300 w-[30px] h-[35px]"></i>
                        <p class="ml-1 font-semibold">Campus-node.com</p>
                    </td>
                    <td>
                        <p class="font-semibold">Link</p>
                    </td>
                    <td>
                        <p class="font-semibold">Just you</p>
                    </td>

                    <td>
                        <p class="font-semibold">31/10/2023 - <span>22:19</span></p>
                    </td>
                </tr>
        </table>
    </p>
</template>