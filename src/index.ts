import express from "express"
import { config } from "dotenv"
import multer from "multer"
import cors from "cors"
import {readdir, mkdir} from "fs"
config()

const app =express()
const path=`./uploads`
const storage=multer.diskStorage({
    destination:(req:any,file:any,callback:any)=>{
        callback(null,path)
    },
    filename:(req:any,file:any,callback:any)=>{
        callback(null,file.originalname)
    }
})
const upload=multer({storage:storage})
// app.set('view engine','ejs');
app.use(express.static(`views`));
app.use(express.static(`uploads`));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({}))

//routes
app.post("/upload",upload.array("files"),async(req:any,res:any)=>{
    try {
        console.log(req.files)
        res.status(200).send({msg:"File received"})
    } catch (error:any) {
        res.status(505).send({error:error.message})
    }
})

app.get("/read_file",async(req:any,res:any)=>{
    try {
        readdir(path,"utf8",(err:any,files)=>{
            if(err){
                console.log(err)
                mkdir(path,()=>{
                    console.log(`uploads dir made`)
                })
            }else{
                res.send(files)
            }
        })
    } catch (error:any) {
        res.status(505).send({error:error.message})
    }
})

const port=process.env.PORT||8000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})