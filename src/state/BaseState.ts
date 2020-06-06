export interface StateCallback {
    (): void;
}

export class BaseState {
	private observers : StateCallback[];
	protected state : {[key: string]: any};

	public constructor() {
		this.load();
	}

	public save() : void {
		const key = this.storageKey();
		window.localStorage.setItem(key, JSON.stringify(this.state));
	}

	public load() : void {
		const key = this.storageKey();
		const loadedState = window.localStorage.getItem(key);
		if (loadedState === null) {
			this.state = {};
		}
		else {
			this.state = JSON.parse(loadedState);
		}
	}

	private storageKey() : string {
		return `state:${this.constructor.name}`;
	}

	public debug() : void {
		console.log(`DEBUG ${this.storageKey()}`);
		console.log(this.state);
	}
}