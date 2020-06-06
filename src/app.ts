import { Application } from 'pixi.js';

export class App {
    private app : Application;

    public constructor() {
        this.app = new Application({
            backgroundColor: 0xe3fff7,
            resolution: 1, // window.devicePixelRatio || 
        });
    }

    public start() {
        document.body.appendChild(this.app.view);
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }
}

const app = new App();
app.start();
