<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
    import indexedDB from "../indexedDB"
    import image1 from "@/assets/icons/folder.png"
    import image2 from "@/assets/icons/pdf.png"
    import image3 from "@/assets/icons/jpeg.png"
    import image4 from "@/assets/icons/egg.png"
    import image5 from "@/assets/icons/txt.png"
    import UploadDialog from "../components/ui/Dialog/Upload.vue"
    import CreateDialog from "../components/ui/Dialog/CreateFolder.vue"
    import { ref } from "vue"

    const error=ref("")
    function upload_open(){
        const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function create_open(){
        const dialogElement=document.getElementById("create-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }

    indexedDB().then((db:any)=>{
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const getFiles=fileStore.getAll()

        getFiles.onsuccess=()=>{
            if (getFiles.result.length!==0){

            }else{
                error.value="Your storage is empty, please upload a file."
                upload_open()
            }
        }
        getFiles.onerror=()=>{
            console.log("error",getFiles.result)
        }
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
    const header="Recent files"
    let recent_files=ref(files.slice(0,6))
    let search_results=[]

    const handleSearch=(e:any)=>{
        recent_files.value=files.slice(0,6)
        search_results.pop()
       
        const terms=`${e.target.value.slice(0,1).toUpperCase()}${e.target.value.slice(1,e.target.value.length)}`
        recent_files.value.forEach((item:any)=>{
        const search_term=item.filename.match(terms)
            if(search_term){
                search_results.push(item)
                recent_files.value=search_results
            }
        })
    }
</script>


<template>
    <div class="flex justify-between mb-5 pb-5 border-b-[1px] border-gray-200">
        <div class="flex items-center">
            <i class="icon pi pi-search mr-3"></i>
            <input type="text" name="search" id="search" class="focus:outline-0 w-[30vw]" @change="handleSearch" placeholder="Search in all files">
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

    <p class="text-lg">{{header}}</p>
    <div class="flex justify-between my-4">
        <div class="rounded-lg border-gray-100 border-2 p-4 h-fit" v-for="(file,id) in recent_files" :key="id">
            <i class="icon pi pi-link text-8xl text-center px-4 w-[80px] h-[80px]" v-if="!file.image"></i>
            <img :src="file.image" :alt="file.filename" class="w-[100px] h-[100px]" v-else>
            <p class="text-center text-gray-700" v-if="file.type=='Link'" :title="file.filename">{{file.filename.slice(0,8)}}..{{file.filename.slice(11,file.filename.lenght)}}</p>
            <p class="text-center text-gray-700" v-else>{{file.filename}}</p>
        </div>
    </div>

    <Table title="recent" :files="files"/>

    <Footer/>
    <UploadDialog :error="error"/>
    <CreateDialog/>
</template>
