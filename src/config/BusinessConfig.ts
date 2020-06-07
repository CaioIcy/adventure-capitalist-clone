import { BaseConfig } from './BaseConfig';

export class BusinessConfig extends BaseConfig {
	private config: any = {};

	public constructor() {
		super();
		this.config = {
			businesses: {
				'business-0': {
					name: 'Lemonade Stand',
					unlockPrice: 1,
				},
				'business-1': {
					name: 'Newspaper Delivery',
					unlockPrice: 10,
				},
				'business-2': {
					name: 'Car Wash',
					unlockPrice: 100,
				},
				'business-3': {
					name: 'Pizza Delivery',
					unlockPrice: 1000,
				},
				'business-4': {
					name: '????????????',
					unlockPrice: 10000,
				},
				'business-5': {
					name: '????????????',
					unlockPrice: 100000,
				},
				'business-6': {
					name: '????????????',
					unlockPrice: 1000000,
				},
			},
		};
	}

	public getBusinessConfig(id: string): any { // TODO interface
		console.assert(this.isValidBusiness(id), 'invalid business id');
		return this.config.businesses[id];
	}

	public getBusinessIDs() : string[] {
		return Object.keys(this.config.businesses);
	}

	public getInitialBusinessIDs(): string[] {
		// TODO
		return ['business-0'];
	}

	public isValidBusiness(id: string): boolean {
		// TODO id must be contained in config
		return true;
	}
}