import fs from "fs";
import express from "express";
import cors from "cors";

// ------------------------------------------------
// to create the project for the first time run in terminal:
// npm init
//
// ------------------------------------------------
//to run this project dont foregt to install:
// run npm install
// npm install nodemon
// to start the project run:
// npm run start

// Dont forget in install Postman to test the API
const app = express();
app.use(express.json());
app.use(cors());
const readData = () => {
  try {
    const data = fs.readFileSync("data.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {}
};

const writeData = (data) => {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf8");
};

// get request
app.get("/destinations", (req, res) => {
  // console.log("destination");
  const data = readData();
  res.json(data);

  const arr = ["dff", "dfdf", "uyi", "tryret"];
  console.log(arr.length);
  console.log(arr[arr.length - 1]);
});

app.post("/destinations", (req, res) => {
  const data = readData();
  const newDestination = req.body;
  newDestination.id = data.length ? data[data.length - 1].id + 1 : 1;
  // if (data.length) {
  //  newDestination.id = data[data.length - 1].id + 1;
  // } else {
  //   newDestination.id = 1
  // }
  console.log(req.body);
  data.push(newDestination);
  writeData(data);
  res.status(201).json(newDestination);
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
