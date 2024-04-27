import express, { json } from "express";
const app = express();
import cors from 'cors';
import multer, { diskStorage } from 'multer';
import OpenAI from 'openai';
const dotenv = require('dotenv').config();
import { createReadStream } from 'fs';
import { join } from 'path';
import bodyParser from 'body-parser';
import { userRoutes } from "./service/AuthService/user/userRoute";
import { transcribeRoutes } from "./service/transcribe/transcribeRoute";
import { transcribeController } from "./service/transcribe/transcribeController";

app.use(express.json());
app.use(cors());
//parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function transcribe(filePath,res) {
    console.log("filepath:",filePath)
        const transcribeData=[]
    const transcription = await openai.audio.transcriptions.create({
        file: createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
    });
        transcribeData.push(transcription);
        if (transcribeData.length > 0) {
         await transcribeController.userMeetingInsertController(transcribeData)
        }
    res.status(200).json({text: transcription})
}

app.use(cors({
   origin: 'http://localhost:3000'
}))

app.use(json());

const storage = diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({ storage: storage });

//route
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/transcribe',transcribeRoutes)
app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.post("/upload", upload.single('file'), async (req, res) => {
    
    const filePath = join(__dirname, 'uploads', req.file.originalname);

    transcribe(filePath,res);
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
})







