import { EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Replay from "../../../../database/models/replay";
import ReplayChannel, { IReplayChannel } from "../../../../database/models/replayChannel";
import { client } from "../../../core/client";
import { Analyzer } from "../../../core/analyzer";
import { Types, Document } from "mongoose";

export default class AnalyzeReplayCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("analyze_replay")
        .setDescription("Analyzes a replay")
        .addStringOption((x) => {
          x.setName("replay_id");
          x.setDescription("The id of the replay");
          x.setRequired(true);
          return x;
        })
    );
  }

  public async invoke(ctx: CommandContext) {
    let id = ctx.args.getString("replay_id");

    let replay = await Replay.findOne({ id: id });

    if (!replay) {
      await ctx.sendMessageToReply({
        ephemeral: true,
        content: "There doesn't seem to be a replay under that id!",
      });
      return;
    }
    const embed = new EmbedBuilder();

    const analyzer = new Analyzer();
    const isDone = analyzer.analyze(replay.log);
    embed.setTitle(`${replay.players[0]} vs ${replay.players[1]}`);
    embed.setURL(`https://replay.thetrainercorner.net/${replay.id}`);
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
        str += `${x.pokemon} | ${x.kills} kills | Death: ${
          x.isDead ? "❌" : "✅"
        }\n`;
      });
      str += "||\n";
      str += `${analyze.p2.username}\n||`;
      analyze.p2.pokemon.forEach((x) => {
        str += `${x.pokemon} | ${x.kills} kills | Death: ${
          x.isDead ? "❌" : "✅"
        }\n`;
      });
      str += "||";
      embed.setDescription(str);
      await ctx.sendMessageToReply({ephemeral: true, content: "Analyzed the replay!"});
      await ctx.sendMessageToChannel({ embeds: [embed] });
    }
  }
}
