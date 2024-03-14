import { glob } from "glob";
import { BaseCommand } from "../bases/BaseCommand";
import cache from "../core/cache";
import BaseEvent from "../bases/BaseEvent";
import BaseMonitor from "../bases/BaseMonitor";
import BaseTask from "../bases/BaseTask";
import BaseServerEvent from "../bases/BaseServerEvent";

export default class Loader {
  public modulesFolder = "modules";
  public rootFolder = "src/client";
  public commandFolder = "commands";
  public eventFolder = "events";
  public serverEventFolder = "servers";
  public monitorFolder = "monitors";
  public taskFolder = "tasks";

  public async loadCommands() {
    console.log(`Loading Commands....`);
    const pth = this.createPath(this.commandFolder);
    const files = glob.sync(pth);

    for (let file of files) {
      const { default: cmd } = await import(this.fixPath(file));
      const command = new cmd() as BaseCommand;

      if (!cache.bot.modules.commands.has(command.name)) {
        cache.bot.modules.commands.set(command.name, command);
      }
    }
    console.log(
      `Successfully loaded ${cache.bot.modules.commands.size} commands!`
    );
  }

  public async loadEvents() {
    console.log(`Loading Events....`);
    const pth = this.createPath(this.eventFolder);
    const files = glob.sync(pth);
    for (let file of files) {
      const { default: evt } = await import(this.fixPath(file));

      const event = new evt() as BaseEvent;

      if (!cache.bot.modules.events.has(event.name)) {
        cache.bot.modules.events.set(event.name, event);
      }
    }

    console.log(`Successfully loaded ${cache.bot.modules.events.size} events!`);
  }

  public async loadServerEvents() {
    console.log(`Loading Server Events.....`);
    const pth = this.createPath(this.serverEventFolder);
    const files = glob.sync(pth);
    for (let file of files) {
      const { default: srv } = await import(this.fixPath(file));

      const serverEvent = new srv() as BaseServerEvent;

      if (!cache.server.events.has(serverEvent.name)) {
        cache.server.events.set(serverEvent.name, serverEvent);
      }
    }
    console.log(`Successfully loaded ${cache.server.events.size} server events`);
  }

  public async loadMonitors() {
    console.log(`Loading Monitors....`);
    const pth = this.createPath(this.monitorFolder);
    const files = glob.sync(pth);
    for (let file of files) {
      const { default: mon } = await import(this.fixPath(file));

      const monitor = new mon() as BaseMonitor;

      if (!cache.bot.modules.monitors.has(monitor.name)) {
        cache.bot.modules.monitors.set(monitor.name, monitor);
      }
    }
    console.log(
      `Successfully loaded ${cache.bot.modules.monitors.size} monitors!`
    );
  }

  public async loadTasks() {
    console.log(`Loading Tasks....`);
    const pth = this.createPath(this.taskFolder);
    const files = glob.sync(pth);
    for (let file of files) {
      const { default: tsk } = await import(this.fixPath(file));

      const task = new tsk() as BaseTask;

      if (!cache.bot.modules.tasks.has(task.name)) {
        cache.bot.modules.tasks.set(task.name, task);
      }
    }

    console.log(`Successfully loaded ${cache.bot.modules.tasks.size} tasks!`);
  }

  private createPath(dir: string) {
    return `./${this.rootFolder}/${this.modulesFolder}/${dir}/**/*.ts`;
  }

  private fixPath(path: string) {
    let newPath = path.replace(/\\/g, "/");
    return newPath.replace(this.rootFolder, "..");
  }
}