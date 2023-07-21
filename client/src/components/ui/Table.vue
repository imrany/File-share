<script lang="ts" setup>
 defineProps<{
    title: string
    files:any[]
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

            <tr v-for="(file, index) in files" :key="index">
                <td class="flex items-center">
                    <i class="icon pi pi-link text-3xl bg-gray-300 w-[30px] h-[35px]" v-if="!file.image"></i>
                    <img :src="file.image" :alt="file.filename" class="w-[40px] h-[40px]" v-else>
                    <p class="ml-1 font-semibold">{{file.filename}}</p>
                </td>
                <td>
                    <p class="font-semibold">{{file.type}}</p>
                </td>
                <td>
                    <p class="font-semibold">
                        <span v-if="file.sharedTo=='Just you'">
                            {{file.sharedTo}}
                        </span>
                        <span v-else>
                            <i class="icon pi pi-users mr-3"></i>
                            {{file.sharedTo}}
                        </span>
                    </p>
                </td>

                <td>
                    <p class="font-semibold">{{file.uploadedAt}}</p>
                </td>
            </tr>
        </table>
    </p>
</template>