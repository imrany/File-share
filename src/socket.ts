import { reactive,provide } from "vue";
import { io } from "socket.io-client";
import indexedDB from "./indexedDB"
import { origin } from ".";

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

socket.on('peers',async(data)=>{
  localStorage.setItem("status",JSON.stringify(true))
  const request=await indexedDB()
  const db:any=await request
  const transaction=db.transaction("peers","readwrite")
  const peersStore=transaction.objectStore("peers")
  
  data.forEach((item:any) => {
    const addPeer=peersStore.add(item)

    addPeer.onsuccess=()=>{
      console.log(addPeer.result)
    }
  });
})