import { Schema, model } from "mongoose";

export interface IShowdownServer {
  discord_user_id: string; // 304446682081525772
  server_name: string; // The Trainer's Corner
  path_name: string; // ttc
  server_url: string;
  test_server_url?: string;
}

const ShowdownServerSchema = new Schema<IShowdownServer>({
  discord_user_id: String,
  server_name: String,
  path_name: String,
  server_url: String,
  test_server_url: String,
});

export default model<IShowdownServer>("showdown_servers", ShowdownServerSchema)