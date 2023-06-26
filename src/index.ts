import express from "express"
import { config } from "dotenv"
import multer from "multer"
import cors from "cors"
config()

const app =express()
const upload=multer({dest:`./uploads`})
// app.set('view engine','ejs');
app.use(express.static(`views`));
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors({}))

//routes
app.post("/upload",upload.array("files"),async(req:any,res:any)=>{
    try {
        console.log(req.body)
        console.log(req.files)

        res.status(200).send({msg:"File received"})
    } catch (error:any) {
        console.log(error)
    }
})

const port=process.env.PORT||8000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})