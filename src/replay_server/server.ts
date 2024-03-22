import express from "express";
import mongoose from "mongoose";
import { Config } from "../global/config";

// import routes
import { router as mainRouter } from "./routes/main";
import { router as serverRouter } from "./routes/servers";

const app = express();

try {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/", mainRouter, serverRouter);

  // Template Engine
  app.set("view engine", "pug");
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/views/assets'));

  app.listen(Config.REPLAY_SERVER_PORT, async () => {
    console.log(`Replay Server is ready to serve!`);
    console.log(`Listening on port ${Config.REPLAY_SERVER_PORT}`);
  });
} catch (error) {
  console.log(error);
}
