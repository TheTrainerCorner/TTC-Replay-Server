import { SlashCommandBuilder } from "discord.js";
import CommandContext from "../contexts/CommandContext";

export abstract class BaseCommand {
	private _slashData: SlashCommandBuilder;
	private _disabled: boolean;
	
	constructor(slashData: SlashCommandBuilder, disabled: boolean = false) {
		this._slashData = slashData;
		this._disabled = disabled;
	}

	public async invoke(ctx: CommandContext) {
		"Not implemented yet."
	}

	public get name() {
		return this._slashData.name;
	}

	public toJson() {
		return this._slashData.toJSON()
	}

	public get data() {
		return this._slashData;
	}

	public get disabled() {
		return this._disabled;
	}

	public set disabled(disabled: boolean) {
		this._disabled = disabled;
	}
}