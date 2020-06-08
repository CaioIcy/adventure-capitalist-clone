import { BaseConfig } from './BaseConfig';

export class ManagerConfig extends BaseConfig {
	private config: any = {};

	public constructor() {
		super();
		this.config = {
			managers: {
				'manager-0': {
					businessIDs: ['business-0'],
					name: 'Cabe Johnson',
					image: 'assets/manager/Cabejohnson.jpg',
					autoUnlocked: true,
				},
				'manager-1': {
					businessIDs: ['business-1'],
					name: 'Perry Black',
					image: 'assets/manager/Perryblack.jpg',
				},
				'manager-2': {
					businessIDs: ['business-2'],
					name: 'W.W. Heisenbird',
					image: 'assets/manager/Heisenberg.jpg',
				},
				'manager-3': {
					businessIDs: ['business-3'],
					name: 'Mama Sean',
					image: 'assets/manager/Mama.jpg',
				},
				'manager-4': {
					businessIDs: ['business-4'],
					name: 'Jim Thorton',
					image: 'assets/manager/Jimthorton.jpg',
				},
				'manager-5': {
					businessIDs: ['business-5'],
					name: 'Forest Trump',
					image: 'assets/manager/Foresttrump.jpg',
				},
				'manager-6': {
					businessIDs: ['business-6'],
					name: 'Dawn Cheri',
					image: 'assets/manager/Dawncherry.jpg',
				},
				'manager-7': {
					businessIDs: ['business-7'],
					name: 'Stefani Speilburger',
					image: 'assets/manager/Sspeilberg.jpg',
				},
				'manager-8': {
					businessIDs: ['business-8'],
					name: 'The Dark Lord',
					image: 'assets/manager/Darklord.jpg',
				},
				'manager-9': {
					businessIDs: ['business-9'],
					name: 'Derrick Plainview',
					image: 'assets/manager/Derrick.jpg',
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

	public getManagerConfig(id: string): any { // TODO interface
		console.assert(this.isValidManager(id), 'invalid manager id');
		return this.config.managers[id];
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

	// since managers can manage N businesses, the main manager is the basic manager that only manages that business
	public getBusinessMainManagerID(businessID: string): string {
		for(const managerID of this.getManagerIDs()) {
			const cfg = this.getManagerConfig(managerID);
			if (cfg.businessIDs.length == 1 && cfg.businessIDs.includes(businessID)) {
				return managerID;
			}
		}
		return null;
	}

	public getBusinessManagerIDs(businessID: string): string[] {
		const managerIDs: string[] = [];
		for(const managerID of this.getManagerIDs()) {
			const cfg = this.getManagerConfig(managerID);
			if (cfg.businessIDs.includes(businessID)) {
				managerIDs.push(managerID);
			}
		}
		return managerIDs;
	}
}