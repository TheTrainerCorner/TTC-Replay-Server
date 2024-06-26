import { Schema, model } from "mongoose";

export interface IReplay {
  id: string;
  log: string;
  players: string[];
  format: string;
  rating?: string;
  private?: string;
  password?: string;
  inputlog?: string;
  uploadtime?: string;
  path_name?: string;
}

const ReplaySchema = new Schema<IReplay>({
  id: String,
  log: String,
  players: [String],
  format: String,
  rating: String,
  private: String,
  password: String,
  inputlog: String,
  uploadtime: String,
  path_name: String,
});

export default model<IReplay>("replays", ReplaySchema);