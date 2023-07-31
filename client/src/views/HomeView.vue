<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
    import indexedDB from "../indexedDB"
    import music from "@/assets/icons/music.png"
    import pdf from "@/assets/icons/pdf.png"
    import video from "@/assets/icons/video.png"
    import text from "@/assets/icons/txt.png"
    import html from "@/assets/icons/html.png"
    import profile from "@/assets/images/profile.png"
    import UploadDialog from "../components/ui/Dialog/Upload.vue"
    import CreateDialog from "../components/ui/Dialog/CreateFolder.vue"
    import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"
    import { onMounted, ref } from "vue"
    import { useRouter, useRoute } from "vue-router"

    const router=useRouter()
    const route=useRoute()
    const capacity=ref("")
    const error=ref("")
    const files=ref([])
    const select_value=ref("")
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
        const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
        router.push(`?filename=${filename}`)
        dialogElement.showModal()
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
        storage()
    })

    const header="All Files"
    let search_results:any=[]
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

    function storage(){
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then((data:any) => {
            let kbs=(x:number)=>x/1000
            let mbs=(x:number)=>x/1000000
            let gbs=(x:number)=>x/1000000000
            if(data.usage<1000){
                capacity.value=`${data.usage} bytes/${Math.round(gbs(data.quota))} Gb`;
            }else if(data.usage<1000000){
                capacity.value=`${Math.round(kbs(data.usage))} Kb/${Math.round(gbs(data.quota))} Gb`;
            }else if(data.usage<1000000000){
                capacity.value=`${Math.round(mbs(data.usage))} Mb/${Math.round(gbs(data.quota))} Gb`;
            }else if(data.usage>1000000000){
                capacity.value=`${Math.round(gbs(data.usage))} Gb/${Math.round(gbs(data.quota))} Gb`;
            }
            });
        }
    } 

    const handleSelect=()=>{
        alert(select_value.value)
    }

    function convert_size(size:number){
        let storage
        if (size>1000000) {
            const mb=Math.round(size/1000000)
            storage=`${mb} Mb`
        } else if(size>1000000000) {
             const gb=Math.round(size/1000000000)
            storage=`${gb} Gb`
        }else{
            const byte=Math.round(size/1000)
            storage=`${byte} bytes`
        }
        return storage
    }
</script>


<template>
    <div class="flex justify-between mb-5 px-8 py-5 border-b-[1px] bg-white border-gray-100" id="nav">
        <div class="flex items-center">
            <button class="flex justify-center items-center" @click="upload_open">
                <div class="w-[38px] h-[38px] text-xs flex justify-center items-center transition-all hover:bg-purple-800 bg-gray-100 rounded-[50px]  mr-3">
                    <i class="icon pi pi-plus w-[20px] h-[20px] text-xs flex justify-center items-center bg-purple-800 rounded-[50px] text-white"></i>
                </div>
                <p class="font-semibold">
                    Add File
                </p>
            </button>
        </div>

        <div class="flex">
            <button class="w-fit px-5 py-2 flex text-sm font-semibold h-fit border-[1px] rounded-[20px] cursor-pointer mr-3" @click="create_open">
                <span class="text-purple-800 flex mr-2">
                    <i class="icon pi pi-th-large mt-[3px] mr-2"></i> 
                    <p>{{capacity}}</p>
                </span>
                <span>Storage usage</span>
            </button>

            <button class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                <i class="icon pi pi-cog text-base"></i> 
            </button>

            <button class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                <i class="icon pi pi-bell text-base"></i> 
            </button>

            <img :src="profile" alt="." class="w-[35px] h-[35px] rounded-[50px]">
        </div>
    </div>

    <div class="px-8">
        <div class="flex justify-between">
            <div class="">
                <p class="max-md:text-lg text-2xl font-semibold">{{header}}</p>
                <div class="text-gray-500 text-sm mt-2 flex">
                    <p>Sort by: </p>
                    <select name="type" @click="handleSelect" v-model="select_value" class="text-black font-semibold bg-transparent ml-2 focus:outline-0">
                        <option>Types</option>
                        <option value="image">images</option>
                        <option value="videos">videos</option>
                        <option value="documents">documents</option>
                    </select> 
                </div>
            </div>

            <div class="">
                <div class="bg-white flex rounded-[50px] hover:shadow-lg">
                    <button class="bg-purple-800 shadow-lg text-white w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
                        <i class="icon pi pi-th-large text-base"></i> 
                    </button>

                    <button class="hover:bg-purple-800 text-gray-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                        <i class="icon pi pi-list text-base"></i> 
                    </button>
                </div>
            </div>
        </div>

        <div class="flex my-4" id="recently">
            <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="cursor-pointer rounded-[20px] mx-2 border hover:border-purple-800 bg-white h-fit w-[200px]" v-for="(file,id) in recent_files" :key="id">
                <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                <img :src="video" :alt="file.filename" :title="file.filename" v-if="file.type.includes('video')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
                <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                <div class="">
                    <div class="mx-4 my-4 font-semibold">
                        <p class="text-sm">{{file.filename.slice(0,20)}}</p>
                        <p class="text-xs text-gray-500 mt-2">5/07/2023 4:30pm</p>
                    </div>
                    <div class="bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                        {{convert_size(file.size)}}
                    </div>
                </div>
            </div>
        </div>

        <Table title="recent" :files="files"/>
    </div>

    <!-- <Footer/> -->
    <DeleteFileDialog :filename="route.query.filename"/>
    <UploadDialog :error="error"/>
    <CreateDialog/>
</template>
