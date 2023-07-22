<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
    import indexedDB from "../indexedDB"
    import music from "@/assets/icons/music.png"
    import pdf from "@/assets/icons/pdf.png"
    import video from "@/assets/icons/video.png"
    import image3 from "@/assets/icons/jpeg.png"
    import image5 from "@/assets/icons/txt.png"
    import UploadDialog from "../components/ui/Dialog/Upload.vue"
    import CreateDialog from "../components/ui/Dialog/CreateFolder.vue"
    import { onMounted, ref } from "vue"
    import { useRouter } from "vue-router"

    const router=useRouter()
    const error=ref("")
    const files=ref([])
    let recent_files=ref()
    function upload_open(){
        const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function create_open(){
        const dialogElement=document.getElementById("create-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function open_delete_dialog(filename:string){
       router.push(`/delete/${filename}`)
    }

    function open_file(url:any,e:any,filename:string){
        if(e.shiftKey){
            open_delete_dialog(filename)
        }else if(e.ctrlKey){
            alert("selected")
        }else{
            let aDom = document.createElement('a')
            if(aDom){
                aDom.target="_blank"
                aDom.href = url
                aDom.click()
            }
        }
    }
    const fetchFiles=async()=>{
        try {
            const request=await indexedDB()
            const db:any=await request
             const transaction=db.transaction("All_files","readwrite")
            const fileStore=transaction.objectStore("All_files")
            const getFiles=fileStore.getAll()

            getFiles.onsuccess=()=>{
                if (getFiles.result.length!==0){
                    files.value=getFiles.result
                    recent_files.value=files.value.slice(0,5)
                }else{
                    error.value="Your storage is empty, please upload a file."
                    upload_open()
                }
            }
            getFiles.onerror=()=>{
                console.log("error",getFiles.result)
            }
        } catch (error) {
             console.log(error)
        }
    }
    
    onMounted(()=>{
        fetchFiles()
    })

    const header="Recent files"
    let search_results=[]
    const handleSearch=(e:any)=>{
        recent_files.value=files.value.slice(0,6)
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

    function convert(file:any){
        let url =URL.createObjectURL(file)
        return url      
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
    <div class="flex my-4">
        <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="cursor-pointer rounded-lg ml-4 border-gray-100 border-2 py-4 h-fit" v-for="(file,id) in recent_files" :key="id">
            <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[120px] mx-10 h-[120px] rounded-sm">
            <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[120px] mx-10 h-[120px] rounded-sm">
            <img :src="video" :alt="file.filename" :title="file.filename" v-if="file.type.includes('video')" class="w-[120px] mx-10 h-[120px] rounded-sm">
            <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[120px] mx-10 h-[120px] rounded-sm"  v-if="file.type.includes('image')">
            <p class="text-center text-gray-700">{{file.filename.slice(0,20)}}</p>
        </div>
    </div>

    <Table title="recent" :files="files"/>

    <Footer/>
    <UploadDialog :error="error"/>
    <CreateDialog/>
</template>
