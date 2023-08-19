<script lang="ts" setup>
import {useRouter} from "vue-router"
import VerifyDialog from "../components/ui/Dialog/verifyEmail.vue" 

const router=useRouter()
const open_verify_dialog=()=>{
    const dialogElement=document.getElementById("verify-dialog") as HTMLDialogElement
    dialogElement.showModal()
}
const year=new Date().getFullYear()
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7]" id="landing_page">
        <div class="bg-[#0e0e0e] bg-[url('./images/palm2.svg')] bg-no-repeat  text-white pt-11 sm:px-20 max-sm:px-6 pb-16 w-full">
            <div class="flex justify-between items-center font-semibold">
                <div class="flex">
                    <img src="/favicon.png" class="w-[33px] h-[35px]" alt="."/>
                    <p class="text-2xl ml-2">Fileshare</p>
                </div>
                <RouterLink to="/signin" class="text-black md:w-[140px] max-md:w-[80px] max-md:text-sm max-md:h-[40px] max-md:rounded-[5px] h-[50px] flex justify-center items-center bg-[#eba953]">Sign in</RouterLink>
            </div>

            <div class="flex flex-col ">
                <div class="lg:flex gap-x-4 lg:py-10">
                    <p class="font-bold text-7xl max-md:text-4xl md:w-[680px] my-10 md:leading-[80px]">
                        Manage and share your files with friends.
                    </p>
                    <div class="lg:mt-24">
                        <p class="md:w-[450px] mb-10 max-sm:text-sm">
                            We offer a faster way of sharing your files and document with your family and friends.
                            Plus you will be able to store them, its secured and safe.
                        </p> 

                        <div class="flex justify-between items-center md:w-[35vw] max-md:w-[70vw] max-sm:w-[80vw]">
                            <button class="md:w-[150px] max-md:w-[120px] max-md:text-sm max-md:h-[40px] max-md:rounded-[5px] text-black h-[50px] flex justify-center items-center bg-[#eba953] font-semibold" @click="open_verify_dialog">Get Started</button>
                            <button class="md:w-[155px] max-md:w-[120px] max-md:text-sm max-md:h-[40px] max-md:rounded-[5px] h-[50px] flex justify-center items-center border-[1px] border-[#eba953] font-semibold text-[#eba953]"><i class="mr-2 icon pi pi-download"></i> Install app</button>
                        </div>
                        <div class="flex gap-4 justify-between items-center mt-8 w-[38vw] max-md:w-[76vw] max-sm:w-[90vw]">
                            <div class="flex flex-col">
                                <p class="font-bold text-4xl max-sm:text-3xl text-[#e9972c]">3.0M</p>
                                <p class="mt-5 text-sm sm:w-[150px] ">
                                    Share your files with your peers.
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
        <div class="flex flex-col items-center justify-center p-10">
            <p class="text-5xl font-semibold text-[#eba953]">Fileshare</p>
            <div style="line-height:25px;" class="mt-6 grid lg:grid-cols-3 gap-10 md:grid-cols-2 max-md:grid-cols-1 text-base text-gray-700 ">
               <div class="">
                    <span class="text-[#eba953]">Fileshare</span> is a platform that enable you store and share your files
                    with friends, collegues, classmates and family. You will be able to store your files on your browser once your upload and retreive them when you want them,
                    Basically you would be in controll of your files.
               </div>
               <div class="">
                    <span class="text-[#eba953]">Fileshare</span> is a platform that enable you store and share your files
                    with friends, collegues, classmates and family. You will be able to store your files on your browser once your upload and retreive them when you want them,
                    Basically you would be in controll of your files.
               </div>
               <div class="">
                    <span class="text-[#eba953]">Fileshare</span> is a platform that enable you store and share your files
                    with friends, collegues, classmates and family. You will be able to store your files on your browser once your upload and retreive them when you want them,
                    Basically you would be in controll of your files.
               </div>
            </div>
        </div>

        <footer class="flex max-md:flex-col p-10 mt-10 text-white md:justify-between  md:items-center bg-orange-400">
            <div class="">
                <p class="text-2xl font-semibold"><i class="icon pi pi-link mr-1"></i>Quick links</p>
                <ul class="my-3">
                    <li>
                        <RouterLink to="/signup" title="Sign up to Fileshare">Get Started</RouterLink>
                    </li>
                     <li class="mt-1">
                        <RouterLink to="/signin" title="Sign in to Fileshare">Sign in</RouterLink>
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
        <div class="flex items-center justify-center">
            &copy; copyright {{year}}. All rights reserved
        </div>
        <VerifyDialog/>
    </div>
</template>
