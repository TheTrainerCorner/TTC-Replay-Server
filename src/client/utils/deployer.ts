import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import cache from '../core/cache';
import { client } from '../core/client';
import { Config } from '../../global/config';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
cache.bot.modules.commands.forEach((x) => {
  commands.push(x.data.toJSON());
});

const rest = new REST({ version: '10' }).setToken(Config.DISCORD_CLIENT_TOKEN as string);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data: any = await rest.put(Routes.applicationGuildCommands(client.discord.user?.id as string, Config.DISCORD_GUILD_ID as string), { body: commands });
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (err) {
    console.log(err);
    return null;
  }
})();