import { Application, Loader, settings, SCALE_MODES } from 'pixi.js';
import { ConfigHolder } from './config/ConfigHolder';
import { StateHolder } from './state/StateHolder';
import { ControllerStack } from './controller/ControllerStack';
import { MainController } from './controller/MainController';

export class App {
    private app : Application;
    private controllerStack : ControllerStack;
    private states : StateHolder;
    private configs : ConfigHolder;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0x726861,
            resolution: 1,
            // resolution: window.devicePixelRatio,
        });
        this.controllerStack = new ControllerStack(this.app.stage);
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        settings.SCALE_MODE = SCALE_MODES.NEAREST;

        this.initConfigs();
        this.initLoader(() => {
            console.log('completed loading');
            this.initStates();
            this.controllerStack.push(new MainController(this.controllerStack, this.configs, this.states));
        });
    }

    private initLoader(completion: ()=>void) {
        const loader = Loader.shared;
        loader.onComplete.add(completion);
        loader.onError.add(() => console.error('error loading'));

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
        this.configs = new ConfigHolder();
        this.configs.init();
    }

    private initStates() {
        this.states = new StateHolder();
        this.states.init(this.configs);
        if (!this.states.game.hasBeenInitialized) {
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
}

const app = new App();
app.start();
