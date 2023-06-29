const root=document.getElementById("root")
const socket = io("/");

let start=`
    <div style="display:flex; flex-direction:column; align-items:center; padding-top:20vh; height:100vh;">
        <div style="width:fit-content;">
            <h1 style="font-size:40px;">Share Files</h1>
            <button id="generete_pair" title="Create a pair ID and paste it to your receiver" style="margin:10px 0; padding:10px 15px; outline:none; background:black; color:white; border:none; cursor:pointer; border-radius:20px;">
                Create Pair
            </button>
            <div>
                <h3 style="margin:10px 0; font-size:20px;">Pair ID</h3>
                <div style="display:flex; justify-content:center; align-items:center; font-size:20px; width:150px; height:50px; outline:1px solid black;" id="pair_id">
                </div>
            </div><br/>
            <a style="margin:23px 0; font-size:15px;" target="_blank" href="./receive.html">Receive</a>
        </div>
    </div>
`

let form=`
    <div class="container">
        <h1>Share Files</h1>
        <form>
        <input type="file" name="file" id="file" required multiple/>
        <button style="margin-top: 10px;">Share</button>
        </form>

        <a href="./receive.html" style="margin-top: 20px;">See files</a>
        <button class="send_message">Hit Me</button>
    </div>
`

root.innerHTML=start

function handleForm(element){
    element.addEventListener("submit",async(e)=>{
        e.preventDefault()
        const file=document.getElementById("file")
        const formData=new FormData()
        for (let index = 0; index < file.files.length; index++) {
            formData.append("files",file.files[index])
        }
        try {
            let url=`/upload`
            const response=await fetch(url,{
                method:"POST",
                body:formData
            })
            form.reset()
            const parseRes=await response.json()
            if(parseRes.error){
                alert(parseRes.error)
            }else{
                alert(parseRes.msg)
            }
        } catch (error) {
            alert(error.message)
        }
    })
}

function generete_id(){
    return `${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}-${Math.trunc(Math.random()*999)}`
}

function generete_pair(element){
    element.onclick=()=>{
        const pair_id=document.getElementById("pair_id")
        pair_id.innerText=generete_id()
    }
}
function send_message(element){
    element.onclick=()=>{
        socket.emit("message", "HELLO WORLD");
    }
}
// listen for new messages
socket.on("message", function(data) {
    console.log(data);
});

generete_pair(document.getElementById("generete_pair"))
send_message(document.querySelector(".send_message"))
handleForm(document.querySelector("form"))