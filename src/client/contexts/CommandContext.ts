import { CommandInteraction, CommandInteractionOptionResolver, InteractionReplyOptions, MessageCreateOptions, MessagePayload, MessageReplyOptions } from "discord.js";

export default class CommandContext {
	private _interaction: CommandInteraction;
	private _args: CommandInteractionOptionResolver;

	constructor(interaction: CommandInteraction, args: CommandInteractionOptionResolver) {
		this._interaction = interaction;
		this._args = args;
	}

	public get interaction() {
		return this._interaction;
	}

	async sendMessageToAuthor(options: string | MessagePayload | MessageCreateOptions) {
		let dm = await this._interaction.user.createDM()
		await dm.send(options)
	}

	sendMessageToChannel(options: string | MessagePayload | MessageCreateOptions) {
		return this._interaction.channel?.send(options);
	}

	sendMessageToReply(options: InteractionReplyOptions) {
		return this._interaction.reply(options);
	}

	public get args () {
		return this._args;
	}
}