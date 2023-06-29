import express from "express"
import { config } from "dotenv"
import cors from "cors"
config()

const cors_option = {
    origin: "*",
    methods: ["GET", "POST"]
 }

const app =express()
// app.set('view engine','ejs');
app.use(express.static(`views`));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({}))

const port=process.env.PORT||8000
const server=app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

let io = require("socket.io")(server,{
    cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    console.log("a user connected");
    socket.on('sender_join',(data:any)=>{
        socket.join(data.uid)
    })
    socket.on('receiver_join',(data:any)=>{
        socket.join(data.uid)
        socket.in(data.sender_uid).emit("init",data.uid)
    })
    socket.on('file_meta',(data:any)=>{
        socket.in(data.uid).emit("fs_meta",data.metadata)
    })
    socket.on('fs_start',(data:any)=>{
        socket.in(data.uid).emit("fs_share",{})
    })
    socket.on('file_raw',(data:any)=>{
        socket.in(data.uid).emit("fs_share",data.buffer)
    })
    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
      console.log(message);
    });
});
  