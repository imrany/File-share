<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const props=defineProps<{
    searchFunction:any
}>()

const router=useRouter()
const error =ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
    dialogElement.close()
};

const openMarco=()=>{
    const toast=document.getElementById('toast') as HTMLDivElement
    toast.style.transition='ease-in-out 1s'
    toast.style.transitionDelay='1s'
    toast.style.transitionDuration='2s'
    toast.style.display="flex"
}

async function handleSearch(e:any){
    e.preventDefault()
    try {
        dialog_close()
        let value:string=e.target.name.value
        if(value.includes('marco')||value.includes('Marco')){
            openMarco()
        }else{
            router.push(`?search_term=${value}`)
            props.searchFunction()
        }
    } catch (error:any) {
        error.value=error.message
    }
}
</script>

<template>
   <dialog id="search-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[83vw] h-fit text-[#808080] scale-[0.9] p-10 max-sm:px-2 max-sm:py-2">
        <button  class="ml-[auto] outline-none" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-red-500 text-center text-xl">{{error}}</p>
            <form class="flex flex-col items-center max-md:px-2 my-4" @submit="handleSearch">
                <input type="text" name="name" class="mt-2 border-gray-300 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-[#808080] w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="Search for a file" required/>
                <button class="mt-4 bg-black text-white w-fit px-5 py-2 flex text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="icon pi pi-search mr-3"></i>
                   <span>Search</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
