import dotenv from "dotenv";
import axios from "axios";
import FormData from 'form-data'; // Import form-data
import fs from "fs"
import { Readable } from 'stream'; // Import Readable to create streams from buffers


dotenv.config();

const apiKey = process.env.REMAKER_API_KEY;


const downloadImage = async (url) => {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary'); // Convert image data to Buffer
};


const image_face_swap = async (req, res) => {
    try {
        const { targetImageUrl, swapImageUrl } = req.body; // Get URLs from the request body

        if (!targetImageUrl || !swapImageUrl) {
            return res.status(400).json({ error: 'Both targetImageUrl and swapImageUrl are required' });
        }

        // Download images as buffers
        const targetImageBuffer = await downloadImage(targetImageUrl);
        const swapImageBuffer = await downloadImage(swapImageUrl);

        // Convert buffers to readable streams
        const targetImageStream = Readable.from(targetImageBuffer);
        const swapImageStream = Readable.from(swapImageBuffer);

        // Create FormData and append the streams
        const formData = new FormData();
        formData.append('target_image', targetImageStream, { filename: 'target_image.jpg' });
        formData.append('swap_image', swapImageStream, { filename: 'swap_image.jpg' });

        // Make the API call to Remaker with FormData
        let endpoint = 'https://developer.remaker.ai/api/remaker/v1/face-swap/create-job';

        const response = await axios.post(endpoint, formData, {
            headers: {
                'Authorization': `${apiKey}`,
                'Accept': 'application/json',
                ...formData.getHeaders(),
            }
        });

        console.log(response.data);
        
        let job_id = response.data.result.job_id;

        const perform_face_swap = async (jobId) => {
            if (jobId) {
                const jobUrl = `https://developer.remaker.ai/api/remaker/v1/face-swap/${jobId}`;

                try {
                    const response = await axios.get(jobUrl, {
                        headers: {
                            'Authorization': `${apiKey}`,
                            'Accept': 'application/json',
                        },
                    });

                    if (response.data.code === 100000) {
                        return res.json({
                            status: true,
                            message: 'Face swap completed successfully!',
                            resultUrl: response.data.result.output_image_url[0],
                        });
                    } else {
                        setTimeout(() => {
                            perform_face_swap(jobId)
                        }, 5000);
                    }


                } catch (error) {
                    return res.json({ status: false, message: 'Error retrieving face swap result', error: error });
                }
            } else {

                return res.json({
                    status: false,
                    message: 'Job Id is required!'
                });
            }
        }

        perform_face_swap(job_id)

    } catch (error) {
        // console.error('Error creating face swap job:', error.response ? error.response.data : error.message);
        console.log(error);

        res.json({ status: false, message: "Error occured while faceswaping", error: 'Error creating face swap job' });
    }
};

export default image_face_swap;