const express = require("express");
const app = express();
const cors = require('cors');
const multer = require('multer');
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: "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"
});
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');


async function transcribe(filePath,res) {
    console.log("filepath:",filePath)

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-1",
        response_format: "text",
    });
    
    res.status(200).json({text: transcription})
    
}

app.use(cors({
   origin: 'http://localhost:3000'
}))

app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({ storage: storage });



app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.post("/upload", upload.single('file'), async (req, res) => {
    
    const filePath = path.join(__dirname, 'uploads', req.file.originalname);

    transcribe(filePath,res);
  


})

app.listen(5000, () => {
    console.log("Server started on port 5000");
})







