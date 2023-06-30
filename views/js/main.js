const root=document.getElementById("root")
const socket = io("/");

let form=`
    <div class="container">
        <h1>Share Files</h1>
        <form>
        <input type="file" name="file" id="file" required multiple/>
        <button style="margin-top: 10px;">Share</button>
        </form>

        <a href="./receive.html" style="margin-top: 20px;" target="_blank">See files</a>
        <button class="send_message">Hit Me</button>
        <div  class="receive"></div>
    </div>
`

root.innerHTML=form

function handleForm(element){
    element.addEventListener("submit",async(e)=>{
        e.preventDefault()
        const file=document.getElementById("file")
        const formData=new FormData()
        for (let index = 0; index < file.files.length; index++) {
            formData.append("files",file.files[index])
        }
        try {
            socket.emit("upload", formData, (status) => {
                console.log(status);
            });
            element.reset()
        } catch (error) {
            alert(error.message)
        }
    })
}


function send_message(element){
    element.onclick=()=>{
        socket.emit("message", "HELLO WORLD");
    }
}
// listen for new messages
socket.on("send", function(data) {
    console.log(data);
    document.querySelector(".receive").innerHTML=`
        <a href="${data}" >${data}</a>
    `
});

send_message(document.querySelector(".send_message"))
handleForm(document.querySelector("form"))