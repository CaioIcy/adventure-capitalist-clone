export interface StateCallback {
    (): void;
}

export abstract class BaseState {
    private observers : {[key: string]: StateCallback};
    protected state : {[key: string]: any};

    public constructor() {
        this.state = {};
        this.observers = {};
        const loaded = this.load();
        if(!loaded) {
            this.initializeState();
            this.save(false);
        }
    }

    protected abstract initializeState(): void;

    public addObserverCallback(obj: any, cb: StateCallback) : void {
        this.observers[obj.constructor.name] = cb;
    }

    public removeObserverCallback(obj: any) : void {
        delete this.observers[obj.constructor.name];
    }

    protected notify() : void {
        for(const observer in this.observers) {
            this.observers[observer]();
        }
    }

    public save(shouldNotify = true) : void {
        const key = this.storageKey();
        window.localStorage.setItem(key, JSON.stringify(this.state));
        if(shouldNotify) {
            this.notify();
        }
    }

    public load() : boolean { // returns true if loaded something from storage
        const key = this.storageKey();
        const loadedState = window.localStorage.getItem(key);
        if (loadedState !== null) {
            this.state = JSON.parse(loadedState);
            return true;
        }

        return false;
    }

    private storageKey() : string {
        return `state:${this.constructor.name}`;
    }

    public debug() : void {
        console.log(`DEBUG ${this.storageKey()}`);
        console.log(this.state);
    }
}