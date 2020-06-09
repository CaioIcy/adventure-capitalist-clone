import { Container } from 'pixi.js';
import { BaseController } from './BaseController';

export class ControllerStack {
    private appStage : Container;
    private stack : Array<BaseController>;

    public constructor(stage : Container) {
        this.appStage = stage;
        this.stack = [];
    }

    public push(controller: BaseController, keepVisible: boolean = false) {
        if(!this.stackIsEmpty()) {
            this.stack[this.stack.length - 1].visible = keepVisible;
        }

        this.stack.push(controller);
        this.appStage.addChild(controller);
        controller.enter();
    }

    public pop() {
        if(this.stackIsEmpty()) {
            console.error('empty stack in pop');
            return;
        }

        const current = this.stack.pop();
        this.appStage.removeChild(current);
        if(!this.stackIsEmpty()) {
            this.stack[this.stack.length - 1].visible = true;
        }
        current.exit();
    }

    private stackIsEmpty() : boolean {
        return this.stack.length <= 0;
    }
}
