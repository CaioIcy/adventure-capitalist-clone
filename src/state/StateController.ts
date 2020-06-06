import { WalletState } from './WalletState';

export class StateController {
	public wallet: WalletState;

	public init() : void {
		this.wallet = new WalletState();
	}
}