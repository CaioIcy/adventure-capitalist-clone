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
                    image: 'assets/business/Lemonade_Stand.png',
                    autoUnlocked: true,
                    initialCost: 3.738,
                    coefficient: 1.07,
                    initialTime: 0.6,
                    initialRevenue: 1,
                },
                'business-1': {
                    name: 'Newspaper Delivery',
                    image: 'assets/business/Newspaper_Delivery.png',
                    initialCost: 60,
                    coefficient: 1.15,
                    initialTime: 3,
                    initialRevenue: 60,
                },
                'business-2': {
                    name: 'Car Wash',
                    image: 'assets/business/Car_Wash.png',
                    initialCost: 720,
                    coefficient: 1.14,
                    initialTime: 6,
                    initialRevenue: 540,
                },
                'business-3': {
                    name: 'Pizza Delivery',
                    image: 'assets/business/Pizza_Delivery.png',
                    initialCost: 8640,
                    coefficient: 1.13,
                    initialTime: 12,
                    initialRevenue: 4320,
                },
                'business-4': {
                    name: 'Donut Shop',
                    image: 'assets/business/Donut_Shop.png',
                    initialCost: 103680,
                    coefficient: 1.12,
                    initialTime: 24,
                    initialRevenue: 51840,
                },
                'business-5': {
                    name: 'Shrimp Boat',
                    image: 'assets/business/Shrimp_Boat.png',
                    initialCost: 1244160,
                    coefficient: 1.11,
                    initialTime: 96,
                    initialRevenue: 622080,
                },
                'business-6': {
                    name: 'Hockey Team',
                    image: 'assets/business/Hockey_Team.png',
                    initialCost: 14929920,
                    coefficient: 1.10,
                    initialTime: 384,
                    initialRevenue: 7464960,
                },
                'business-7': {
                    name: 'Movie Studio',
                    image: 'assets/business/Movie_Studio.png',
                    initialCost: 179159040,
                    coefficient: 1.09,
                    initialTime: 1536,
                    initialRevenue: 89579520,
                },
                'business-8': {
                    name: 'Bank',
                    image: 'assets/business/Bank.png',
                    initialCost: 2149908480,
                    coefficient: 1.08,
                    initialTime: 6144,
                    initialRevenue: 1074954240,
                },
                'business-9': {
                    name: 'Oil Company',
                    image: 'assets/business/Oil_Company.png',
                    initialCost: 25798901760,
                    coefficient: 1.07,
                    initialTime: 36864,
                    initialRevenue: 29668737024,
                },
            },
        };
    }

    public loadImages(loaderFunc: (id:string, url:string)=>void): void {
        for(const bid in this.config.businesses) {
            const cfg = this.getBusinessConfig(bid);
            loaderFunc(bid, cfg.image);
        }
    }

    public getBusinessConfig(id: string): any { // TODO interface
        console.assert(this.isValidBusiness(id), 'invalid business id');
        return this.config.businesses[id];
    }

    public getCost(id: string, currentAmount: number, amountToBuy: number): number {
        console.assert(this.isValidBusiness(id), 'invalid business id');
        const cfg = this.getBusinessConfig(id);
        const cost = cfg.initialCost * Math.pow(cfg.coefficient, (currentAmount+amountToBuy)-1);
        return cost;
    }

    public getTimeToProfit(id: string, currentAmount: number): number {
        console.assert(this.isValidBusiness(id), 'invalid business id');
        const cfg = this.getBusinessConfig(id);
        let multiplier = 1;
        for(let i = 0; i < this.config.milestones.length; ++i) {
            const milestone = this.config.milestones[i];
            if(currentAmount < milestone) {
                break;
            }
            multiplier *= 0.5;
        }
        return cfg.initialTime * multiplier;
    }

    public getNextMilestone(amount: number): number {
        for(let i = 0; i < this.config.milestones.length; ++i) {
            const milestone = this.config.milestones[i];
            if(amount < milestone) {
                return milestone;
            }
        }
        return this.config.milestones[this.config.milestones.length - 1];
    }

    public getRevenue(id: string, currentAmount: number): number {
        const cfg = this.getBusinessConfig(id);
        return cfg.initialRevenue * currentAmount; // TODO multiplier
    }

    public getProfit(id: string, currentAmount: number): number {
        const cfg = this.getBusinessConfig(id);
        const revenue = this.getRevenue(id, currentAmount);
        const ttp = this.getTimeToProfit(id, currentAmount);
        return Math.ceil(revenue / ttp);
    }

    public getBusinessIDs() : string[] {
        return Object.keys(this.config.businesses);
    }

    public getInitialBusinessIDs(): string[] {
        return this.getBusinessIDs().filter(id => !!this.getBusinessConfig(id).autoUnlocked);
    }

    public isValidBusiness(id: string): boolean {
        return this.getBusinessIDs().includes(id);
    }
}