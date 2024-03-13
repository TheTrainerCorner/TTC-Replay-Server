import {
  CommandInteraction,
  CommandInteractionOptionResolver,
} from "discord.js";
import Cache from "../core/cache";

import CommandContext from "../contexts/CommandContext";
import { client } from "../core/client";

export default class Handler {
  public async handleCommands(name: string, interaction: CommandInteraction) {
    try {
      let command = Cache.bot.modules.commands.get(name);

      if (!command) { 
        console.log(`Command ${name} doesn't seem to exist!`);
        return;
      }
      if (command.disabled) {
        await interaction.reply({
          ephemeral: true,
          content: `Command \`${command.name}\` is disabled at the moment. Please try again later.`,
        });
        console.warn(`Command ${name} is currently disabled`);
        return;
      }
      let ctx = new CommandContext(interaction, interaction.options as CommandInteractionOptionResolver);
      await command.invoke(ctx);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  public async handleEvents(name: string) {
    try {
      let event = Cache.bot.modules.events.get(name);
      
      if (!event) {
        console.log(`Event ${name} doesn't seem to exist!`);
        return;
      }
      
      if (event.disabled) {
        console.warn(`Event ${event.name} is disabled!`);
        return;
      }

      if (event.onlyOnce)
        client.discord.once(event.name, async (...args) => await event?.invoke(...args));
      else
        client.discord.on(event.name, async (...args) => await event?.invoke(...args));
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  public async handleServerEvents(name: string) {
    try {
      let serverEvent = Cache.server.events.get(name);

      if (!serverEvent) {
        console.log(`Server Event ${name} doesn't seem to exist!`);
        return;
      }
      
      if (serverEvent.disabled) {
        console.warn(`Server Event ${serverEvent.name} is disabled!`);
        return;
      }

      client.on(serverEvent.name, async (...args) => await serverEvent?.invoke(...args));
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  public async handleMonitors(name: string, ...args: any[]) {
    try {
      let monitor = Cache.bot.modules.monitors.get(name);

      if (!monitor) {
        console.warn(`Monitor ${name} doesn't seem to exist.`);
        return null;
      }

      if (monitor.disabled) {
        console.warn(`Monitor ${monitor.name} is disabled right now!`);
        return null;
      }

      await monitor.invoke(...args);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  public async handleTask(name: string, ...args: any[]) {
    try {
      let task = Cache.bot.modules.tasks.get(name);

      if (!task) {
        console.warn(`Task ${name} doesn't seem to exist.`);
        return null;
      }

      if (task.disabled) {
        console.warn(`Task ${task.name} is disabled right now!`);
        return null;
      }

      await task.invoke(...args);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}