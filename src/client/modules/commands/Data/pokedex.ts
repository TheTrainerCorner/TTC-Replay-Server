import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import Grabbers from "../../../utils/grabbers";

export default class PokedexCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName("dex")
        .setDescription("Gets you information about a specific pokemon")
        .addStringOption((options) => {
          options.setName('pokemon');
          options.setDescription('Pokemon you are looking for.');
          options.setRequired(true);
          return options;
        })
    )
  }

  public async invoke(ctx: CommandContext) {
    await ctx.interaction.deferReply();
    let name = ctx.args.getString('pokemon');
    if (!name) {
      await ctx.sendMessageToReply({
        ephemeral: true,
        content: "You need to provided a pokemon's name in order to use this command."
      });
      return;
    }
    let pokedex = await Grabbers.getPokedex();
    let pokemon = pokedex[name.toLowerCase().replace(" ", "").replace("-", "")];

    if(!pokemon) {
      await ctx.sendMessageToReply({
        ephemeral: true,
        content: "That pokemon doesn't seem to exist in our server. Make sure you spelled it correctly.",
      });
      return;
    }

    let embed = new EmbedBuilder();

    embed.setTitle(`Info on ${pokemon.name}`);
    embed.setThumbnail(Grabbers.getSprites(pokemon.name, pokemon.tags ? pokemon.tags.includes("Fakemon") : false));
    embed.setDescription(`Type: ${pokemon.types.join(" | ")}`);
    // Pokemon Abilities
    let abilities = '';
    abilities += pokemon.abilities[0] ? `Ability 1: ${pokemon.abilities[0]}\n` : '';
    abilities += pokemon.abilities[1] ? `Ability 2: ${pokemon.abilities[1]}\n` : '';
    abilities += pokemon.abilities['H'] ? `Hidden Ability: ${pokemon.abilities['H']}\n` : '';
    abilities += pokemon.abilities['S'] ? `Special Ability: ${pokemon.abilities['S']}\n` : '';
    // Base Stats
    let baseStats = '';
    baseStats += `**HP:** \`${pokemon.baseStats.hp}\`\n`;
    baseStats += `**ATK:** \`${pokemon.baseStats.atk}\`\n`;
    baseStats += `**DEF:** \`${pokemon.baseStats.def}\`\n`;
    baseStats += `**SPA:** \`${pokemon.baseStats.spa}\`\n`;
    baseStats += `**SPD:** \`${pokemon.baseStats.spd}\`\n`;
    baseStats += `**SPE:** \`${pokemon.baseStats.spe}\`\n`;
    baseStats += '\n';
    let {hp, atk, def, spa, spd, spe} = pokemon.baseStats;
    baseStats += `**BST:**\`${Math.floor(hp + atk + def + spa + spd + spe)}\`\n`;
    // Adding the data in
    embed.addFields(
      {name: "Abilities", value: abilities},
      {name: "Base Stats", value: baseStats},
    )
    embed.setColor("Red");

    await ctx.interaction.editReply({
      embeds: [embed],
    });

  }
}