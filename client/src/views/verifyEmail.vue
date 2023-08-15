<script lang="ts" setup>
    import { useToast } from 'vue-toast-notification';

    const toast=useToast()
    const handleVerify=async(e:any)=>{
        e.preventDefault()
        try {
            const code=e.target.code.value
            if(code.length!==6){
                toast.error("Must be a 6 letter code",{
                    duration:3000,
                    position:"top-right"
                })
            }else{

            }
        } catch (error:any) {
            console.log(error.message)
        }
    }
</script>
<template>
    <div class="flex flex-col bg-[#fffbf7] justify-center items-center h-[100vh]">
        <div class="flex flex-col justify-center items-center md:w-[350px] max-md:w-[80vw] ">
            <p class="text-2xl font-semibold mb-4 text-green-600">Enter verification code</p>
            <form class="my-3 flex flex-col w-full" @submit="handleVerify">
                <input type="number" name="code" maxlength="6" class="mt-2 h-[40px] border-gray-800 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#e9972c] py-2 px-4 placeholder:text-gray-900" minlength="6" placeholder="Enter the sent code" required/>
                <button class="font-semibold flex my-3 mt-6 justify-center items-center rounded-lg h-[40px]  bg-[#e9972c] text-white">
                    Verify
                </button>
            </form>
            <p class="text-sm text-gray-500">Enter the verification code sent to the email your previously entered.</p>
            <RouterLink class="text-[#e9972c] font-semibold mt-10" to="/signin">Log in instead?</RouterLink>
        </div>
    </div>
</template>
