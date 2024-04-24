const express = require("express");
const app = express();
const cors = require('cors');
const multer = require('multer');

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
   
    console.log(req.body)
    res.status(200).send("File uploaded successfully");
})

app.listen(5000, () => {
    console.log("Server started on port 5000");
})

