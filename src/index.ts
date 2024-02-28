import express from "express";

// Routers
import { router as replayRouter } from "./routes/replays";
import mongoose from "mongoose";
require("dotenv").config();
const app = express();
const PORT = 8080;
try {
  app.use(express.json());
  
  app.use("/", replayRouter);
  
  app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_CONNECT_URI as string);
    console.log(`Listening on port ${PORT}`);
  });
  
} catch (error) {
  console.log(error);
}
