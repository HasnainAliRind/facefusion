import dotenv from "dotenv";
import axios from "axios"

dotenv.config();

const apiKey = process.env.LIPSYNC_API_KEY;


const lipsync = async (req, res) => {

    // Getting video & audio from frontend 
    try {
        const { targeted_video_url, targeted_audio_url } = req.body; // Access the uploaded files directly

        if (!targeted_video_url || !targeted_audio_url) {
            return res.status(400).json({ status: false, message: "Both video and audio are required", error: 'Both video and audio are required' });
        }

        const body = JSON.stringify({
            model: "lipsync-1.8.0-beta",
            input: [
                { type: "video", url: targeted_video_url },
                { type: "audio", url: targeted_audio_url },
            ],
            options: {
                pads: [0, 5, 0, 0],
                speedup: 1,
                output_format: "mp4",
                fps: 24,
                output_resolution: [1280, 720],
            }
        });
        
        
        const response = await axios.post("https://api.sync.so/v2/generate", body, {
            headers: {
                'x-api-key': apiKey,
                'Content-Type': 'application/json',
            }
        });


        return res.json({status: true, job_id: response.data.id})
        
    } catch (error) {
        console.error('Error processing LipSync request:', error);
        res.json({ status: false, message: "Error Occured While sending this to backend", error: 'Internal Server Error' });
    }
}

export default lipsync