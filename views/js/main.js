const root=document.getElementById("root")
const socket = io("/");

let form=`
    <div class="container">
        <h1>Share Files</h1>
        <form>
        <input type="file" name="file" id="file" required multiple/>
        <button style="margin-top: 10px;">Share</button>
        </form>
        <button class="send_message">Hit Me</button>
        <a href="./receive.html" style="margin-top: 20px;" target="_blank">See files</a>
        <div  class="receive"></div>
    </div>
`

root.innerHTML=form

function handleForm(element){
    element.addEventListener("submit",(e)=>{
        e.preventDefault()
        const file=document.getElementById("file")
        for (let index = 0; index < file.files.length; index++) {
            socket.emit("upload", file.files[index], (status) => {
                console.log(status);
            });
        }
        element.reset()
    })
}

// listen for new messages
socket.on("send", function(data) {
    console.log(data);
    let blob1 = new Blob([new Uint8Array(data)]) 
    let aDom = document.createElement('a')
    if('download' in aDom){
        aDom.type = 'download'
        aDom.href = URL.createObjectURL(blob1)
        aDom.download = '2.png'
        aDom.click()
    }
    // document.querySelector(".receive").innerHTML=`
    //     <a href="${URL.createObjectURL(blob1)}" >image</a>
    // `
});

function send_message(element){
    element.onclick=()=>{
        socket.emit("message", "HELLO WORLD");
    }
}

send_message(document.querySelector(".send_message"))
// handleForm(document.querySelector("form"))