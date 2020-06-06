import { BaseState } from './BaseState';
import { BusinessConfig } from '../config/BusinessConfig';

export interface Business {
	id: string;
	level: number;
}

export class BusinessState extends BaseState {
	private config: BusinessConfig;

	public constructor(config: BusinessConfig) {
		super();
		this.config = config;
	}

	protected initializeState(): void {
		const businesses: {[id: string]: Business} = {};
		this.state = {
			businesses,
		};
	}

	public get businesses(): {[id: string]: Business} {
		return this.state.businesses;
	}

	public hasUnlockedBusiness(id: string) : boolean {
		return !!this.getBusiness(id);
	}

	public getBusiness(id: string) : Business {
		return this.businesses[id];
	}

	public unlockBusiness(id: string) : void {
		console.assert(!this.hasUnlockedBusiness(id), 'business already unlocked');
		console.assert(this.config.isValidBusiness(id), 'invalid business id');
		this.state.businesses[id] = {
			level: 0,
			id,
		};
		this.save();
	}
}