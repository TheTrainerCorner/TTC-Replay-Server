import { Schema, model } from "mongoose";

export interface IShowdownServer {
  owner_username: string; // Koreanpanda345
  server_name: string; // The Trainer's Corner
  path_name: string; // ttc
  server_url: string; // https://play.thetrainercorner.net
  test_server_url?: string;
  dex_site_url?: string;
  description?: string;
  banner_image_url?: string;
  discord_server_url?: string;
}

const ShowdownServerSchema = new Schema<IShowdownServer>({
  owner_username: String,
  server_name: String,
  path_name: String,
  server_url: String,
  test_server_url: String,
  dex_site_url: String,
  description: String,
  banner_image_url: String,
  discord_server_url: String,
});

export default model<IShowdownServer>("showdown_servers", ShowdownServerSchema)