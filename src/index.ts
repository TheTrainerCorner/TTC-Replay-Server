import mongoose from "mongoose";
import { Config } from "./global/config";
require("dotenv").config();
require("./replay_server/server");
try {
  (async () => {
    await mongoose.connect(Config.MONGODB_CONNECT_URL as string);
  })();
} catch (error) {
  console.log(error);
}
