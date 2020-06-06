import { BaseState } from './BaseState';

export class WalletState extends BaseState {
	public constructor() {
		super();
	}

	public test() : void {
		this.state.money += 69420;
		this.save();
		this.debug();
	}

	public get money(): number {
		return this.state.money;
	}
}