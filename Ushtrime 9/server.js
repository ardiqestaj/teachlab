import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js"
const app = express();

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/v1", routes)



connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
