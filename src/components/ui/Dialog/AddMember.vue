<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router=useRouter()
const error =ref("")
const dialog_close=()=>{
    const dialogElement=document.getElementById("add-member-dialog") as HTMLDialogElement
    dialogElement.close()
};

async function handleAdd(e:any){
    e.preventDefault()
    try {
        router.push(`?search_term=${e.target.name.value}`)
    } catch (error:any) {
        error.value=error.message
    }
}
</script>

<template>
   <dialog id="add-member-dialog" class="shadow-lg rounded-md flex flex-col lg:w-[35vw] max-md:w-[80vw] max-sm:w-[75vw] h-fit text-[#808080] scale-[0.9] p-10">
        <button  class="ml-[auto]" @click="dialog_close">
            <i class="icon pi pi-times text-lg hover:text-[#F45858]"></i>
        </button>
        <div class="flex flex-col w-full">
            <p class="text-red-500 text-center text-xl max-md:text-lg max-sm:text-sm">{{error}}</p>
            <form class="flex flex-col items-center max-sm:text-xs my-4" @submit="handleAdd">
                <p class="text-xl max-md:text-lg mb-1 max-sm:text-sm">Add a member to you group</p>
                <input type="text" name="name" class="mt-2 border-green-400 border-[1px] bg-white rounded-lg focus:outline-1 focus:outline-green-400 w-[100%] py-2 px-4 placeholder:text-sm text-sm" placeholder="member@example.com" required/>
                <button class="mt-4 bg-green-400 text-white w-fit px-5 py-2 flex justify-center items-center text-sm h-fit  cursor-pointer rounded-[5px]">
                    <i class="icon pi pi-plus mr-3"></i>
                   <span>Add member</span>
                </button>
            </form>
        </div>
    </dialog>
</template>
