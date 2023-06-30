const root=document.getElementById("root")
const socket = io("/");

let start=`
    <div class="container">
        <h1>Receive Files</h1>
        <div class="receive"></div>
        <a href="./index.html" style="margin-top: 40px; font-weight: 600; font-size: larger;">Back</a>
    </div>
`
root.innerHTML=start

socket.on("send",(data)=>{
    console.log(data)
    document.querySelector(".receive").innerHTML=`
        <a href="${data}" download>${data}</a>
    `
})

socket.on("recieve",(data)=>{
    console.log(data)
})