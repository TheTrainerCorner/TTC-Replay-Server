import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Replay, { IReplay } from "../../../../database/models/replay";
import { Types, Document } from "mongoose";

export default class GetReplaysCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('get_replay')
        .setDescription("Gets a replay by the id number")
        .addStringOption((options) => {
          options.setName('id');
          options.setDescription('The id number of the replay');
          options.setRequired(true);
          return options;
        }),
        false
    )
  }

  public async invoke(ctx: CommandContext) {
    const replays = await Replay.find();
    let list: Array<Document<unknown, {}, IReplay> & IReplay & {
      _id: Types.ObjectId;
  }> = [];
    replays.forEach((x) => {
      if (x.id !== undefined && x.id.endsWith(ctx.args.getString('id'))) list.push(x);
    });

    let embed = new EmbedBuilder();

    embed.setTitle(`Replays`);
    let desc = "The following replays were found:\n";
    for (let replay of list) {
      embed.addFields({
        name: `${replay.players[0]} vs ${replay.players[1]} - ${replay.format}`,
        value: `https://replay.thetrainercorner.net/${replay.id}`,
      });
    }
    embed.setDescription(desc);
    await ctx.sendMessageToReply({
      ephemeral: true,
      embeds: [embed],
    });
  }
}