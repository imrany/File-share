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
    </div>
`

root.innerHTML=form

function handleForm(element){
    element.addEventListener("submit",(e)=>{
        e.preventDefault()
        const file=document.getElementById("file")
        for (let index = 0; index < file.files.length; index++) {
            const data={
                file:file.files[index],
                file_name:file.files[index].name,
                type:file.files[index].type,
                size:file.files[index].size
            }
            console.log(file.files[index])
            socket.emit("upload", data, (status) => {
                alert(`File sent`)
                console.log(status);
            });
        }
        element.reset()
    })
}

handleForm(document.querySelector("form"))