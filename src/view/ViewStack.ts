import { Container } from 'pixi.js';
import { BaseView } from './BaseView';

export class ViewStack {
    private appStage : Container;
    private stack : Array<BaseView>;

    public constructor(stage : Container) {
        this.appStage = stage;
        this.stack = [];
    }

    public push(view: BaseView, keepVisible: boolean = false) {
        if(!this.stackIsEmpty()) {
            this.stack[this.stack.length - 1].visible = keepVisible;
        }

        this.stack.push(view);
        this.appStage.addChild(view);
        view.enter();
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
