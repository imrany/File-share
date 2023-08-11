<script lang="ts" setup>
</script>
<template>
    <div class="flex flex-col justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4">Sign in to Fileshare</p>
            <button class="flex font-semibold  my-3 justify-center items-center rounded-lg h-[40px] w-[350px] max-md:w-[80vw]  border-[1px] border-purple-800">
                <i class="icon pi pi-google text-blue-500 mr-2"></i> 
                Continue with Google
            </button>
            <p>or</p>
            <form class="my-3 flex flex-col font-semibold w-full">
                <input type="email" name="email" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="Email" required/>
                <input type="password" name="password" class="mt-4 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-purple-800 py-2 px-4 placeholder:text-sm placeholder:text-gray-500 text-sm" placeholder="Password" required/>
                <button class="flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-black text-white">
                    Sign in
                </button>
            </form>
            <RouterLink class="text-purple-800" to="/signup">Create an account instead?</RouterLink>
        </div>
    </div>
</template>
