import { Schema, model } from "mongoose";

export interface IReplay {
  id: string;
  p1: string;
  p2: string;
  format: string;
  log: string;
  inputlog: string;
  uploadtime: string;
  views: string;
  p1id: string;
  p2id: string;
  formatid: string;
  rating: string;
  private: string;
  password?: string;
}

const replaySchema = new Schema<IReplay>({
  id: String,
  p1: String,
  p2: String,
  format: String,
  log: String,
  inputlog: String,
  views: String,
  p1id: String,
  p2id: String,
  formatid: String,
  rating: String,
  private: String,
  password: String,
});

export default model<IReplay>("replays", replaySchema);