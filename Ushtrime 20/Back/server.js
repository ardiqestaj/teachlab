import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/routes.js";
import cors from "cors";

const app = express();

app.use(cors("*"));

dotenv.config();

app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/v1", routes);

// app.get("/", (req, res) => {
//   res.send("Welcome to the travel Booking API")
// })

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
