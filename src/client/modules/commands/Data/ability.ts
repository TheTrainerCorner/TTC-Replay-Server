import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Grabbers from "../../../utils/grabbers";

export default class AbilityCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('ability')
        .setDescription("Shows data on an ability")
        .addStringOption((options) => {
          options.setName('name');
          options.setDescription('The name of the ability');
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
        content: "You need to give a name of an ability."
      });
      return;
    }

    let abilities = await Grabbers.getAbilities();
    let ability = abilities[name.toLowerCase().replace(/\s/g, "").replace(/-/g, "")];
    if (!ability) {
      await ctx.interaction.editReply({
        content: "That ability doesn't seem to exist!",
      });
      return;
    }

    let embed = new EmbedBuilder();

    embed.setTitle(`Ability: ${ability.name}`);
    embed.setDescription(`\`\`\`${ability.desc ? ability.desc : ability.shortDesc}\`\`\``);
    embed.setColor("Red");
    await ctx.interaction.editReply({
      embeds: [embed]
    });
  }
}