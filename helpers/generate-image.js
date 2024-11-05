import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const generate_image = async (req, res) => {
    let prompt = req.body.prompt;
    let num_images = req.body.num_images || 1; // Default to 1 image if num_images is not provided
    const API_TOKEN = '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';
    let style = req.body.style || "Auto"; // Default to Auto if no style is provided


    // Mapping style values to descriptions
    const styleDescriptions = {
        "Auto": "", // No style description for Auto
        "Realistic": "highly detailed, photorealistic style",
        "Design": "minimalistic, modern design style",
        "3D": "rendered in 3D, with realistic lighting and textures",
        "Anime": "in anime style, with vibrant colors and bold outlines"
    };


    // Get the style description from the mapping
    const styleDescription = styleDescriptions[style] || "";

    // Add the style description to the prompt if not "Auto"
    if (styleDescription) {
        prompt += `, ${styleDescription}`;
    }


    // Store paths of generated images
    const generatedImages = [];

    try {
        // API URL for CompVis/stable-diffusion-v1-4
        const apiUrl = 'https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4';

        // Loop through num_images to generate multiple images
        for (let i = 0; i < num_images; i++) {

            const seed = Math.floor(Math.random() * 100000);


            // Make POST request to Hugging Face Inference API
            const response = await axios.post(
                apiUrl,
                { inputs: prompt, seed: seed },
                {
                    headers: {
                        Authorization: `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer', // Handle image response as binary
                }
            );

            // Get current date and time for naming files
            const now = new Date();
            const timestamp = now.toISOString().replace(/[:.]/g, '-');

            const fileName = `generated_image_${timestamp}_${i + 1}.png`; // Unique filename for each image
            const imageBuffer = Buffer.from(response.data, 'binary'); // Handle image response
            const filePath = path.join("./generated_images", fileName);

            // Write the binary image data to a file
            fs.writeFileSync(filePath, imageBuffer); // Save the image as PNG

            // Add the file path to the generatedImages array
            generatedImages.push(filePath);
        }

        // Return response after all images are generated
        return res.json({
            status: true,
            image_generated: true,
            images: generatedImages, // Return the file paths of the generated images
        });
    } catch (error) {

        console.error('Error generating image:', error);
        return res.json({
            status: false,
            image_generated: false,
            error: error.message,
        });
    }
};

export default generate_image;
