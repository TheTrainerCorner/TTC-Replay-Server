import express from "express";
import mongoose from "mongoose";
import { Config } from "../global/config";

// import routes
import { router as replayRouter } from "./routes/replay";

const app = express();

try {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  
  // Routes
  app.use("/", replayRouter);
  
  app.listen(Config.REPLAY_SERVER_PORT, async () => {
    console.log(`Replay Server is ready to serve!`);
    console.log(`Listening on port ${Config.REPLAY_SERVER_PORT}`);
  })
} catch (error) {
  console.log(error);
}