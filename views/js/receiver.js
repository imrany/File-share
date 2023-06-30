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

socket.on("download", function(data) {
    console.log(data);
    alert(`New file received`)
    let blob1 = new Blob([new Uint8Array(data.file)],{type:`${data.type}`}) 
    let url =URL.createObjectURL(blob1)
    
    // let aDom = document.createElement('a')
    // if('download' in aDom){
    //     aDom.type = 'download'
    //     aDom.href = URL.createObjectURL(blob1)
    //     aDom.download = `${data.file_name}`
    //     aDom.click()
    // }
    document.querySelector(".receive").innerHTML+=`
        <a href="${url}" download="${data.file_name}">${data.file_name}</a>
    `
});