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
    import FileDialog from "../components/ui/Dialog/File.vue"
    import CreateDialog from "../components/ui/Dialog/CreateFolder.vue"
    import SearchDialog from "../components/ui/Dialog/Search.vue"
    import DeleteFileDialog from "../components/ui/Dialog/DeleteFile.vue"
    import { onMounted, ref } from "vue"
    import { useRouter, useRoute } from "vue-router"

    const router=useRouter()
    const route=useRoute()
    const capacity=ref("")
    const error=ref("")
    const sub_folder=ref("Files")
    let files:any=ref()
    let $file:any=ref(
        {
            file: "", 
            uploadedAt: "", 
            filename: "", 
            size: 0, 
            type: "", 
            sharedTo: ""
        }
    )
    const list:any=ref(false)
    const select_value=ref("")

    function upload_open(){
        const dialogElement=document.getElementById("upload-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function create_open(){
        const dialogElement=document.getElementById("create-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }
    function search_open(){
        const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
        dialogElement.showModal()
    }

    function open_delete_dialog(filename:string){
        const dialogElement=document.getElementById("delete-dialog") as HTMLDialogElement
        router.push(`?filename=${filename}`)
        dialogElement.showModal()
    }

    async function open_file_dialog(filename:string){
        const dialogElement=document.getElementById("file-dialog") as HTMLDialogElement
        router.push(`?open=${filename}`)

        const request=await indexedDB()
        const db:any=await request
        const transaction=db.transaction("All_files","readwrite")
        const fileStore=transaction.objectStore("All_files")
        const singleFile=fileStore.index("filename")
        const getFile=singleFile.get([route.query.open])

        getFile.onsuccess=()=>{
            $file.value=getFile.result
            dialogElement.showModal()
        }
        getFile.onerror=()=>{
            console.log("error",getFile.result)
            dialogElement.close()
            router.push("/")
        }
    }

    function open_file(url:any,e:any,filename:string){
        if(e.shiftKey){
            open_delete_dialog(filename)
        }else if(e.ctrlKey){
            let aDom = document.createElement('a')
            if(aDom){
                aDom.target="_blank"
                aDom.href = url
                aDom.click()
            }
        }else{
            open_file_dialog(filename)
        }
    }

    function show_list() {
        list.value=true
        localStorage.setItem("list",'true')
    }
    function hide_list() {
        list.value=false
        localStorage.setItem("list",'false')
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
        list.value=localStorage.getItem("list")
    })

    let results:any=[]
    async function handleSearchTerm(){
        if (route.query.search_term) {
            const request=await indexedDB()
            const db:any=await request
            const transaction=db.transaction("All_files","readwrite")
            const fileStore=transaction.objectStore("All_files")
            const getFiles=fileStore.getAll()

            getFiles.onsuccess=()=>{
                getFiles.result.forEach((i:any)=>{
                    if (i.filename.includes(route.query.search_term)) {
                        const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
                        const folder_view=document.getElementById("folder_view") as HTMLDivElement
                        const back_link=document.getElementById("back_link") as HTMLDivElement
                        dialogElement.close()
                        folder_view.style.display="none"
                        back_link.style.display="flex"
                        results.push(i)
                        sub_folder.value="Search"
                        files.value=results
                        router.push("/")
                    }
                })
            }
        }
    }

    const header="All Files"

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
            }else if(data.usage>1000000){
                capacity.value=`${Math.round(mbs(data.usage))} Mb/${Math.round(gbs(data.quota))} Gb`;
            }else if(data.usage>1000000000){
                capacity.value=`${Math.round(gbs(data.usage))} Mb/${Math.round(gbs(data.quota))} Gb`;
            }else{
                capacity.value=`${Math.round(kbs(data.usage))} Kb/${Math.round(gbs(data.quota))} Gb`;
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

    const reload=()=>{
        window.location.reload()
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

            <button @click="search_open" class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3">
                <i class="icon pi pi-search text-base"></i> 
            </button>

            <button class="hover:bg-purple-800 hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                <i class="icon pi pi-bell text-base"></i> 
            </button>

            <img :src="profile" alt="." class="w-[35px] h-[35px] rounded-[50px]">
        </div>
    </div>

    <div class="px-8 max-md:py-8">
        <div id="folder_view">
            <div class="flex justify-between" id="folder_view">
                <div class="">
                    <p class="max-md:text-lg text-2xl font-semibold">{{header}}</p>
                    <div class="text-gray-500 text-sm mt-2 flex">
                        <p>Sort by: </p>
                        <select name="type" @click="handleSelect" v-model="select_value" class="text-black font-semibold bg-transparent ml-2 focus:outline-0">
                            <option disabled value="">Types</option>
                            <option value="image">images</option>
                            <option value="videos">videos</option>
                            <option value="documents">documents</option>
                        </select> 
                    </div>
                </div>

                <div class="" id="recently">
                    <div class="bg-white flex rounded-[50px] hover:shadow-lg" v-if="list=='false'||list==false">
                        <button @click="hide_list" class="bg-purple-800 shadow-lg text-white w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
                            <i class="icon pi pi-th-large text-base"></i> 
                        </button>

                        <button @click="show_list" class=" text-gray-800 w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                            <i class="icon pi pi-list text-base"></i> 
                        </button>
                    </div>
                    <div class="bg-white flex rounded-[50px] hover:shadow-lg" v-else>
                        <button @click="hide_list" class="text-gray-800 w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
                            <i class="icon pi pi-th-large text-base"></i> 
                        </button>

                        <button @click="show_list" class="bg-purple-800 text-white  w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                            <i class="icon pi pi-list text-base"></i> 
                        </button>
                    </div>
                </div>
            </div>

            <div class="">
                <div class="flex my-4" v-if="list=='false'||list==false" id="recently">
                    <div class="cursor-pointer rounded-[20px] mx-2 border hover:border-purple-800 bg-white h-fit w-[200px]">
                        <i class="icon pi pi-folder text-4xl text-purple-800 ml-4 mb-12 mt-[26px]"></i>
                        <div class="">
                            <div class="mx-4 my-4 font-semibold">
                                <p class="text-sm">My documents</p>
                                <p class="text-xs text-gray-500 mt-2">5 files</p>
                            </div>
                            <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                <p>21 Mb</p>
                                <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]">+4</p>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer rounded-[20px] mx-2  border hover:border-purple-800 bg-white h-fit w-[200px]">
                        <i class="icon pi pi-play text-4xl text-purple-800 ml-4 mb-12 mt-[26px]"></i>
                        <div class="">
                            <div class="mx-4 my-4 font-semibold">
                                <p class="text-sm">My music</p>
                                <p class="text-xs text-gray-500 mt-2">2 files</p>
                            </div>
                            <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                <p>2 Mb</p>
                                <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]">+4</p>
                            </div>
                        </div>
                    </div>
                    <div class="cursor-pointer rounded-[20px] mx-2  border hover:border-purple-800 bg-white h-fit w-[200px]">
                        <i class="icon pi pi-file text-4xl text-purple-800 ml-4 mb-12 mt-[26px]"></i>
                        <div class="">
                            <div class="mx-4 my-4 font-semibold">
                                <p class="text-sm">My videos</p>
                                <p class="text-xs text-gray-500 mt-2">2 files</p>
                            </div>
                            <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                <p>2 Mb</p>
                                <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]">+4</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="recently" v-else>
                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-folder text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My documents
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-play text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My music
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-file text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My videos
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="file-tabs">
                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-folder text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My documents
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-play text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My music
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                        <div class="flex">
                            <i class="icon pi pi-file text-3xl mr-3 text-purple-800 "></i>
                            <div class="flex flex-col font-semibold">
                                <p class="text-sm">
                                    My videos
                                </p>
                                <p class="text-xs text-gray-500" id="type">5 files</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <p class="mt-10 ml-2">All Files / <span class="text-gray-500">{{sub_folder}}</span></p>
        <div class="grid grid-cols-5 gap-y-4 my-4" id="recently" v-if="list=='false'||list==false">
            <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="cursor-pointer rounded-[20px] mx-2 border hover:border-purple-800 bg-white h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
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
        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="recently" v-else>
            <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg" @click="($event)=>open_file(convert(file.file),$event,file.filename)" :title="file.filename" v-for="(file, index) in files" :key="index">
                <div class="flex">
                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                    <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                    <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                    <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                    <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                    <div class="flex flex-col">
                        <p class="text-sm font-semibold">
                            {{file.filename.slice(0,25)}} 
                        </p>
                        <p class="text-sm text-gray-500" id="type">{{file.type}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="file-tabs">
            <div class="flex justify-between bg-gray-100 border hover:border-purple-800 py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg" @click="($event)=>open_file(convert(file.file),$event,file.filename)" :title="file.filename" v-for="(file, index) in files" :key="index">
                <div class="flex">
                    <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                    <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                    <img :src="convert(file.file)" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-md"  v-if="file.type.includes('image')">
                    <img :src="video" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('video')">
                    <img :src="text" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/plain')">
                    <img :src="html" :alt="file.filename" class="mr-4 w-[40px] h-[40px] rounded-sm"  v-if="file.type.includes('text/html')">
                    <div class="flex flex-col">
                        <p class="text-sm font-semibold">
                            {{file.filename.slice(0,25)}} 
                        </p>
                        <p class="text-sm text-gray-500" id="type">{{file.type}}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="ml-2 my-8 cursor-pointer flex items-center text-gray-800" id="back_link" style="display:none;" @click="reload">
            <i class="icon pi pi-arrow-left text-sm mr-1"></i>
            <p >Back</p>
        </div>
        <!-- <Table title="recent" :files="files"/> -->
    </div>

    <!-- <Footer/> -->
    <DeleteFileDialog :filename="route.query.filename"/>
    <SearchDialog :searchFunction="handleSearchTerm()"/>
    <FileDialog :file_object="$file"/>
    <UploadDialog :error="error"/>
    <CreateDialog/>
</template>
