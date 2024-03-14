import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Grabbers from "../../../utils/grabbers";

export default class MoveCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("move")
        .setDescription("Gets data on a move")
        .addStringOption((options) => {
          options.setName("name");
          options.setDescription("The name of the move");
          options.setRequired(true);
          return options;
        })
    );
  }

  public async invoke(ctx: CommandContext) {
    await ctx.interaction.deferReply();
    
    let name = ctx.args.getString('name');

    if (!name) {
      await ctx.interaction.editReply({
        content: "You need to give a name of a move.",
      });
      return;
    }

    let moves = await Grabbers.getMoves();
    let move = moves[name.toLowerCase().replace(/\s/g, "").replace(/-/g, "")];

    if (!move) {
      await ctx.interaction.editReply({
        content: "That move doesn't seem to exist!",
      });
      return;
    }

    let embed = new EmbedBuilder();

    embed.setTitle(`Move: ${move.name}`);
    embed.setDescription(`\`\`\`${move.desc ? move.desc : move.shortDesc}\`\`\``);
    embed.setFields(
      {name: "Type", value: `**${move.type}**`, inline: true},
      {name: "Base Power", value: `\`${move.basePower === 0 ? '---' : move.basePower}\``, inline: true},
      {name: "Accuracy", value: `\`${move.accuracy === true ? '---' : `${move.accuracy}%`}\``, inline: true},
      {name: "Category", value: `**${move.category}**`, inline: true},
    );

    if (move.flags && Object.keys(move.flags).length !== 0) {
      embed.addFields({name: "Flags", value: `**${Object.keys(move.flags).join(' | ')}**`, inline: true});
    }

    embed.setColor("Red");

    await ctx.interaction.editReply({
      embeds: [embed]
    });
  }
}