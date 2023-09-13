<script lang="ts" setup>
import { onMounted } from "vue"
import {useRouter} from "vue-router"
import { install_function } from ".."

const router=useRouter()
const year=new Date().getFullYear()
onMounted(()=>{
    install_function()
})
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7]" id="landing_page">
        <div class="bg-[url('./images/share.gif')] max-md:pt-5 bg-no-repeat bg-contain bg-white pt-2 sm:px-20 max-sm:px-6 pb-16 w-full">
            <div class="flex justify-between items-center font-semibold">
                <div class="flex items-center">
                    <img src="/favicon.png" class="w-[30px] h-[35px]" alt="."/>
                    <p class="text-2xl max-md:text-xl ml-2">Wekafile</p>
                </div>
                <RouterLink to="/signin" class="text-black md:w-[140px] max-md:w-[100px] max-md:text-sm max-md:h-[40px] h-[50px] rounded-[30px] transition-all shadow-sm hover:rounded-[10px] flex justify-center items-center bg-[#eba953]">Sign in</RouterLink>
            </div>

            <div class="flex flex-col">
                <div class="lg:flex gap-x-4 lg:py-10">
                    <p class="font-bold text-7xl max-md:text-4xl md:w-[680px] my-10 md:leading-[80px]">
                        Manage and share your files with friends.
                    </p>
                    <div class="lg:mt-24">
                        <p class="md:w-[450px] mb-10 max-sm:text-base text-lg">
                            Would you like to share, back up secured files away from your device?. 
                             Wekafile is cloud storage and a sharing company that offers an affordable means of storing and sharing files among people.
                        </p> 

                        <div class="flex justify-between items-center md:w-[35vw] max-md:w-[70vw] max-sm:w-[80vw]">
                            <button class="md:w-[150px] max-md:w-[120px] max-md:text-sm max-md:h-[40px] text-black h-[50px]  rounded-[30px] transition-all shadow-sm hover:rounded-[10px] flex justify-center items-center bg-[#eba953] font-semibold" @click="router.push('/choose')">Try it now</button>
                            <button class="md:w-[155px] max-md:w-[120px] rounded-[30px] transition-all shadow-sm hover:rounded-[10px] max-md:text-sm max-md:h-[40px] h-[50px] flex justify-center items-center border-[1px] border-[#eba953] font-semibold text-[#eba953]" id="install" style="display:none;"><i class="mr-2 icon pi pi-download"></i> Install app</button>
                        </div>
                        <div class="flex gap-4 justify-between items-center mt-8 w-[38vw] max-md:w-[76vw] max-sm:w-[90vw]">
                            <div class="flex flex-col">
                                <p class="font-bold text-4xl max-sm:text-3xl text-[#e9972c]">3.0M</p>
                                <p class="mt-5 text-sm sm:w-[150px] ">
                                    Try it for free and upgrade per your choice.
                                </p>
                            </div>
                            <div class="flex flex-col">
                                <p class="font-bold text-4xl max-sm:text-3xl text-[#e9972c]">Easy</p>
                                <p class="mt-5 text-sm sm:w-[150px]">
                                    Easy to use and friendly.
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
                    <RouterLink to="/signup" class="text-lg max-md:text-sm font-normal underline text-orange-400">Get started now</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>Create groups and collaborate with your colleagues.</p>
                    <RouterLink to="/signup_group" class="text-lg max-md:text-sm font-normal underline text-green-400">Get started with groups</RouterLink>
               </div>
               <div class="text-2xl max-md:text-lg md:font-semibold">
                    <p>It's secured, safe and easy to use.</p>
                    <RouterLink to="" class="text-lg max-md:text-sm font-normal underline">Learn more</RouterLink>
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

        <footer class="flex max-md:flex-col p-10 mt-10 text-white md:justify-between  md:items-center bg-orange-400">
            <div class="">
                <p class="text-2xl font-semibold"><i class="icon pi pi-link mr-1"></i>Quick links</p>
                <ul class="my-3">
                    <li>
                        <RouterLink to="/signup" title="Sign up to Wekafile">Get Started</RouterLink>
                    </li>
                     <li class="mt-1">
                        <RouterLink to="/signin" title="Sign in to Wekafile">Sign in</RouterLink>
                    </li>
                     <li class="mt-2">
                        <RouterLink to="/upgrade" title="Upgrade your account">Upgrade</RouterLink>
                    </li>
                     <li class="mt-2">
                        <RouterLink to="/guide" title="Upgrade your account">Terms and conditions</RouterLink>
                    </li>
                </ul>
            </div>
            <div class="max-md:mt-6">
                <p class="text-2xl font-semibold"><i class="icon pi pi-globe text-xl mr-1"></i> Social Media links</p>
                <ul class="my-3">
                    <li>
                        <a href="https://twitter.com/matano_imran" target="_blank" class="flex">
                            <i class="icon pi pi-twitter text-base mr-1"></i>
                            <span>matano_imran</span>
                        </a>
                    </li>
                     <li class="mt-1">
                        <a href="https://www.linkedin.com/in/imranmatano/" target="_blank" class="flex">
                            <i class="icon pi pi-linkedin text-base mr-1"></i>
                            <span>imranmatano</span>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="https://instagram.com/imrany00" target="_blank" class="flex">
                            <i class="icon pi pi-instagram text-base mr-1"></i>
                            <span>imran</span>
                        </a>
                    </li>
                     <li class="mt-2">
                         <a mailto="imranmat254@gmail.com" target="_blank" class="flex">
                            <i class="icon pi pi-google text-base mr-1"></i>
                            <span>mail</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div class="max-md:mt-6">
                <p class="text-2xl font-semibold"><i class="icon pi pi-comment text-xl mr-1"></i>Help Center</p>
                <ul class="my-3">
                    <li>
                        <a tel="+254734720752" target="_blank" class="flex">
                            <i class="icon pi pi-phone text-base mr-1"></i>
                            <span>Call us at +254734720752</span>
                        </a>
                    </li>
                     <li class="mt-1">
                        <a mailto="imranmat254@gmail.com" target="_blank" class="flex">
                            <i class="icon pi pi-envelope text-base mr-1"></i>
                            <span>Email us</span>
                        </a>
                    </li>
                     <li class="mt-1">
                        <a href="https://wa.me/254734720752" target="_blank" class="flex">
                            <i class="icon pi pi-whatsapp text-base mr-1"></i>
                            <span>Text us</span>
                        </a>
                    </li>
                    <li class="mt-1">
                        <a href="https://twitter.com/matano_imran" target="_blank" class="flex">
                            <i class="icon pi pi-twitter text-base mr-1"></i>
                            <span>Text us</span>
                        </a>
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
