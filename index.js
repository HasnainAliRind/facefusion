import express from "express";
import initWebRoutes from "./routes/web.js";
import cors from "cors";
import path from "path";
import {dirname} from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let app = express();

// dotenv.config()

app.use(cors());

initWebRoutes(app);

app.listen(8082, () => {
    console.log("Backend is running at http://localhost:8082....");
});