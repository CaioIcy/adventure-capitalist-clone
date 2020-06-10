import { BaseState } from './BaseState';

export class GameState extends BaseState {
    public constructor() {
        super();
    }

    protected initializeState(): void {
        const initialized = false;
        const lastTimestamp = -1;
        this.state = {
            initialized,
            lastTimestamp,
        };
    }

    public get hasBeenInitialized(): boolean {
        return !!this.state.initialized;
    }

    public markInitialized() : void {
        this.state.initialized = true;
        this.save();
    }

    public setLastTimestamp(ts: number): void {
        this.state.lastTimestamp = ts;
        this.save();
    }

    public getLastTimestamp(): number {
        return this.state.lastTimestamp;
    }
}