import { Application, Loader, settings, SCALE_MODES } from 'pixi.js';
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
            resolution: 1,
            // resolution: window.devicePixelRatio,
        });
        this.viewStack = new ViewStack(this.app.stage);
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        this.initConfigs();
        this.initLoader(() => {
            console.log('completed loading');
            this.initStates();
            this.viewStack.push(new MainView(this.viewStack, this.configs, this.states));
        });
    }

    private initLoader(completion: ()=>void) {
        const loader = Loader.shared;
        loader.onComplete.add(completion);

        this.configs.business.loadImages((id, url) => {
            loader.add(id, url);
        });
        this.configs.manager.loadImages((id, url) => {
            loader.add(id, url);
        });

        loader.load((loader, resources) => {
            // nothing
        });
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
        for(const initialManagerID of this.configs.manager.getInitialManagerIDs()) {
            this.states.manager.unlockManager(initialManagerID);
        }

        this.states.game.markInitialized();
    }
}

const app = new App();
app.start();
