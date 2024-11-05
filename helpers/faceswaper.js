import axios from "axios";


const faceswapper = async (req, res) => {

    const apiEndpoint = "https://api.piapi.ai/api/v1/task";
    
    const headers = {
      'x-api-key': '7a82db5852274a26130b184c162703db4c36a8c907b6d1fcb1ca23d762f92b5f',
      'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
      'Content-Type': 'application/json',
    };
    
    const data = JSON.stringify({
      "model": "Qubico/image-toolkit",
      "task_type": "face-swap",
      "input": {
        "target_image": "https://i.ibb.co/LnLYwhR/66f41e64b1922.jpg",
        "swap_image": "https://i.ibb.co/m9BFL9J/ad61a39afd9079e57a5908c0bd9dd995.jpg"
      }
    });
    

    try {
        const response = await axios.post(apiEndpoint, data, { headers });
        return res.json({faceswap: true, data: response.data})
    } catch (error) {
        return res.json({faceswap: false, error})
    }
    
}

export default faceswapper