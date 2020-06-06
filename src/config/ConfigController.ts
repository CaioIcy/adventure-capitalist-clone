import { BusinessConfig } from './BusinessConfig';
import { GameConfig } from './GameConfig';
import { WalletConfig } from './WalletConfig';

export class ConfigController {
	public wallet: WalletConfig;
	public business: BusinessConfig;
	public game: GameConfig;

	public init() : void {
		this.wallet = new WalletConfig();
		this.business = new BusinessConfig();
		this.game = new GameConfig();
	}
}