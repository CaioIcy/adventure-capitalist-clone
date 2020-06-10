import { BaseState } from './BaseState';
import { ManagerConfig } from '../config/ManagerConfig';

export interface Manager {
    id: string;
    amount: number;
}

export class ManagerState extends BaseState {
    private config: ManagerConfig;

    public constructor(config: ManagerConfig) {
        super('manager');
        this.config = config;
    }

    protected initializeState(): void {
        const managers: {[id: string]: Manager} = {};
        this.state = {
            managers,
        };
    }

    public get managers(): {[id: string]: Manager} {
        return this.state.managers;
    }

    public hasUnlockedManager(id: string) : boolean {
        console.assert(this.config.isValidManager(id), 'invalid manager id');
        return !!this.getManager(id);
    }

    public getManager(id: string) : Manager {
        return this.managers[id];
    }

    public unlockManager(id: string) : void {
        console.assert(!this.hasUnlockedManager(id), 'manager already unlocked');
        console.assert(this.config.isValidManager(id), 'invalid manager id');
        this.state.managers[id] = {
            amount: 1,
            id,
        };
        this.save();
    }
}