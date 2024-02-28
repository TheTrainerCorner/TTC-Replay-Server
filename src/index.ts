import express from "express";

// Routers
import {router as replayRouter} from "./routes/replays";
import mongoose from "mongoose";
require("dotenv").config();
const app = express();
const PORT = 9000;

app.use("/replays", replayRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  mongoose.connect(process.env.MONGODB_CONNECT_URI as string);
  console.log(`Listening on port ${PORT}`);
});
