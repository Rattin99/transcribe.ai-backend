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
import authenticateToken from "./service/AuthService/authmiddleware";
import moment from "moment/moment";
import { transcribeService } from "./service/transcribe/transCribeService";
const S = require('string');
app.use(express.json());
app.use(cors());
//parser
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: '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'
});

// async function transcribe(req,filePath,res) {
//     const transcription = await openai.audio.transcriptions.create({
//         file: createReadStream(filePath),
//         model: "whisper-1",
//         response_format: "text",
//     });
//     const meetingId = await transcribeService.insertMeetings(req);
//      // Insert transcription data using the meeting ID
//      await transcribeService.insertTranscribe(meetingId, transcription);
//     res.status(200).json({text: transcription})
// }

async function transcribe(req, filePath, res) {
    try {
        let meetingId = req.query.meetingId; // Get meeting ID from query parameter

        if (!meetingId) {
            // If meeting ID is not provided, create a new meeting
            meetingId = await transcribeService.insertMeetings(req);
        }

        // Perform transcription
        const transcription = await openai.audio.transcriptions.create({
            file: createReadStream(filePath),
            model: "whisper-1",
            response_format: "text",
        });

        // Insert transcription data using the meeting ID
        await transcribeService.insertTranscribe(meetingId, transcription);

        // Send response
        res.status(200).json({ 
            success:true,
            message: "Successfully created",
            text: transcription,
            meetingId:meetingId,
            created_at:moment().format('YYYY-MM-DD HH:mm')
        });
    } catch (error) {
        console.log("Error during transcription:", error);
        res.status(500).json({ error: "Internal server error" });
    }
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

app.post("/upload", authenticateToken,upload.single('file'), async (req, res) => {
    
    const filePath = join(__dirname, 'uploads', req.file.originalname);

    transcribe(req,filePath,res);

})

app.post("/summary", async (req,res) => {
    const transcription = req.body.text;

    let meetingId = req.query.meetingId; // Get meeting ID from query parameter

    if (!meetingId) {
        return 'Please provide a meeting ID'
    }
    const completion = await openai.chat.completions.create({
        messages: [
            {"role":"user", "content":` the following is part of a audio transcription. summarize the transciption text into bullet points. No heading needed give me only the bullet points.put a line break after every bullet point:
            ${transcription}
            `}
        ],
        max_tokens: 150,
        temperature: 0.3, // Control the creativity of the response
        top_p: 1, // Control the diversity of the response
        frequency_penalty: 0.5, // Adjust the likelihood of repetitive phrases
        presence_penalty: 0.5 ,
        model: "gpt-3.5-turbo",
    })
    const mainSummary = completion.choices[0].message.content;
    const arr = S(mainSummary).lines()
    await transcribeService.insertSummary(meetingId, arr);
    res.status(200).json({
        success: true,
        message: 'Successfully created',
        summaryData: arr
    })
})

app.post("/notes", async (req,res) => {
    const transcription = req.body.text;

    let meetingId = req.query.meetingId; // Get meeting ID from query parameter

    if (!meetingId) {
        return 'Please provide a meeting ID'
    }
    const completion = await openai.chat.completions.create({
        messages: [
            {"role":"user", "content":` the following is part of a meeting transcription. 
            write key takeaways and observations in sections with headers and bullet points. each header must end with a : and separate each line with a line break:
            ${transcription}
            `}
        ],
        model: "gpt-3.5-turbo",
    })
    const mainNotes = completion.choices[0].message.content
     
    const arr = S(mainNotes).lines()
    await transcribeService.insertNotes(meetingId, arr);
    res.status(200).json({
        success:true,
        message: "Successfully created",
        notesData: arr
    })
})

app.listen(5000, () => {
  console.log("Server started on port 5000");
})

