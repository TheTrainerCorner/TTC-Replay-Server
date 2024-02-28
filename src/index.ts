import express from "express";

// Routers
import { router as replayRouter } from "./server/routes/replays";
import mongoose from "mongoose";
import { discordClient } from "./global/constants";
import { IReplay } from "./server/models/replay";
import ReplayChannels from "./server/models/replayChannels";
import { EmbedBuilder, TextChannel } from "discord.js";
require("dotenv").config();
const app = express();
const PORT = 8080;
try {
  app.use(express.json());

  app.use("/", replayRouter);

  discordClient.on("sendReplay", async(data: IReplay) => {
    console.log(data);
    const replayChannel = await ReplayChannels.findOne({format_id: data.format});

    if (!replayChannel) return;

    const channel = await discordClient.discord.channels.fetch(replayChannel.channel_id) as TextChannel;
    
    if (!channel) return;
    const embed = new EmbedBuilder();

    embed.setTitle(`${data.players[0]} vs ${data.players[1]}`);
    embed.setURL(`https://replay.thetrainercorner.net/${data.id}`);
    embed.setColor(`Green`);
    await channel.send({embeds: [embed]});
  });

  app.listen(PORT, async () => {
    mongoose.connect(process.env.MONGODB_CONNECT_URI as string);
    await discordClient.connect();
    discordClient.discord.on("ready", async () => {
      await discordClient.discord.user?.setActivity({
        name: "Ready to Serve"
      });
      console.log(`Bot is logged in and ready to serve!`);
    });


    console.log(`Listening on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
}
