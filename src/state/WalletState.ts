import { BaseState } from './BaseState';

export class WalletState extends BaseState {
	public constructor() {
		super();
	}

	protected initializeState(): void {
		const money: number = 0;
		this.state = {
			money,
		};
	}

	public get money(): number {
		return this.state.money;
	}

	public addMoneyDelta(delta: number): void {
		this.state.money += delta;
		this.save();
	}
}