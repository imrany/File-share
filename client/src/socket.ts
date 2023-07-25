import { reactive,provide } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: localStorage.getItem("status"),
  peers:[]
});

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";
const URL=`http://localhost:8000`

export const socket = io(URL);

socket.on("disconnect", () => {
  localStorage.setItem("status",JSON.stringify(false))
});

socket.on('peers',(data)=>{
  localStorage.setItem("status",JSON.stringify(true))
  state.peers=data.slice(1,data.length)
  console.log(state.peers)
})