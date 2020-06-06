import { Application } from 'pixi.js';
import { StateController } from './state/StateController';
import { ViewStack } from './ViewStack';
import { MainView } from './MainView';

export class App {
    private app : Application;
    private viewStack : ViewStack;
    private states : StateController;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0xe3fff7,
            resolution: 1, // window.devicePixelRatio || 
        });
        this.viewStack = new ViewStack(this.app.stage);
        this.states = new StateController();
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.states.init();
        this.viewStack.push(new MainView(this.viewStack, this.states));
    }
}

const app = new App();
app.start();
