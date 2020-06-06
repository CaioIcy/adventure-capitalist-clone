import { BaseState } from './BaseState';

export class WalletState extends BaseState {
	private money: number;

	public constructor() {
		super();
	}

	public test() : void {
		this.state.money += 69420;
		this.save();
		this.debug();
	}
}