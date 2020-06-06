import { BaseConfig } from './BaseConfig';

export class BusinessConfig extends BaseConfig {
	private config: any = {};

	public constructor() {
		super();
		this.config = {
			businesses: {
				'business-0': {
					name: 'Lemonade Stand',
				},
				'business-1': {
					name: 'Newspaper Delivery',
				},
				'business-2': {
					name: 'Car Wash',
				},
				'business-3': {
					name: 'Pizza Delivery',
				},
				'business-4': {
					name: 'Pizza Delivery',
				},
				'business-5': {
					name: 'Pizza Delivery',
				},
				'business-6': {
					name: 'Pizza Delivery',
				},
			},
		};
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