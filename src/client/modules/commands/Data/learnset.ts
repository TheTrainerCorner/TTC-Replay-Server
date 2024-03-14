import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Grabbers from "../../../utils/grabbers";

export default class LearnsetCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('learnset')
        .setDescription('Gets the learnset of a pokemon')
        .addStringOption((options) => {
          options.setName('pokemon');
          options.setDescription('The pokemon you are looking for.');
          options.setRequired(true);
          return options;
        })
    )
  }

  public async invoke(ctx: CommandContext) {
    await ctx.interaction.deferReply();
    let name = ctx.args.getString('pokemon');
    if (!name) {
      await ctx.interaction.editReply({
        content: "You need to give a pokemon's name.",
      });
      return;
    }
    let pokedex = await Grabbers.getPokedex();
    let learnsets = await Grabbers.getLearnset();
    let moves = await Grabbers.getMoves();
    let pokemon = pokedex[name.toLowerCase().replace(" ", "").replace("-", "")];
    if(!pokemon) {
      await ctx.interaction.editReply({
        content: "That pokemon doesn't seem to exist in our server.",
      });
      return;
    }
    let learnset = learnsets[(pokemon.forme && pokemon.forme === "Mega") ? pokemon.baseSpecies : pokemon.name.toLowerCase().replace(" ", "").replace("-", "")];
    let embed = new EmbedBuilder();
    embed.setTitle(`Learnset for ${pokemon.name}`);
    embed.setThumbnail(Grabbers.getSprites(pokemon.name, pokemon.tags ? pokemon.tags.includes("Fakemon") : false));
    let _moves = Object.keys(learnset.learnset);
    let str = "";
    _moves.forEach((x) => {
      str += `${moves[x].name} - ${moves[x].type}\n`;
    })
    embed.setDescription(`\`\`\`${str}\`\`\``);
    embed.setColor("Red");
    await ctx.interaction.editReply({
      embeds: [embed],
    });
  }
}