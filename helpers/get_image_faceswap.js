import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let apiKey = process.env.REMAKER_API_KEY;


const get_image_face_swap = async (req, res) => {

    let jobId = req.body.job_id;

    if (jobId) {
        const jobUrl = `https://developer.remaker.ai/api/remaker/v1/face-swap/${jobId}`;

        try {
            const response = await axios.get(jobUrl, {
                headers: {
                    'Authorization': `${apiKey}`,
                    'Accept': 'application/json',
                },
            });

            console.log(response);
            

            return res.json({
                status: true,
                message: 'Face swap completed successfully!',
                resultUrl: response.data,
            });

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


export default get_image_face_swap;