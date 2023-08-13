<script lang="ts" setup>
</script>
<template>
    <div class="flex flex-col justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4">Sign up to Fileshare</p>
            <form class="my-3 flex flex-col font-semibold w-full">
                <input type="text" name="username" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="John Doe" required/>
                <input type="email" name="email" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="johndoe@exampl.com" required/>
                <input type="password" name="password" class="mt-4 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="Password" required/>
                <input type="password" name="confirm_password" class="mt-4 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="confirm password" required/>
                <button class="flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-black text-white">
                    Create account
                </button>
            </form>
        </div>
    </div>
</template>
