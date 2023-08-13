<script lang="ts" setup>

</script>
<template>
    <div class="flex flex-col justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4">Enter verification code</p>
            <form class="my-3 flex flex-col w-full">
                <input type="email" name="email" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" placeholder="Enter your work email" required/>
                <button class="font-semibold flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-[#e9972c] text-white">
                    Submit
                </button>
            </form>
            <p class="text-sm text-gray-500">Enter the verification code sent to the email your previously entered.</p>
            <RouterLink class="text-[#e9972c] font-semibold mt-10" to="/signin">Log in instead?</RouterLink>
        </div>
    </div>
</template>
