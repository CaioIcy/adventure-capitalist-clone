import { BaseConfig } from './BaseConfig';

export class BusinessConfig extends BaseConfig {
	private config: any = {};

	public constructor() {
		super();
		this.config = {
			milestones: [25, 50, 100, 200, 300, 400], // TODO half all buildings on all 25... etc
			businesses: {
				'business-0': {
					name: 'Lemonade Stand',
					initialCost: 3.738,
					coefficient: 1.07,
					initialTime: 0.6,
					initialRevenue: 1,
					initialProductivity: 1.67,
				},
				'business-1': {
					name: 'Newspaper Delivery',
					initialCost: 60,
					coefficient: 1.15,
					initialTime: 3,
					initialRevenue: 60,
					initialProductivity: 20,
				},
				'business-2': {
					name: 'Car Wash',
					initialCost: 720,
					coefficient: 1.14,
					initialTime: 6,
					initialRevenue: 540,
					initialProductivity: 90,
				},
				'business-3': {
					name: 'Pizza Delivery',
					initialCost: 8640,
					coefficient: 1.13,
					initialTime: 12,
					initialRevenue: 4320,
					initialProductivity: 360,
				},
				'business-4': {
					name: 'Donut Shop',
					initialCost: 103680,
					coefficient: 1.12,
					initialTime: 24,
					initialRevenue: 51840,
					initialProductivity: 2160,
				},
				'business-5': {
					name: 'Shrimp Boat',
					initialCost: 1244160,
					coefficient: 1.11,
					initialTime: 96,
					initialRevenue: 622080,
					initialProductivity: 6480,
				},
				'business-6': {
					name: 'Hockey Team',
					initialCost: 14929920,
					coefficient: 1.10,
					initialTime: 384,
					initialRevenue: 7464960,
					initialProductivity: 19440,
				},
				'business-7': {
					name: 'Movie Studio',
					initialCost: 179159040,
					coefficient: 1.09,
					initialTime: 1536,
					initialRevenue: 89579520,
					initialProductivity: 58320,
				},
				'business-8': {
					name: 'Bank',
					initialCost: 2149908480,
					coefficient: 1.08,
					initialTime: 6144,
					initialRevenue: 1074954240,
					initialProductivity: 174960,
				},
				'business-9': {
					name: 'Oil Company',
					initialCost: 25798901760,
					coefficient: 1.07,
					initialTime: 36864,
					initialRevenue: 29668737024,
					initialProductivity: 804816,
				},
			},
		};
	}

	public getBusinessConfig(id: string): any { // TODO interface
		console.assert(this.isValidBusiness(id), 'invalid business id');
		return this.config.businesses[id];
	}

	public getCost(id: string, currentAmount: number, amountToBuy: number): number {
		console.assert(this.isValidBusiness(id), 'invalid business id');
		const cfg = this.getBusinessConfig(id);
		const cost = (cfg.initialCost * Math.pow(cfg.coefficient, (currentAmount+amountToBuy)-1));
		return cost;
	}

	public getTimeToProfit(id: string, currentAmount: number): number {
		console.assert(this.isValidBusiness(id), 'invalid business id');
		const cfg = this.getBusinessConfig(id);
		let multiplier = 1;
		for(let i = 0; i < this.config.milestones; ++i) {
			const milestone = this.config.milestones[i];
			if(currentAmount < milestone) {
				break;
			}
			multiplier *= 0.5;
		}
		return cfg.initialTime * multiplier;
	}

	public getProfit(id: string): number {
		return 69;
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