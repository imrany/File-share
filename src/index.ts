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

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    console.log("a user connected");
    socket.on("upload", (file:any, err:any) => {
        console.log(file); // <Buffer 25 50 44 ...>
        // save the content to the disk, for example
        if(err){
            console.log(err)
        }
        socket.emit("send",file)
    });
    // whenever we receive a 'message' we log it out
    socket.on("message", function(message: any) {
      console.log(message);
      socket.broadcast.emit("recieve",message)
    });
});
  