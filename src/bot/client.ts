import { Client, IntentsBitField } from "discord.js";
import EventEmitter from "events";
import { IDiscordClient } from "./interfaces/IDiscordClient";

export class DiscordClient extends EventEmitter implements IDiscordClient {
  discord: Client;
  constructor() {
    super();
    this.discord = new Client({
      intents: IntentsBitField.Flags.Guilds | IntentsBitField.Flags.GuildMessages | IntentsBitField.Flags.MessageContent,
    });
  }

  async connect() {
    await this.discord.login(process.env.DISCORD_CLIENT_TOKEN);
  }
}