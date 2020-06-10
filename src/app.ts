import { Application, Loader, settings, SCALE_MODES } from 'pixi.js';
import { ConfigHolder } from './config/ConfigHolder';
import { StateHolder } from './state/StateHolder';
import { ControllerStack } from './controller/ControllerStack';
import { MainController } from './controller/MainController';
import { Window } from './util/Window';

export class App {
    private app : Application;
    private controllerStack : ControllerStack;
    private states : StateHolder;
    private configs : ConfigHolder;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0x726861,
            resolution: 1,
        });
        this.controllerStack = new ControllerStack(this.app.stage);
    }

    public start(): void {
        document.body.appendChild(this.app.view);
        settings.SCALE_MODE = SCALE_MODES.NEAREST;
        window.addEventListener('resize', () => {
            this.resize();
        });
        this.resize();

        this.initConfigs();
        this.initLoader(() => {
            console.log('completed loading');
            this.initStates();
            this.controllerStack.push(new MainController(this.controllerStack, this.configs, this.states));
        });
    }

    private resize(): void {
        // assuming portrait
        const w = Math.min(window.innerWidth, window.innerHeight);
        const h = Math.max(window.innerWidth, window.innerHeight);
        const aspectRatio = w / h;
        Window.WIDTH = aspectRatio * window.innerHeight;
        Window.HEIGHT = window.innerHeight;
        this.app.renderer.resize(Window.WIDTH, Window.HEIGHT);
        console.log('(w,h)=', Window.WIDTH, Window.HEIGHT);
    }

    private initLoader(completion: ()=>void): void {
        const loader = Loader.shared;
        loader.onComplete.add(completion);
        loader.onError.add(() => console.error('error loading'));

        this.configs.business.loadImages((id, url) => {
            loader.add(id, url);
        });
        this.configs.manager.loadImages((id, url) => {
            loader.add(id, url);
        });

        loader.load((_, __) => {
            // nothing
        });
    }

    private initConfigs(): void {
        this.configs = new ConfigHolder();
        this.configs.init();
    }

    private initStates(): void {
        this.states = new StateHolder();
        this.states.init(this.configs);
        if (!this.states.game.hasBeenInitialized) {
            console.log('initializing game with initial state');

            for(const initialBusinessID of this.configs.business.getInitialBusinessIDs()) {
                console.log('initialBusinessID');
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
