import { BaseConfig } from './BaseConfig';

export class GameConfig extends BaseConfig {
    private config: any = {};

    public constructor() {
        super();
        this.config = {
            secondsToShowOfflineProfit: 5,
        };
    }

    public get secondsToShowOfflineProfit(): number {
        return this.config.secondsToShowOfflineProfit;
    }
}