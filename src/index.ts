import mongoose from "mongoose";
import { client } from "./client/core/client";
import { Config } from "./global/config";

require('./replay_server/server');
require('dotenv').config();

try {
  (async () => {
    await mongoose.connect(Config.MONGODB_CONNECT_URL as string);
    await client.connect();
  })();
} catch (error) {
  console.log(error);
}