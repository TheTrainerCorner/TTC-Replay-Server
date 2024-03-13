import { SlashCommandBuilder } from "discord.js";
import { BaseCommand } from "../../../bases/BaseCommand";
import CommandContext from "../../../contexts/CommandContext";
import { client } from "../../../core/client";

export default class LatencyCommand extends BaseCommand {
  constructor() {
    super(
      new SlashCommandBuilder()
        .setName('latency')
        .setDescription("Displays the bot's latency."),
        false
    );
  }

  public async invoke(ctx: CommandContext) {
    await ctx.sendMessageToReply({
      ephemeral: true,
      content: `Pong! ${client.discord.ws.ping} ms!`
    });
  }
}