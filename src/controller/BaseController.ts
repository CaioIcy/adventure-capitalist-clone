import { Container } from 'pixi.js';
import { ControllerStack } from './ControllerStack';

export abstract class BaseController extends Container {
    protected controllerStack : ControllerStack;

    public constructor(controllerStack : ControllerStack) {
        super();
        this.controllerStack = controllerStack;
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
