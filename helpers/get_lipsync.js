import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let apiKey = process.env.LIPSYNC_API_KEY;

const get_lipsync = async (req, res) => {
    let job_id = req.body.job_id;

    if (job_id) {
        
        let endpoint = `https://api.sync.so/v2/generate/${job_id}`;
        
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json',
                }
            });
    
            return res.json({
                status: true,
                message: "Results Fetched!",
                response: response.data
            });    
        } catch (error) {
            return res.json({
                status: false,
                message: "Error Occured in the backend!",
                error
            })   
        }

    } else {
        return res.json({
            status: false,
            message: "Job Id is missing!"
        })
    }
}

export default get_lipsync;