import {socket} from "../../router.js"
export function receiver(){
    socket.on("download", function(data) {
        console.log(data);
        //notification.receive(data)
        alert("New file was received.")
        let blob1 = new Blob([new Uint8Array(data.file)],{type:`${data.type}`}) 
        let url =URL.createObjectURL(blob1)
        
        
        document.querySelector(".receive").innerHTML+=`
            <a href="${url}" download="${data.file_name}">${data.file_name}</a>
        `
    });
}
