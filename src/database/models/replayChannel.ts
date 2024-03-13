import { Schema, model } from "mongoose";

export interface IReplayChannel {
  format_id: string;
  channel_id: string;
}

const ReplayChannelSchema = new Schema<IReplayChannel>({
  format_id: String,
  channel_id: String,
});

export default model<IReplayChannel>("replay_channels", ReplayChannelSchema);