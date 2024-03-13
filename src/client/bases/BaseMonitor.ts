export default abstract class BaseMonitor {
	private _name: string;
	private _disabled: boolean;
	
	constructor(name: string, disabled: boolean = false) {
		this._name = name;
		this._disabled = disabled;
	}

	public invoke(...args: any[]) {
		"Not yet implemented";
	}

	public get name() { return this._name; }
	public get disabled() { return this._disabled; }
	public set disabled(disabled: boolean) {
		this._disabled = disabled;
	}
}