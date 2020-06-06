import { Application } from 'pixi.js';
import { ConfigController } from './config/ConfigController';
import { StateController } from './state/StateController';
import { ViewStack } from './view/ViewStack';
import { MainView } from './view/MainView';

export class App {
    private app : Application;
    private viewStack : ViewStack;
    private states : StateController;
    private configs : ConfigController;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0x736b66,
            resolution: 1, // window.devicePixelRatio || 
        });
        this.viewStack = new ViewStack(this.app.stage);
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);

        this.initConfigs();
        this.initStates();

        this.viewStack.push(new MainView(this.viewStack, this.configs, this.states));
    }

    private initConfigs() {
        this.configs = new ConfigController();
        this.configs.init();
    }

    private initStates() {
        this.states = new StateController();
        this.states.init(this.configs);
        if (this.states.game.hasBeenInitialized) {
            return;
        }
        console.log('initializing game with initial state');

        for(const initialBusinessID of this.configs.business.getInitialBusinessIDs()) {
            this.states.business.unlockBusiness(initialBusinessID);
        }

        this.states.game.markInitialized();
    }
}

const app = new App();
app.start();
