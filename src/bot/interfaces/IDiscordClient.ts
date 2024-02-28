import { IReplay } from "../../server/models/replay";

export interface IDiscordClientEvents {
  sendReplay: (data: IReplay, server_url?: string) => Promise<void>;
}

export interface IDiscordClient {
  on<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  once<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  off<Event extends keyof IDiscordClientEvents>(event: Event, listener: IDiscordClientEvents[Event]): this;
  emit<Event extends keyof IDiscordClientEvents>(event: Event, ...args: Parameters<IDiscordClientEvents[Event]>): boolean;
  connect(): Promise<any>;
}