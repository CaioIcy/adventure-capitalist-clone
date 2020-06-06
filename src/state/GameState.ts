import { BaseState } from './BaseState';

export class GameState extends BaseState {
	public constructor() {
		super();
	}

	protected initializeState(): void {
		const initialized: boolean = false;
		this.state = {
			initialized,
		};
	}

	public get hasBeenInitialized(): boolean {
		return !!this.state.initialized;
	}

	public markInitialized() : void {
		this.state.initialized = true;
		this.save();
	}
}