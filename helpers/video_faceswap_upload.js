import multer from 'multer';
import path from 'path';

// Configure Multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'video_faceswap_uploads/'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    }
});

const video_face_swap_upload = multer({ storage: storage });

export default video_face_swap_upload;
