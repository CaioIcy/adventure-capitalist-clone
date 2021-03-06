import { BaseConfig } from './BaseConfig';

export class GameConfig extends BaseConfig {
    public constructor() {
        super();
        this.config = {
            secondsToShowOfflineProfit: 10,
        };
    }

    public get secondsToShowOfflineProfit(): number {
        return this.config.secondsToShowOfflineProfit;
    }
}