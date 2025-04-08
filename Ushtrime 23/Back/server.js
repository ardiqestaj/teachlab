import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors("*"));

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;
import { fileURLToPath } from "url";

// Determine the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", routes);

// app.get("/", (req, res) => {
//   res.send("Welcome to the travel Booking API")
// })

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
