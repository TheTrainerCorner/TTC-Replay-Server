import { Client, IntentsBitField } from "discord.js";
import EventEmitter from "events";
import { Config } from "../../global/config";
import { IDiscordClient } from "../interfaces/IDiscordClient";
import Loader from "../utils/loader";
import Handler from "../utils/handler";
import cache from "./cache";

export class DiscordClient extends EventEmitter implements IDiscordClient {
  discord: Client;
  constructor() {
    super();
    this.discord = new Client({
      intents: IntentsBitField.Flags.Guilds | IntentsBitField.Flags.GuildMessages | IntentsBitField.Flags.MessageContent,
    });
    
  }

  async connect() {
    let loader = new Loader();
    let handler =new Handler();
    await loader.loadCommands();
    await loader.loadEvents();
    await loader.loadServerEvents();
    await loader.loadMonitors();
    await loader.loadTasks();
    console.log(`Running Events Now....`);
    cache.bot.modules.events.forEach(async (x) => {
      await handler.handleEvents(x.name);
    });
    console.log(`Running Server Events Now....`);
    cache.server.events.forEach(async (x) => {
      await handler.handleServerEvents(x.name);
    })
    console.log('All events and server events been ran!');
    await this.discord.login(Config.DISCORD_CLIENT_TOKEN);
  }
}