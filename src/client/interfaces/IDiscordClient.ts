import { IReplay } from "../../database/models/replay";


export interface IDiscordClientEvents {
  sendReplay: (data: IReplay) => Promise<void>;
}

export interface IDiscordClient {
  on<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  once<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  off<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  emit<Event extends keyof IDiscordClientEvents>(event: Event, ...args: Parameters<IDiscordClientEvents[Event]>): boolean;
  connect(): Promise<any>;
}