import { Collection } from "discord.js";
import { BaseCommand } from "../bases/BaseCommand";
import BaseEvent from "../bases/BaseEvent";
import BaseMonitor from "../bases/BaseMonitor";
import BaseTask from "../bases/BaseTask";
import BaseServerEvent from "../bases/BaseServerEvent";

export default class Cache {
  public static readonly bot = {
    modules: {
      commands: new Collection<string, BaseCommand>(),
      events: new Collection<string, BaseEvent>(),
      monitors: new Collection<string, BaseMonitor>(),
      tasks: new Collection<string, BaseTask>(),
    }
  }
  public static readonly server = {
    events: new Collection<string, BaseServerEvent>(),
  }
}