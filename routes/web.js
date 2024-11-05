import express from 'express';
import dotenv from 'dotenv';
import image_face_swap from '../helpers/image-faceswap.js';
import video_face_swap from '../helpers/video-faceswap.js';
import lipsync from '../helpers/lipsync.js';
import get_lipsync from '../helpers/get_lipsync.js';
import get_video_face_swap from '../helpers/get_videofaceswap.js';
import get_image_face_swap from '../helpers/get_image_faceswap.js';
import generateImages from '../helpers/generate-images.js';

dotenv.config();

const initWebRoutes = (app) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        return res.json({ status: true, response: "App is working fine" });
    });

    // router.post("/generate-image", generate_image);
    router.post("/generate-images", generateImages);
    
    router.post("/image-faceswap", image_face_swap);
    router.post("/get_image_face_swap", get_image_face_swap);

    router.post("/video_face_swap", video_face_swap);
    router.post("/get_video_face_swap", get_video_face_swap);

    router.post("/lipsync", lipsync);
    router.post("/get_lipsync", get_lipsync);

    return app.use("/", router);
};

export default initWebRoutes;
