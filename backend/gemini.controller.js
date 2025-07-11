import { GoogleGenerativeAI } from "@google/generative-ai";
import { latestData } from "./server.js";

const genAI = new GoogleGenerativeAI("AIzaSyCrXxrFXthUjz4ruln-o38Jzq3IXLDh0OU");

const fetchCropImage = async (cropName) => {
    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${cropName} crop in the farm &client_id=${"8iTBoOXFMBAzzzzAyDblAyPWT1OHTzpBymjN29BIcCE"}`
        );
        const data = await response.json();
        return data.results.length ? data.results[0].urls.regular : null;
    } catch (error) {
        console.error(`Error fetching image for ${cropName}:`, error);
        return null;
    }
};

const findPlants = async (req, res) => {
    try {
        const prompt = `Recommend the best crops to grow based on these conditions:
        - Soil Type: ${latestData.soil_type}
        - Soil Moisture: ${latestData.soil_moisture}
        - Temperature: ${latestData.temperature}
        - Humidity: ${latestData.humidity}
        - NPK Values: ${latestData.npk}

        Provide a comma-separated list of crop names only, without any additional text.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const ans = await model.generateContent(prompt);
        const responseText = await ans.response.text();

        // Extract crop names (splitting by commas and trimming whitespace)
        let cropNames = responseText.split(",").map(crop => crop.trim());

        // Fetch image URLs for each crop
        const cropsWithImages = await Promise.all(
            cropNames.map(async (crop) => ({
                crop,
                image_url: await fetchCropImage(crop)
            }))
        );

        console.log(cropsWithImages);
        res.status(200).json({ crops: cropsWithImages });

    } catch (error) {
        console.error("Error in findPlants:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const generateCautions = async (req, res) => {
    try {
        const prompt = `Given the following agricultural conditions:
        - Soil Type: ${latestData.soil_type}
        - Soil Moisture: ${latestData.soil_moisture}
        - Temperature: ${latestData.temperature}
        - Humidity: ${latestData.humidity}
        - NPK Values: ${latestData.npk}

        Generate exactly **four cautions** that farmers should be aware of. Each caution should be:
        - **Short and concise** (around 15-25 words).
        - **Specific to the given data**.
        - **Formatted in a JSON array**, like this:

        [
          "Caution 1 here.",
          "Caution 2 here.",
          "Caution 3 here.",
          "Caution 4 here."
        ]`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const ans = await model.generateContent(prompt);
        let responseText = await ans.response.text();

        // Ensure we extract the correct JSON format
        responseText = responseText.replace(/```json|```/g, "").trim();

        const cautions = JSON.parse(responseText); // Parse into JSON array
        console.log(cautions);
        res.status(200).json({ cautions });

    } catch (error) {
        console.error("Error in generateCautions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



export {generateCautions,findPlants};



