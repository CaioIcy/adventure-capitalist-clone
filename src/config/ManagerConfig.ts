import { BaseConfig } from './BaseConfig';

interface IManager {
	autoUnlocked?: boolean;
	businessID: string;
	name: string;
	image: string;
	cost: number;
}

export class ManagerConfig extends BaseConfig {
	private config: any = {};

	public constructor() {
		super();
		this.config = {
			managers: {
				'manager-0': {
					autoUnlocked: true,
					businessID: 'business-0',
					name: 'Cabe Johnson',
					image: 'assets/manager/Cabejohnson.jpg',
					cost: 1000,
				},
				'manager-1': {
					businessID: 'business-1',
					name: 'Perry Black',
					image: 'assets/manager/Perryblack.jpg',
					cost: 15000,
				},
				'manager-2': {
					businessID: 'business-2',
					name: 'W.W. Heisenbird',
					image: 'assets/manager/Heisenberg.jpg',
					cost: 100000,
				},
				'manager-3': {
					businessID: 'business-3',
					name: 'Mama Sean',
					image: 'assets/manager/Mama.jpg',
					cost: 500000,
				},
				'manager-4': {
					businessID: 'business-4',
					name: 'Jim Thorton',
					image: 'assets/manager/Jimthorton.jpg',
					cost: 1200000,
				},
				'manager-5': {
					businessID: 'business-5',
					name: 'Forest Trump',
					image: 'assets/manager/Foresttrump.jpg',
					cost: 10000000,
				},
				'manager-6': {
					businessID: 'business-6',
					name: 'Dawn Cheri',
					image: 'assets/manager/Dawncherry.jpg',
					cost: 111111111,
				},
				'manager-7': {
					businessID: 'business-7',
					name: 'Stefani Speilburger',
					image: 'assets/manager/Sspeilberg.jpg',
					cost: 555555555,
				},
				'manager-8': {
					businessID: 'business-8',
					name: 'The Dark Lord',
					image: 'assets/manager/Darklord.jpg',
					cost: 10000000000,
				},
				'manager-9': {
					businessID: 'business-9',
					name: 'Derrick Plainview',
					image: 'assets/manager/Derrick.jpg',
					cost: 100000000000,
				},
			},
		};
	}

	public loadImages(loaderFunc: (id:string, url:string)=>void): void {
		for(const bid in this.config.managers) {
			const cfg = this.getManagerConfig(bid);
			loaderFunc(bid, cfg.image);
		}
	}

	public getManagerConfig(id: string): IManager {
		console.assert(this.isValidManager(id), 'invalid manager id');
		return this.config.managers[id];
	}

	public getCost(id: string): number {
		return this.getManagerConfig(id).cost;
	}

	public getManagerIDs() : string[] {
		return Object.keys(this.config.managers);
	}

	public isValidManager(id: string): boolean {
		return this.getManagerIDs().includes(id);
	}

	public getInitialManagerIDs(): string[] {
		return this.getManagerIDs().filter(id => !!this.getManagerConfig(id).autoUnlocked);
	}

	public getManagerID(businessID: string): string {
		for(const managerID of this.getManagerIDs()) {
			const cfg = this.getManagerConfig(managerID);
			if (cfg.businessID == businessID) {
				return managerID;
			}
		}
		return null;
	}
}