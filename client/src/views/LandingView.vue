<script lang="ts" setup>
</script>
<template>
    <div class="bg-[#0e0e0e] flex" id="landing_page">
        <div class="bg-[url('../assets/images/landingpage.png')] bg-no-repeat bg-center bg-cover w-[40vw]">
            <div class="flex px-20 py-14 font-semibold">
                <RouterLink to="/" class="mx-2">Features</RouterLink>
                <RouterLink to="/" class="mx-10">Pricing</RouterLink>
                <RouterLink to="/" class="mx-2">About</RouterLink>
            </div>
        </div>

        <div class="text-white pt-11 px-20 pb-14 w-full">
            <div class="flex justify-between items-center font-semibold">
                <p class="text-2xl">Fileshare</p>
                <RouterLink to="/signin" class="text-black w-[140px] h-[50px] flex justify-center items-center bg-[#eba953]">Sign in</RouterLink>
            </div>

            <div class="flex flex-col ml-20">
                <p class="font-bold text-7xl w-[500px] my-10" style="line-height:80px;">
                    Increasing the value of your storage.
                </p>
                <p class="w-[400px] mb-10">
                    We offer a faster way of sharing your files and document to your multiple receiptent.
                    Plus you will be able to store them, its secured and safe.
                </p> 

                <div class="flex justify-between items-center w-[30vw]">
                    <button class="text-black w-[150px] h-[50px] flex justify-center items-center bg-[#eba953] font-semibold">Get Started</button>
                    <button class="w-[150px] h-[50px] flex justify-center items-center border-[1px] border-[#eba953] font-semibold text-[#eba953]">Install Fileshare</button>
                </div>
                 <div class="flex justify-between items-center mt-8 w-[35vw]">
                    <div class="flex flex-col">
                        <p class="font-bold text-4xl text-[#e9972c]">3.0M</p>
                        <p class="mt-5 text-sm w-[200px]">
                            Our peers are happy utilizing our services.
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="font-bold text-4xl text-[#eba953]">90 free</p>
                        <p class="mt-5 text-sm w-[200px]">The initial 90 days are provided to you without charges.</p>
                    </div>
                 </div>
            </div>
        </div>
    </div>
</template>
