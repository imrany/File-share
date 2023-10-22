import { reactive,provide } from "vue";
import { io } from "socket.io-client";
import indexedDB from "./indexedDB"
import { origin } from ".";
import pop_sound from "@/assets/sounds/pop.mp3"

type updateType={
  photo:string,
  username:string,
  email:string,
  filename:string,
  groupname:string,
  uploadedAt:string
}
export const state = reactive({
  connected: localStorage.getItem("status"),
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
const URL=origin

export const socket = io(URL);

socket.on("disconnect", () => {
  localStorage.setItem("status",JSON.stringify(false))
});

socket.on('response',async(data:updateType)=>{
  new Audio(pop_sound).play()
  localStorage.setItem('update',JSON.stringify(data))
  const notification=new Notification(`From ${data.groupname} (Group)`,{
    body:`
      ${data.username.startsWith('@',0)?data.username.slice(1,data.username.length):data.username} has just upload ${data.filename.slice(0,15)}... on ${data.groupname}
    `,
    icon:`https://drive.google.com/uc?id=${data.photo}`,
  });
  notification.onclick=function(){
    window.parent.focus();
    window.location.href=`/group?name=${data.groupname}`
    this.close();
  }
})