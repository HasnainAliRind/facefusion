import axios from "axios";
import dotenv from "dotenv";

dotenv.config()

const generateImages = async (req, res) => {
    const url = "https://modelslab.com/api/v6/realtime/text2img";
    const apiKey = process.env.IMAGEN_API_KEY;

    // Extracting parameters from the request body
    const { prompt, width, height, samples } = req.body;

    const body = {
        key: apiKey,
        prompt: prompt,
        width: width,
        height: height,
        samples: samples.toString(),
        num_inference_steps: "20",
        safety_checker: false,
        enhance_prompt: true,
        temp: true,
        seed: 1.5,
        guidance_scale: 7.5,
        webhook: null,
        track_id: null
    };

    console.log(prompt);


    const fetchQueuedImages = async (url, id, resp) => {

        let endpoint = url;
        let body = {
            key: apiKey,
            request_id: id
        }

        let response = await axios.post(endpoint, body,resp)
        console.log("entered to fetch images");


        if (response.data.status == "processing") {
            setTimeout(() => {
                fetchQueuedImages(url, id, resp)
            }, 4000);
        } else if (response.data.status == "success") {
            return resp.json({
                status: true,
                images: response.data.output
            })
        } else {
            return resp.json({
                status: false,
                images: [],
                message: "Something went wrong while getting the images"
            })
        }
    }

    try {
        const response = await axios.post(url, body, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("generating to fetch images");

        console.log(response.data);
        
        // Send the response data back to the client
        if (response.data.status == "processing") {
            
            let fetch_id = response.data.id;
            console.log("generating to fetch images");
            setTimeout(() => {
                fetchQueuedImages(`https://modelslab.com/api/v6/realtime/fetch/${fetch_id}`, fetch_id, res);
            }, 3000);    
        } else if(response.data.status == "success") {
            return res.json({
                status: true, 
                images: response.data.output
            });
        }   
        else {
            return res.json({
                status: false, 
                message: "couldn't generate images",
                images: []
            });
        }
    } catch (error) {
        console.error("Failed to generate image:", error);
        res.send({generation: false, error_message: "Error generating image", error});
    }
}

export default generateImages