import { Text } from 'pixi.js';
import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
// import { Button } from './Button';

export class MainView extends BaseView {
    public constructor(viewStack : ViewStack) {
        super(viewStack);
    }

    protected onEnter() : void {
        const title = new Text('Adventure Capitalist Clone');
        title.x = (window.innerWidth * 0.5) - (title.width * 0.5);
        this.addChild(title);
    }

    protected onExit() : void {
        // do nothing
    }
}
