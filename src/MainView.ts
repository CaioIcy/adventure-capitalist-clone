import { Text } from 'pixi.js';
import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
import { Button } from './Button';
import { StateController } from './state/StateController';

export class MainView extends BaseView {
    private states: StateController;

    public constructor(viewStack : ViewStack, states : StateController) {
        super(viewStack);
        this.states = states;
    }

    protected onEnter() : void {
        const title = new Text('Adventure Capitalist Clone');
        title.x = (window.innerWidth * 0.5) - (title.width * 0.5);
        this.addChild(title);

        const btn = new Button('test state', () => {
            this.states.wallet.test();
        });
        this.addChild(btn);

        this.states.wallet.addObserverCallback(this, () => {
            console.log('wallet updated');
        });
    }

    protected onExit() : void {
        this.states.wallet.removeObserverCallback(this);
    }
}
