import { CommandInteraction, Interaction } from "discord.js";
import BaseEvent from "../../../bases/BaseEvent";
import CommandContext from "../../../contexts/CommandContext";
import Handler from "../../../utils/handler";

export default class InteractionCreateEvent extends BaseEvent {
  constructor() {
    super('interactionCreate', false, false);
  }

  public async invoke(interaction: Interaction) {
    try {
      if (interaction.isCommand()) {
        new Handler().handleMonitors('slash_command', interaction as CommandInteraction);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}