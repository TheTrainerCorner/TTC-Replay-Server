import { CommandInteraction } from "discord.js";
import BaseMonitor from "../../bases/BaseMonitor";
import Cache from "../../core/cache";
import Handler from "../../utils/handler";

export default class SlashCommandMonitor extends BaseMonitor {
  constructor() {
    super('slash_command', false);
  }

  public async invoke(interaction: CommandInteraction) {
    console.log(`Slash Command has been triggered`);

    await new Handler().handleCommands(interaction.commandName, interaction);
  }
}