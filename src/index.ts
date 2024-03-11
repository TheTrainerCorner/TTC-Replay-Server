import express from "express";

// Routers
import { router as replayRouter } from "./server/routes/replays";
import mongoose from "mongoose";
import { discordClient } from "./global/constants";
import { IReplay } from "./server/models/replay";
import ReplayChannels from "./server/models/replayChannels";
import { EmbedBuilder, TextChannel } from "discord.js";
import { Analyzer } from "./bot/analyzer";
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

    const analyzer = new Analyzer();
    const isDone = analyzer.analyze(data.log);
    embed.setTitle(`${data.players[0]} vs ${data.players[1]}`);
    embed.setURL(`https://replay.thetrainercorner.net/${data.id}`);
    embed.setColor(`Green`);
    const analyze = analyzer.data;
    if (isDone) {
            let str = "";
            str += `||Winner: ${analyze.winner}\n`;
            let score = analyze.p1.pokemon.length;
            analyze.p1.pokemon.forEach((x) => {
              if (x.isDead) score -= 1;
            });
            str += "Score: ";
            str += `${score}`;
            str += "-";
            score = analyze.p2.pokemon.length;
            analyze.p2.pokemon.forEach((x) => {
              if (x.isDead) score -= 1;
            });

            str += `${score}||`;
            str += "\n";
            str += "\n";
            str += `${analyze.p1.username}\n||`;
            analyze.p1.pokemon.forEach((x) => {
              str += `${x.pokemon} | ${x.kills} kills | Death: ${x.isDead ? '❌' : '✅'}\n`;
            });
            str += "||\n";
            str += `${analyze.p2.username}\n||`;
            analyze.p2.pokemon.forEach((x) => {
              str += `${x.pokemon} | ${x.kills} kills | Death: ${x.isDead ? '❌' : '✅'}\n`;
            });
            str += "||";
            embed.setDescription(str);
      await channel.send({embeds: [embed]});
    }

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
