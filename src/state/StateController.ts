import { BusinessState } from './BusinessState';
import { GameState } from './GameState';
import { WalletState } from './WalletState';
import { ConfigController } from '../config/ConfigController';

export class StateController {
	public wallet: WalletState;
	public business: BusinessState;
	public game: GameState;

	public init(configs : ConfigController) : void {
		this.wallet = new WalletState();
		this.business = new BusinessState(configs.business);
		this.game = new GameState();
	}
}