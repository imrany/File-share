<script lang="ts" setup>
import { onMounted } from "vue"
import {useRouter} from "vue-router"
import { install_function } from ".."

const router=useRouter()
const year=new Date().getFullYear()
onMounted(()=>{
    install_function()
    openWelcomeToast()
})

const openWelcomeToast=()=>{
    setTimeout(()=>{
        const welcome_toast=document.getElementById('toast') as HTMLDivElement
        welcome_toast.style.transition='ease-in-out 1s'
        welcome_toast.style.transitionDelay='1s'
        welcome_toast.style.transitionDuration='2s'
        welcome_toast.style.display="flex"
    },4000)
}
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7]" id="landing_page">
        <div class="bg-[url('./images/share.gif')] max-md:pt-5 bg-no-repeat bg-contain bg-white pb-16 w-full">
            <div class="flex sm:px-20 max-sm:px-6 py-2 justify-between items-center">
                <div class="flex items-center font-semibold">
                    <img src="/favicon.png" class="w-[30px] h-[35px]" alt="."/>
                    <p class="text-2xl max-md:text-xl ml-2 text-gray-800">Wekafile</p>
                </div>
                <RouterLink to="/signin" class="text-gray-100 md:w-[120px] max-md:w-[100px] text-sm h-[40px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-[#eba953]">Sign in</RouterLink>
            </div>

            <div class="flex flex-col sm:px-20 max-sm:px-6">
                <div class="lg:flex gap-x-4 lg:py-10">
                    <p class=" text-gray-800 font-bold text-7xl max-md:text-4xl md:w-[680px] my-10 md:leading-[80px]">
                        Manage and share files with Wekafile.
                    </p>
                    <div class="lg:mt-24 sm:mt-28">
                        <p class="md:w-[450px] mb-6 text-base text-gray-700">
                            Wekafile is cloud storage and a sharing company that offers an affordable means of storing and sharing files.
                            We are committed to provide suitable means of storing, backing and sharing files.
                            Get started today and take levarage of great our services.
                        </p> 

                        <div class="flex justify-between items-center md:w-[35vw] max-md:w-[70vw] max-sm:w-[80vw]">
                            <button class="text-gray-100 md:w-[120px] max-md:w-[100px] text-sm h-[40px] rounded-[5px] transition-all shadow-sm flex justify-center items-center bg-[#eba953]" @click="router.push('/get_verified')">Get started</button>
                            <button class="md:w-[120px] max-md:w-[100px] text-sm h-[40px] rounded-[5px] transition-all shadow-sm flex justify-center items-center border-[1px] border-[#eba953] text-[#eba953]" style="display:none;" id="install" ><i class="mr-2 icon pi pi-download"></i> Install app</button>
                        </div>
                        <div class="flex gap-5 text-gray-700 justify-between items-center mt-8 w-[38vw] max-md:w-[76vw] max-sm:w-[90vw]">
                            <div class="flex flex-col">
                                <p class="font-bold text-2xl text-[#e9972c]">Free trial</p>
                                <p class="mt-1 text-sm">
                                    Get started for free and upgrade per your choice.
                                </p>
                            </div>
                            <div class="flex flex-col">
                                <p class="font-bold text-2xl text-[#e9972c]">Easy</p>
                                <p class="mt-1 text-sm">
                                    Friendly and easy to use.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="flex flex-col items-center justify-center p-10 max-md:border-b-[1px]">
            <div style="line-height:25px;" class="mt-6 grid lg:grid-cols-3 gap-10 md:grid-cols-2 max-md:grid-cols-1 text-base text-gray-700 ">
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Get an account and get a more personalized experience.</p>
                    <RouterLink to="/get_verified" class="text-lg max-md:text-sm font-normal underline text-orange-400">Get started now</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Create groups and collaborate with your colleagues.</p>
                    <RouterLink to="/" class="text-lg max-md:text-sm font-normal underline text-green-400">Learn more</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>It's secured, safe and easy to use.</p>
                    <RouterLink to="/" class="text-lg max-md:text-sm font-normal underline">Learn more</RouterLink>
               </div>
            </div>
        </div>

        <div class="flex flex-col items-center justify-center p-10">
            <div style="line-height:25px;" class="mt-6 grid lg:grid-cols-3 gap-10 md:grid-cols-2 max-md:grid-cols-1 text-base text-gray-700 ">
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Store, retrieve and share your files to multiple recepients.</p>
                    <RouterLink to="" class="text-lg max-md:text-sm font-normal underline">Learn more</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Get and purchase cloud storage at afordable prices.</p>
                    <RouterLink to="" class="text-lg max-md:text-sm font-normal underline">Learn more</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Works offline and has great performance.</p>
                    <RouterLink to="" class="text-lg max-md:text-sm font-normal underline">Learn more</RouterLink>
               </div>
            </div>
        </div>

        <footer class="flex max-md:flex-col p-10 mt-10 text-gray-100 md:justify-between  md:items-center bg-orange-400">
            <div class="">
                <p class="text-2xl font-semibold"><i class="icon pi pi-link mr-1"></i>Quick links</p>
                <ul class="my-3">
                    <li>
                        <RouterLink to="/signup" title="Sign up to Wekafile">Get Started</RouterLink>
                    </li>
                    <li class="mt-1">
                        <RouterLink to="/signin" title="Sign in to Wekafile">Sign in</RouterLink>
                    </li>
                    <li class="mt-1">
                        <RouterLink to="/signin" title="Sign in to Wekafile">Upgrade</RouterLink>
                    </li>
                     <li class="mt-2">
                        <RouterLink to="/guide" title="Upgrade your account">Terms and conditions</RouterLink>
                    </li>
                </ul>
            </div>

            <div class="my-3 max-md:flex max-md:justify-center max-md:items-center">
                <a href="https://twitter.com/matano_imran" target="_blank" class="flex">
                    <i class="icon pi pi-twitter text-base hover:bg-gray-100 text-black w-[30px] rounded-md flex items-center justify-center h-[30px]"></i> 
                </a>
                <a href="https://www.linkedin.com/in/imranmatano/" target="_blank" class="hover:bg-gray-100 my-1 text-black w-[30px] rounded-md flex items-center justify-center h-[30px]">
                    <i class="icon pi pi-linkedin text-base"></i> 
                </a>
                <a href="https://instagram.com/imrany00" target="_blank" class="hover:bg-gray-100 text-black w-[30px] rounded-md flex items-center justify-center h-[30px]">
                    <i class="icon pi pi-instagram text-base"></i> 
                </a>
                <a mailto="imranmat254@gmail.com" target="_blank" class="hover:bg-gray-100 my-1 text-black w-[30px] rounded-md flex items-center justify-center h-[30px]">
                    <i class="icon pi pi-google text-base"></i> 
                </a>
                <a href="https://wa.me/254734720752" target="_blank" class="hover:bg-gray-100 my-1 text-black w-[30px] rounded-md flex items-center justify-center h-[30px]">
                    <i class="icon pi pi-whatsapp text-base"></i> 
                </a>
            </div>
        </footer>
        <div class="flex items-center text-sm max-sm:text-xs justify-center">
            &copy; copyright {{year}}. All rights reserved
        </div>
    </div>
</template>
