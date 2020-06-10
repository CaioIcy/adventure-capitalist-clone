import { BaseState } from './BaseState';
import { BusinessConfig } from '../config/BusinessConfig';

interface IBusiness {
    id: string;
    amount: number;
    workTimestamp: number;
}

export class BusinessState extends BaseState {
    private config: BusinessConfig;

    public constructor(config: BusinessConfig) {
        super('business');
        this.config = config;
    }

    protected initializeState(): void {
        //console.log('initializeState business');
        const businesses: {[id: string]: IBusiness} = {};
        this.state = {
            businesses,
        };
    }

    private get businesses(): {[id: string]: IBusiness} {
        return this.state.businesses;
    }

    public hasUnlockedBusiness(id: string) : boolean {
        console.assert(this.config.isValidBusiness(id), 'invalid business id');
        return !!this.getBusiness(id);
    }

    public getBusiness(id: string) : IBusiness {
        return this.businesses[id];
    }

    public isWorking(id: string): boolean {
        return this.businesses[id].workTimestamp > 0;
    }

    public setWorkTimestamp(id: string, timestamp: number): void {
        console.assert(this.hasUnlockedBusiness(id), 'business not unlocked');
        this.businesses[id].workTimestamp = timestamp;
        this.save();
    }

    public unlockBusiness(id: string) : void {
        console.assert(!this.hasUnlockedBusiness(id), 'business already unlocked');
        console.assert(this.config.isValidBusiness(id), 'invalid business id');
        this.state.businesses[id] = {
            amount: 1,
            workTimestamp: -1,
            id,
        };
        this.save();
    }

    public upgradeBusiness(id: string, byAmount: number): void {
        console.assert(this.hasUnlockedBusiness(id), 'business not unlocked');
        console.assert(byAmount > 0, 'byAmount should be positive');
        const business = this.getBusiness(id);
        business.amount += byAmount;
        this.save();
    }
}