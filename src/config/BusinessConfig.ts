import { BaseConfig } from './BaseConfig';

export class BusinessConfig extends BaseConfig {
	public constructor() {
		super();
	}

	public getInitialBusinessIDs(): string[] {
		return ['business-0'];
	}

	public isValidBusiness(id: string): boolean {
		// TODO id must be contained in config
		return true;
	}
}