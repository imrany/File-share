<script lang="ts" setup>
    import Table from "../components/ui/Table.vue"
    import Footer from "../components/ui/Footer.vue"
    import indexedDB from "../indexedDB"
    import sheet from "@/assets/icons/sheet.png"
    import music from "@/assets/icons/music.png"
    import zip from "@/assets/icons/zip.png"
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
    import { inject, onMounted, ref } from "vue"
    import { useRouter, useRoute } from "vue-router"
    import LayoutGrid from "../components/LayoutGrid.vue"
    import { useToast } from 'vue-toast-notification';
import { loader } from ".."

    const router=useRouter()
    const route=useRoute()
    const toast=useToast()
    const capacity=ref("")
    const error=ref("")
    const user_details:any=inject("user-details")
    const sub_folder=ref("Files")
    const file_format:any=ref({
        application:{
            count:0,
            tatol_size:"0 Mb",
            other_file:0
        },
        audio:{
            count:0,
            tatol_size:"0 Mb",
            other_file:0
        },
        video:{
            count:0,
            tatol_size:"0 Mb",
            other_file:0
        }
    })
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
            router.push("/home")
        }
    }

    function open_file(url:any,e:any,filename:string){
        if(e.shiftKey){
            open_delete_dialog(filename)
        }else {
            let aDom = document.createElement('a')
            if(aDom){
                aDom.target="_blank"
                aDom.href = url
                aDom.click()
            }
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
                    let type_application:any=[]
                    let type_audio:any=[]
                    let type_video:any=[]
                    getFiles.result.forEach((i:any)=>{
                        if(i.type.includes("application")){
                            type_application.push(i)
                            file_format.value.application.count=type_application.length
                            file_format.value.application.total_size=convert_size(i.size)
                            file_format.value.application.other_file=`-${files.value.length-file_format.value.application.count}`
                        }else  if(i.type.includes("audio")){
                            type_audio.push(i)
                            file_format.value.audio.count=type_audio.length
                            file_format.value.audio.total_size=convert_size(i.size)
                            file_format.value.audio.other_file=`-${files.value.length-file_format.value.audio.count}`
                        }else  if(i.type.includes("video")){
                            type_video.push(i)
                            file_format.value.video.count=type_video.length
                            file_format.value.video.total_size=convert_size(i.size)
                            file_format.value.video.other_file=`-${files.value.length-file_format.value.video.count}`
                        }

                    })
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
        // check_user_details()
        list.value=localStorage.getItem("list")
        toast.success('You did it!', { position:
            "top",duration:3000});
    })
    
    let results:any=[]
    async function handleSearchTerm(){
        if (route.query.search_term||route.query.sort_term) {
            const request=await indexedDB()
            const db:any=await request
            const transaction=db.transaction("All_files","readwrite")
            const fileStore=transaction.objectStore("All_files")
            const getFiles=fileStore.getAll()

            getFiles.onsuccess=()=>{
                getFiles.result.forEach((i:any)=>{
                    if (i.filename.includes(route.query.search_term)||i.type.includes(route.query.search_term)) {
                        const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
                        const folder_view=document.getElementById("folder_view") as HTMLDivElement
                        const back_link=document.getElementById("back_link") as HTMLDivElement
                        dialogElement.close()
                        folder_view.style.display="none"
                        back_link.style.display="flex"
                        results.push(i)
                        files.value=results
                        router.push("/home")
                    }
                })
                if(route.query.sort_term){
                        const dialogElement=document.getElementById("search-dialog") as HTMLDialogElement
                        const folder_view=document.getElementById("folder_view") as HTMLDivElement
                        const back_link=document.getElementById("back_link") as HTMLDivElement
                        dialogElement.close()
                        folder_view.style.display="none"
                        back_link.style.display="flex"
                        switch (route.query.sort_term) {
                            case "filename":
                                files.value.sort((a:any,b:any)=>{
                                    return b.filename-a.filename
                                })
                                break;
                            case "type":
                                getFiles.result.sort((a:any,b:any)=>{
                                    return b.type-a.type
                                })
                                files.value=getFiles.result
                                break;
                            case "size":
                                files.value.sort((a:any,b:any)=>{
                                    return b.size-a.fsize
                                })
                                break;
                            case "uploadedAt":
                                getFiles.result.sort((a:any,b:any)=>{
                                    return b.uploadedAt-a.uploadedAt
                                })
                                files.value=getFiles.result
                                break;
                        }
                        router.push("/home")
                }
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

    const handleFilter=()=>{
        router.push(`?search_term=${select_value.value}`)
        sub_folder.value=`${select_value.value}s`
    }

    const handleSort=()=>{
        router.push(`?sort_term=${select_value.value}`)
        sub_folder.value=`Sort by ${select_value.value}`
    }

    const handleCategory=(e:any)=>{
        router.push(`?search_term=${e.target.value}`)
        sub_folder.value=`My ${e.target.value}s`
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

    function check_user_details() {
        if(!user_details){
            loader.on()
            router.push('/signin')
            setTimeout(()=>{
                loader.off()
            },200)
        }
    }
</script>

<template>
    <LayoutGrid>
        <template #grid-2>
            <div class="flex justify-between mb-5 px-8 py-5 border-b-[1px] bg-white border-gray-100" id="nav">
                <div class="flex items-center">
                    <button class="flex text-xs justify-center items-center bg-gray-300 text-gray-800 rounded-lg w-[100px] h-[35px]" @click="upload_open" title="Add file">
                        <i class="icon pi pi-upload mr-2"></i> 
                        <p>Upload</p>
                    </button>
                    <button @click="create_open" class="flex ml-4 justify-center text-xs items-center bg-gray-300 text-gray-800 rounded-lg w-[100px] h-[35px]" title="Create a folder">
                        <i class="icon pi pi-plus mr-2"></i> 
                        <p>Create</p>
                    </button>
                </div>

                <div class="flex">
                    <button title="Your storage" class="w-fit px-5 py-2 flex text-sm font-semibold h-fit border-[1px] rounded-[20px] cursor-pointer mr-3">
                        <span class="text-[#ee9725] flex mr-2">
                            <i class="icon pi pi-th-large mt-[3px] mr-2"></i> 
                            <p>{{capacity}}</p>
                        </span>
                        <span>Storage</span>
                    </button>

                    <button @click="search_open" title="Search for a file or folder" class="hover:bg-[#fd9104] hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3">
                        <i class="icon pi pi-search text-base"></i> 
                    </button>

                    <button title="My notifications" class="hover:bg-[#fd9104] hover:text-white w-[35px] h-[35px] text-xs flex justify-center items-center bg-gray-100 rounded-[50px] mr-3" >
                        <i class="icon pi pi-bell text-base"></i> 
                    </button>

                    <img title="My profile" :src="profile" alt="." class="w-[35px] h-[35px] rounded-[50px]">
                </div>
            </div>

            <div class="px-8 max-md:py-8">
                <div id="folder_view">
                    <div class="flex justify-between" id="folder_view">
                        <div class="">
                            <p class="max-md:text-lg text-2xl font-semibold">{{header}}</p>
                            <div class="flex mt-2 mb-4">
                                <div class="text-gray-500 text-sm flex">
                                    <p>Filter by: </p>
                                    <select name="type" @click="handleFilter" v-model="select_value" class="text-black font-semibold bg-transparent ml-2 focus:outline-0">
                                        <option disabled value="">Types</option>
                                        <option value="image">images</option>
                                        <option value="video">videos</option>
                                        <option value="application">documents</option>
                                        <option value="text">Texts</option>
                                    </select> 
                                </div>
                                <div class="text-gray-500 ml-3 text-sm flex">
                                    <p>Sort by: </p>
                                    <select name="type" @click="handleSort" v-model="select_value" class="text-black font-semibold bg-transparent ml-2 focus:outline-0">
                                        <option disabled value="">Name</option>
                                        <option value="size">Size</option>
                                        <option value="uploadedAt">Date</option>
                                        <option value="type">Type</option>
                                        <option value="filename">Filename</option>
                                    </select> 
                                </div>
                            </div>
                        </div>

                        <div class="" id="recently">
                            <div class="bg-white flex rounded-[50px] hover:shadow-lg" v-if="list=='false'||list==false">
                                <button @click="hide_list" class="bg-[#fd9104] shadow-lg text-white w-[35px] h-[35px] text-xs flex justify-center items-center rounded-[50px] mr-3" >
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

                                <button @click="show_list" class="bg-[#fd9104] text-white  w-[35px] h-[35px] text-xs flex justify-center items-center  rounded-[50px]" >
                                    <i class="icon pi pi-list text-base"></i> 
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="">
                        <div class="flex my-4" v-if="list=='false'||list==false" id="recently">
                            <button @click="handleCategory" value="application" class="text-left cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]">
                                <i class="icon pi pi-folder text-4xl text-[#fd9104] ml-4 mb-12 mt-[26px]"></i>
                                <div class="">
                                    <div class="mx-4 my-4 font-semibold">
                                        <p class="text-sm">My documents</p>
                                        <p class="text-xs text-gray-500 mt-2">{{file_format.application.count}} files</p>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                        <p>{{file_format.application.total_size}}</p>
                                        <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]" :title="`${Math.abs(file_format.application.other_file)} other files not in type application`">{{file_format.application.other_file}}</p>
                                    </div>
                                </div>
                            </button>
                            <button @click="handleCategory" value="audio" class="text-left cursor-pointer rounded-[20px] mx-2  border hover:border-[#fd9104] bg-white h-fit w-[200px]">
                                <i class="icon pi pi-play text-4xl text-[#fd9104] ml-4 mb-12 mt-[26px]"></i>
                                <div class="">
                                    <div class="mx-4 my-4 font-semibold">
                                        <p class="text-sm">My music</p>
                                        <p class="text-xs text-gray-500 mt-2">{{file_format.audio.count}} files</p>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                        <p>{{file_format.audio.total_size}}</p>
                                        <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]" :title="`${Math.abs(file_format.audio.other_file)} other files not in type audio`">{{file_format.audio.other_file}}</p>
                                    </div>
                                </div>
                            </button>
                            <button @click="handleCategory" value="video" class="text-left cursor-pointer rounded-[20px] mx-2  border hover:border-[#fd9104] bg-white h-fit w-[200px]">
                                <i class="icon pi pi-file text-4xl text-[#fd9104] ml-4 mb-12 mt-[26px]"></i>
                                <div class="">
                                    <div class="mx-4 my-4 font-semibold">
                                        <p class="text-sm">My videos</p>
                                        <p class="text-xs text-gray-500 mt-2">{{file_format.video.count}} files</p>
                                    </div>
                                    <div class="flex justify-between items-center bg-gray-200 text-xs px-3 py-2 rounded-b-[20px]">
                                        <p>{{file_format.video.total_size}}</p>
                                        <p class="flex justify-center items-center font-semibold border border-white rounded-[50px] w-[30px] h-[30px]" :title="`${Math.abs(file_format.video.other_file)} other files not in type video`">{{file_format.video.other_file}}</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 gap-y-3 mt-4 mb-14" id="recently" v-else>
                            <button @click="handleCategory" value="application" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex flex-grow">
                                    <i class="icon pi pi-folder text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My documents
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.application.count}} files</p>
                                    </div>
                                </div>
                            </button>

                            <button @click="handleCategory" value="audio" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex">
                                    <i class="icon pi pi-play text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My music
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.audio.count}}  files</p>
                                    </div>
                                </div>
                            </button>

                            <button @click="handleCategory" value="video" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex">
                                    <i class="icon pi pi-file text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My videos
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.video.count}}  files</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <div class="grid grid-cols-1  gap-y-3 mt-4 mb-14" id="file-tabs">
                            <button @click="handleCategory" value="application" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex">
                                    <i class="icon pi pi-folder text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My documents
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.application.count}}  files</p>
                                    </div>
                                </div>
                            </button>

                            <button @click="handleCategory" value="audio" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex">
                                    <i class="icon pi pi-play text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My music
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.audio.count}}  files</p>
                                    </div>
                                </div>
                            </button>

                            <button @click="handleCategory" value="video" class="flex w-full justify-between bg-gray-100 border hover:border-[#fd9104] py-3 px-2 rounded-md cursor-pointer mt-2 hover:shadow-lg">
                                <div class="flex">
                                    <i class="icon pi pi-file text-3xl mr-3 text-[#fd9104] "></i>
                                    <div class="flex flex-col font-semibold">
                                        <p class="text-sm">
                                            My videos
                                        </p>
                                        <p class="text-xs mr-auto text-gray-500" id="type">{{file_format.video.count}}  files</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                    </div>
                </div>

                <p class="mt-10 ml-2">All Files / <span class="text-gray-500">{{sub_folder}}</span></p>
                <div class="grid grid-cols-5 gap-y-4 my-4 mb-16" id="recently" v-if="list=='false'||list==false">
                    <div class="cursor-pointer rounded-[20px] mx-2 border hover:border-[#fd9104] bg-white h-fit w-[200px]" v-for="(file,id) in files" :key="id" :title="file.filename">
                        <div @click="($event)=>open_file(convert(file.file),$event,file.filename)">
                            <img :src="music" :alt="file.filename" :title="file.filename" v-if="file.type.includes('audio')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="sheet" :alt="file.filename" :title="file.filename" v-if="file.type.includes('sheet')" class="w-[70px] ml-4 mb-6 mt-[32px] h-[80px] rounded-sm">
                            <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="pdf" :alt="file.filename" :title="file.filename" v-if="file.type.includes('pdf')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="video" :alt="file.filename" :title="file.filename" v-if="file.type.includes('video')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="convert(file.file)" :alt="file.filename" :title="file.filename" class="w-[100%] h-[120px] rounded-t-[20px]"  v-if="file.type.includes('image')">
                            <img :src="text" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/plain')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <img :src="html" :alt="file.filename" :title="file.filename" v-if="file.type.includes('text/html')" class="w-[90px] ml-4 mb-6 mt-[22px] h-[90px] rounded-sm">
                            <div class="mx-4 my-4 font-semibold">
                                <p class="text-sm">{{file.filename.slice(0,20)}}</p>
                                <p class="text-xs text-gray-500 mt-2">{{file.uploadedAt}}</p>
                            </div>
                        </div>
                        <div @click="open_file_dialog(file.filename)" class="flex justify-between items-center bg-gray-200 text-xs px-3 py-3 rounded-b-[20px]">
                            <p>{{convert_size(file.size)}}</p>
                            <i class="icon pi pi-list"></i>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="recently" v-else>
                    <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                        <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                            <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                            <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
                            <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                            <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
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
                        <div @click="open_file_dialog(file.filename)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                            <i class="mt-2 icon pi pi-list text-base"></i>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 gap-y-3 mt-4 mb-16" id="file-tabs">
                    <div class="flex justify-between bg-gray-100 border hover:border-[#fd9104] rounded-md cursor-pointer mt-2 hover:shadow-lg" v-for="(file, index) in files" :key="index">
                        <div @click="($event)=>open_file(convert(file.file),$event,file.filename)" class="flex py-3 px-2 flex-grow" :title="file.filename">
                            <img :src="music" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('audio')">
                            <img :src="pdf" :alt="file.filename" :title="file.filename"  class="mr-4 w-[40px] h-[40px] rounded-sm" v-if="file.type.includes('pdf')">
                            <img :src="sheet" :alt="file.filename" :title="file.filename"  class="mr-4 w-[35px] h-[40px] rounded-sm" v-if="file.type.includes('sheet')">
                            <img :src="zip" :alt="file.filename" :title="file.filename" v-if="file.type.includes('zip')" class="mr-4 w-[40px] h-[40px] rounded-sm">
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
                        <div @click="open_file_dialog(file.filename)" class=" py-3 px-5  pl-4 rounded-r-md hover:bg-slate-300">
                            <i class="mt-2 icon pi pi-list text-base"></i>
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
    </LayoutGrid>
</template>
