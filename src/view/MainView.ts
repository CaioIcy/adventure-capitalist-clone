import { Text, Ticker } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox'
import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
import { Button } from '../ui/component/Button';
import { BusinessCell } from '../ui/component/BusinessCell';
import { HeaderContainer } from '../ui/container/HeaderContainer';
import { ConfigController } from '../config/ConfigController';
import { StateController } from '../state/StateController';

export class MainView extends BaseView {
    private configs: ConfigController;
    private states: StateController;
    private header: HeaderContainer;

    private scroll: Scrollbox;
    private businessCells: BusinessCell[] = [];

    public constructor(viewStack : ViewStack, configs: ConfigController, states : StateController) {
        super(viewStack);
        this.configs = configs;
        this.states = states;
        this.header = new HeaderContainer();
    }

    protected onEnter() : void {
        this.header.init();
        this.addChild(this.header);

        const btn = new Button('test state', () => {
            this.states.wallet.addMoneyDelta(100000);
        });
        this.addChild(btn);

        this.states.wallet.addObserverCallback(this, () => {
            console.log('wallet updated');
        });

        const padding = 4;
        let y = this.header.height + padding;
        this.scroll = new Scrollbox({
            boxWidth: window.innerWidth * 0.95,
            boxHeight: window.innerHeight - this.header.height,
        });
        this.scroll.y = y;
        this.addChild(this.scroll);

        let x = window.innerWidth * 0.5; // TODO ?
        for(const id in this.configs.business.getBusinessIDs()) {
            const cell = new BusinessCell();
            cell.setup();
            this.scroll.content.addChild(cell);

            cell.x = x;
            cell.y = y;
            y += cell.height + padding;
        }
        this.scroll.update();

        Ticker.shared.add(this.update, this);
    }

    protected onExit() : void {
        this.states.wallet.removeObserverCallback(this);
    }

    private update() : void {
        this.header.setMoney(this.states.wallet.money);
    }
}
