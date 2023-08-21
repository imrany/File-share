<script lang="ts" setup>
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { useToast } from 'vue-toast-notification';

    const router=useRouter()
    const route=useRoute()
    const isLoading=ref(false)
    const wait=ref("")
    const toast=useToast()
    const handleVerify=async(e:any)=>{
        e.preventDefault()
        try {
            const code=e.target.code.value
            if(code.length!==6||code!==sessionStorage.getItem("code")){
                toast.error("Incorrect OTP code!",{
                    duration:3000,
                    position:"top-right"
                })
            }else if(code===sessionStorage.getItem("code")){
                isLoading.value=true
                wait.value="cursor-progress bg-gray-400"
                router.push(`/signup?email=${route.query.email}`)
            }
        } catch (error:any) {
            console.log(error.message)
        }
    }
    const checkInput=(e:any)=>{
        if(e.target.value.length!==6){
            isLoading.value=true
            wait.value="cursor-not-allowed"
        }else{
            isLoading.value=false
            wait.value="cursor-pointer"
        }
    }
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4 text-green-600">Enter verification code</p>
            <form class="my-3 flex flex-col w-full" @submit="handleVerify">
                <p class="max-md:text-xs text-sm text-slate-800">Enter OTP sent to {{route.query.email}}</p>
                <input type="number" @keyup="checkInput" name="code" maxlength="6" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" minlength="6" placeholder="Enter the sent code" required/>
                <div class="flex justify-between gap-2">
                    <button type="button" @click="router.push('/')" to="/" class="font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] w-[150px] border-[1px] border-gray-400 text-black">
                        Back
                    </button>
                    <button :class="wait" :disabled="isLoading" class="w-[150px] font-semibold flex my-3 mt-6 justify-center items-center rounded-[50px] h-[40px] max-sm:w-[130px] bg-[#e9972c] text-white">
                        Next
                    </button>
                </div>
            </form>
            <p class="text-sm max-md:text-xs text-gray-500">Enter the verification code sent to the email your previously entered.</p>
            <RouterLink class="text-[#e9972c] font-semibold mt-10" to="/signin">Log in instead?</RouterLink>
        </div>
    </div>
</template>
