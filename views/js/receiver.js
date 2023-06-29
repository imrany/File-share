const root=document.getElementById("root")
let start=`
<div style="display:flex; flex-direction:column; align-items:center; padding-top:20vh; height:100vh;">
    <div style="width:fit-content;">
        <h1 style="font-size:40px;">Share Files</h1>
        <form>
            <h3 style="margin:10px 0; font-size:20px;">Join ID</h3>
            <input max-length="11" required style="font-size:20px; width:150px; height:50px; outline:1px solid black;" type="text" name="id"/>
            <button id="connect" title="Create a pair ID and paste it to your receiver" style="margin:10px 0; padding:10px 15px; outline:none; background:black; color:white; border:none; cursor:pointer; border-radius:20px;">
                Connect
            </button>
        </form><br/>
        <a style="margin:23px 0; font-size:15px;" target="_blank" href="./index.html">Back</a>
    </div>
</div>
`

let receive=`
    <div class="container">
        <h1>Receive Files</h1>
        <div class="receive"></div>
        <a href="./index.html" style="margin-top: 40px; font-weight: 600; font-size: larger;">Back</a>
    </div>
`
root.innerHTML=start

function load(element){
    window.onload=async()=>{
        try {
        let url=`/read_file`
        const response=await fetch(url)
        const parseRes=await response.json()
        if(parseRes.error){
            element.innerHTML=`
                <p>${parseRes.error}</p>
            `
        }else{
            parseRes.map(i=>{
                element.innerHTML+=`
                    <a href="${i}" download>${i}</a>
                `
            })
        }
        } catch (error) {
            element.innerHTML=`
                <p>${error.message}</p>
            `
        }
    }
}

function handleForm(element){
    element.addEventListener("submit",async(e)=>{
        e.preventDefault()
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

handleForm(document.querySelector("form"))
load(document.querySelector(".receive"))