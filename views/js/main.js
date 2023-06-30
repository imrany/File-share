const root=document.getElementById("root")
const socket = io("/");

root.innerHTML=`
<div class="flex flex-col items-center pt-[20vh]">
    <p class="text-2xl font-semibold">Share Files your peers</p>
    <div class="flex mt-10">
        <a href="./pages/sender.html" class="mx-2 h-[40px] flex items-center justify-center bg-blue-700 rounded-[20px] text-white w-[100px]">Send</a>
        <a href="./pages/receiver.html" class="mx-2 h-[40px] flex items-center justify-center bg-blue-700 rounded-[20px] text-white w-[100px]">Receive</a>
    </div>
</div>
`