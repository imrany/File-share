<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
    import indexedDB from "../indexedDB"
    import image1 from "@/assets/icons/folder.png"
    import image2 from "@/assets/icons/pdf.png"
    import image3 from "@/assets/icons/jpeg.png"
    import image4 from "@/assets/icons/egg.png"
    import image5 from "@/assets/icons/txt.png"

    function upload_open(){
        const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function create_open(){
        const dialogElement=document.getElementById("create-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }

    indexedDB().then((db)=>{
       console.log(db)
    }).catch((err)=>{
        console.log(err)
    })

    const files=[
        {
            image:image1,
            filename:"Excel Checklist",
            size:"",
            uploadedAt:"",
            path:"",
            type:"Folder",
            sharedTo:"Just you"
        },
        {
           image:image2,
            filename:"Art club",
            size:"",
            uploadedAt:"",
            path:"",
            type:"Pdf",
            sharedTo:"6 people"  
        },
        {
           image:image3,
            filename:"Nike_logo",
            size:"",
            uploadedAt:"",
            path:"",
            type:"Jpeg",
            sharedTo:"10 people"  
        },
        {
           image:image4,
            filename:"Summer fotos",
            size:"",
            uploadedAt:"",
            path:"",
            type:"Images",
            sharedTo:"5 people"  
        },
        {
           image:image5,
            filename:"Password",
            size:"",
            uploadedAt:"",
            path:"",
            type:"Text",
            sharedTo:"15 people"  
        },
        {
            filename:"Campus-blogs.com",
            size:"",
            uploadedAt:"31/10/2023 - 22:19",
            path:"",
            type:"Link",
            sharedTo:"Just you"  
        }
    ]
</script>


<template>
    <div class="flex justify-between mb-5 pb-5 border-b-[1px] border-gray-200">
        <div class="flex items-center">
            <i class="icon pi pi-search mr-3"></i>
            <input type="text" name="search" id="search" class="focus:outline-0 w-[30vw]" placeholder="Search in all files">
        </div>

        <div class="flex">
            <button class="hover:bg-black hover:text-white w-fit px-5 py-2 flex text-sm h-fit bg-gray-200 cursor-pointer rounded-[5px] mr-3" @click="create_open">
                <i class="icon pi pi-plus mt-1 mr-3"></i> <span>Create a folder</span>
            </button>

            <button class="hover:bg-black hover:text-white w-fit px-5 py-2 flex text-sm h-fit bg-gray-200 cursor-pointer rounded-[5px]" @click="upload_open">
                <i class="icon pi pi-upload mr-3"></i> <span>Upload</span>
            </button>
        </div>
    </div>

    <p class="text-lg">Recent files</p>
    <div class="flex justify-between my-4">
        <div class="rounded-lg border-gray-100 border-2 p-4 h-fit" v-for="(file,id) in files" :key="id">
            <img :src="file.image" :alt="file.filename" class="w-[100px] h-[100px]">
            <p class="text-center text-gray-700">{{file.filename}}</p>
        </div>
    </div>

    <Table title="recent" :files="files"/>

    <Footer/>
   
</template>
