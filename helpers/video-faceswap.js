import dotenv from "dotenv";
import axios from "axios";
import FormData from 'form-data';
import fs from "fs";
import {Readable} from "stream"

dotenv.config();

const apiKey = process.env.REMAKER_API_KEY;

const downloadImage = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary'); // Convert image data to Buffer
};


const video_face_swap = async (req, res) => {
    try {
        const { targeted_video_url, targeted_image_url } = req.body; // Access URLs from the request body

        if (!targeted_video_url || !targeted_image_url) {
            return res.status(400).json({ error: 'Both video and image URLs are required' });
        }

        // Download the image as a Buffer
        const imageBuffer = await downloadImage(targeted_image_url);

        // Prepare formData with the video URL and image buffer
        const formData = new FormData();
        formData.append('target_video_url', targeted_video_url); // Pass video URL directly
        formData.append('swap_image', imageBuffer, 'image.jpg'); // Ensure the filename is appropriate


        try {
            // // Set API endpoint for video face swap
            const endpoint = 'https://developer.remaker.ai/api/remaker/v1/face-swap-video/create-job';

            // Step 3: Send request to the Remaker API
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Authorization': apiKey,
                    'Accept': 'application/json',
                    ...formData.getHeaders(),
                }
            });

            const job_id = response.data.result.job_id;

            return res.json({ status: true, message: "Job has been created! Video is in progress", job_id })

        } catch (error) {

            console.log(error);


            return res.json({ status: false, message: "Couldn't create job", error })

        }


    } catch (error) {
        console.log(error);

        console.error('Error creating face swap job:', error.response ? error.response.data : error.message);
        res.json({ status: false, message: "Error occurred while face-swapping", error: 'Error creating face swap job' });
    }
};

export default video_face_swap;
