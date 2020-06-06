import { Text, Ticker } from 'pixi.js';
import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
import { Button } from '../ui/component/Button';
import { HeaderContainer } from '../ui/container/HeaderContainer';
import { StateController } from '../state/StateController';

export class MainView extends BaseView {
    private states: StateController;
    private header: HeaderContainer;

    public constructor(viewStack : ViewStack, states : StateController) {
        super(viewStack);
        this.states = states;
        this.header = new HeaderContainer();
    }

    protected onEnter() : void {
        this.header.init();
        this.addChild(this.header);

        const btn = new Button('test state', () => {
            this.states.wallet.test();
        });
        this.addChild(btn);

        this.states.wallet.addObserverCallback(this, () => {
            console.log('wallet updated');
        });

        Ticker.shared.add(this.update, this);
    }

    protected onExit() : void {
        this.states.wallet.removeObserverCallback(this);
    }

    private update() : void {
        this.header.setMoney(this.states.wallet.money);
    }
}
