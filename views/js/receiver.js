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

function load(element){
    window.onload=async()=>{
        try {
            socket.on("send",(data)=>{
                element.innerHTML=`
                    <a href="${data}" download>${data}</a>
                `
            })
        } catch (error) {
            element.innerHTML=`
                <p>${error.message}</p>
            `
        }
    }
}

socket.on("send",(data)=>{
    // document.querySelector(".receive").innerHTML=`
    //     <a href="${data}" download>${data}</a>
    // `
    console.log(data)
})

// load(document.querySelector(".receive"))