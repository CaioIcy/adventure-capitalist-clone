import { Application } from 'pixi.js';
import { ViewStack } from './ViewStack';
import { MainView } from './MainView';

export class App {
    private app : Application;
    private viewStack : ViewStack;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0xe3fff7,
            resolution: 1, // window.devicePixelRatio || 
        });
        this.viewStack = new ViewStack(this.app.stage);
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        this.viewStack.push(new MainView(this.viewStack));
    }
}

const app = new App();
app.start();
