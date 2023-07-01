const root=document.getElementById("root")
const socket = io("/");

let form=`
    <div class="flex flex-col items-center pt-[20vh]">
        <p class="text-2xl font-semibold">Send Files</p>
        <form class="flex flex-col items-center mt-[10px]">
            <input type="file" class="border-gray-500 rounded-md border-[1px] my-[10px]" name="file" id="file" required multiple/>
            <button class="w-[100px] rounded-[30px] h-[40px] flex items-center justify-center text-white bg-blue-700">Send</button>
        </form>
        <a href="../index.html" class="mt-[20px] font-semibold  text-lg text-blue-600">Back</a>
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
            // console.log(file.files[index])
            socket.emit("upload", data, (status) => {
                console.log(status);
            });
            alert(`File sent`)
        }
        element.reset()
    })
}

handleForm(document.querySelector("form"))