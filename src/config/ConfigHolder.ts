import { BusinessConfig } from './BusinessConfig';
import { ManagerConfig } from './ManagerConfig';
import { GameConfig } from './GameConfig';

export class ConfigHolder {
    public business: BusinessConfig;
    public manager: ManagerConfig;
    public game: GameConfig;

    public init() : void {
        this.business = new BusinessConfig();
        this.manager = new ManagerConfig();
        this.game = new GameConfig();
    }
}