import express from "express"
import { config } from "dotenv"
import { writeFile } from "fs";
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
 
let users:any=[]
io.on("connection", function(socket: any) {
    users.push(socket.id)
    console.log(`a user connected: ${socket.id}`);
    socket.emit("users",users)
    socket.on("upload", (file:any, err:any) => {
        console.log(file); 
        if(err){
            console.log(err)
        }
        socket.broadcast.emit("download",file)
    });
});
  