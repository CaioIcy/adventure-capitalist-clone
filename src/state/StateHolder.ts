import { BusinessState } from './BusinessState';
import { ManagerState } from './ManagerState';
import { GameState } from './GameState';
import { WalletState } from './WalletState';
import { ConfigHolder } from '../config/ConfigHolder';

export class StateHolder {
	public wallet: WalletState;
	public business: BusinessState;
	public manager: ManagerState;
	public game: GameState;

	public init(configs : ConfigHolder) : void {
		this.wallet = new WalletState();
		this.business = new BusinessState(configs.business);
		this.manager = new ManagerState(configs.manager);
		this.game = new GameState();
	}
}