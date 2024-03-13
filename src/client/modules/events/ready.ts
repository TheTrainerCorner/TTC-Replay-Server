import { ActivityType } from "discord.js";
import BaseEvent from "../../bases/BaseEvent";
import { client } from "../../core/client";

export default class ReadyEvent extends BaseEvent {

	constructor() {
		super('ready', true, false);
	}
	
	public async invoke(...args: any[]) {
    
    client.discord.user?.setActivity({
      name: `to serve!`,
      type: ActivityType.Competing
    });
    client.discord.user?.setStatus('online');

    await import('./../../utils/deployer');
	}
}