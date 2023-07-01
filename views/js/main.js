import {checker} from "./notification.js"
const root=document.getElementById("root")
const socket = io("/");

root.innerHTML=`
<div class="flex flex-col items-center pt-[15vh]">
    <div id="users"></div>
    <p class="text-2xl font-semibold">Share Files your peers</p>
    <div class="flex mt-10">
        <a href="./pages/sender.html" class="mx-2 h-[40px] flex items-center justify-center bg-blue-700 rounded-[20px] text-white w-[100px]">Send</a>
        <a href="./pages/receiver.html" class="mx-2 h-[40px] flex items-center justify-center bg-blue-700 rounded-[20px] text-white w-[100px]">Receive</a>
    </div>
</div>
`

function show_connected_user(element){
    socket.on("users",(users)=>{
        // users.map((i,n)=>{
        // })
        element.innerHTML+=`
        <div class="bg-blue-200 rounded-lg flex flex-col font-light text-gray-600 items-center justify-center max-md:w-[90vw] w-[40vw] h-[40px] mb-[20px]">
            <p class="text-base bg-transparent">${users.length} connected users including you.</p>
        </div>
        `
    })
}

checker()
show_connected_user(document.getElementById("users"))