import { BaseState } from './BaseState';

export class WalletState extends BaseState {
	private money: number;

	public constructor() {
		super();

		// this.state.money = 69420;
	}

	public test() : void {
		this.debug();
		this.state.money = 69420;
		this.debug();
		this.save();
		this.debug();
	}
}