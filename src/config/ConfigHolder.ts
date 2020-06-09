import { BusinessConfig } from './BusinessConfig';
import { ManagerConfig } from './ManagerConfig';
import { GameConfig } from './GameConfig';
import { WalletConfig } from './WalletConfig';

export class ConfigHolder {
	public wallet: WalletConfig;
	public business: BusinessConfig;
	public manager: ManagerConfig;
	public game: GameConfig;

	public init() : void {
		this.wallet = new WalletConfig();
		this.business = new BusinessConfig();
		this.manager = new ManagerConfig();
		this.game = new GameConfig();
	}
}