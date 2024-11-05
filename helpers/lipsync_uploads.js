import multer from 'multer';
import path from 'path';

// Configure Multer for disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'lipsync_uploads/'); // Specify the directory to save files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Create a unique filename
    }
});

const lipsync_uploads = multer({ storage: storage });

export default lipsync_uploads;
