import { Container } from 'pixi.js';
import { ViewStack } from './ViewStack';

export abstract class BaseView extends Container {
    protected viewStack : ViewStack;

    public constructor(viewStack : ViewStack) {
        super();
        this.viewStack = viewStack;
    }

    protected abstract onEnter() : void;
    protected abstract onExit() : void;

    public enter() {
        this.visible = true;
        this.onEnter();
    }

    public exit() {
        this.onExit();
        this.visible = false;
        this.destroy();
    }
}
