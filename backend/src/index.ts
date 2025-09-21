import express from "express";
import mainRouter from "./routes/index";
import dotenv from "dotenv";
import cors from "cors";

// to load all the .env variables in process.env
dotenv.config();
const app = express();

// CORS = Cross-Origin Resource Sharing.
// By default, browsers block requests from one origin
// cors() middleware tells Express:
// “Yes, it’s okay for frontend running at localhost:3000 (Next.js) to call my backend API at localhost:5000
app.use(cors());
// this lets express parse the incoming JSON bodies
// otherwise req.body will be undefined
app.use(express.json());

app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
