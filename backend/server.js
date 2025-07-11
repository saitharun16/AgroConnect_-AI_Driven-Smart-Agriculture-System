import express from "express";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import cors from "cors";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";
import {findPlants,generateCautions} from "./gemini.controller.js";


dotenv.config(); // Load environment variables
const app = express();
app.use(cors());

const port = new SerialPort({ path: "COM5", baudRate: 9600 }); 
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);


export let latestData = {
  soil_type: "red",
  soil_moisture: "Moderate",
  temperature: "28°C",
  humidity: "65%",
  npk: "N: 50, P: 30, K: 40"
};

// Read serial data from Arduino
parser.on("data", (data) => {
    try {
        let Data = JSON.parse(data.trim());
        latestData={...latestData,...Data}
        console.log("Received from Arduino:", latestData);
    } catch (err) {
        console.log("Invalid JSON data:", data);
    }
});

// API endpoint to get sensor data
app.get("/data", (req, res) => {
    res.json(latestData);
});

// 🔹 Text Generation (e.g., GPT-2, Llama, etc.)
app.get("/generate-text", async (req, res) => {
  try {
    const {
      temperature = 28,
      humidity = 65,
      moisture = 500,
      soilType = "Loamy",
      soilPH = 6.5,
      rainfall = "Moderate",
      season = "Summer",
    } = req.query;

    let prompt = `Given the following conditions: temperature 40, soil type black, humidity 60, moisture 400, and soil pH 6.5, predict the top 5 crops that can be grown.`;

    const response = await hf.textGeneration({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      inputs: prompt,
      parameters: { max_new_tokens: 500, return_full_text: false },
    });

    let textOutput = response.generated_text.split("\n");
    console.log(textOutput)

    // Use regex to extract the crop name from a sentence like:
    // "Based on the given conditions, the most suitable crop to grow is: Tomato."
    const cropNames = response.match(/(\d+\.)\s*(.*?):/g).map(match => match.replace(/(\d+\.)\s*/, ''));

    const cropMatch = response.generated_text.match(/\[.*?\]/); // Find text inside brackets
    let crops = [];
    if (cropMatch) {
      try {
        crops = JSON.parse(cropMatch[0]); // Convert string to array
      } catch (error) {
        crops = cropMatch[0].replace(/[\[\]"]/g, "").split(",").map(crop => crop.trim());
      }
    }

    res.json({ cropNames });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
});


// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/")); // Uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });
const TARGET_API = "http://127.0.0.1:5000/predict"; // Change this to your target API

// Single File Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    // Create a FormData object to send file
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path), req.file.filename);

    // Send file to another API using Axios
    const response = await axios.post(TARGET_API, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Clean up the local file after sending
    fs.unlinkSync(req.file.path);

    res.json({ message: "File uploaded and sent successfully!", apiResponse: response.data });
  } catch (error) {
    console.error("Error sending file:", error);
    res.status(500).json({ error: "Failed to send file to external API" });
  }
});


app.get("/gemini",findPlants)

app.get("/cautions",generateCautions)
// Start Express server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})