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
            localStorage.clear();
        });
        this.addChild(btn);

        this.states.wallet.addObserverCallback(this, this.onWalletStateUpdate);
        this.onWalletStateUpdate();

        const padding = 4;
        let y = this.header.height + padding;
        this.scroll = new Scrollbox({
            boxWidth: window.innerWidth * 0.95,
            boxHeight: window.innerHeight - this.header.height,
        });
        this.scroll.y = y;
        this.addChild(this.scroll);

        let x = window.innerWidth * 0.5; // TODO ?
        const businessIDs = this.configs.business.getBusinessIDs();
        for(let i = 0; i < businessIDs.length; ++i) {
            const id = businessIDs[i];
            const cfg = this.configs.business.getBusinessConfig(id);
            const cell = new BusinessCell();
            this.businessCells.push(cell);
            if(this.states.business.hasUnlockedBusiness(id)) {
                cell.setupUnlocked(() => {
                    this.workBusiness(i, id);
                });
            } else {
                cell.setupLocked(cfg.name, cfg.unlockPrice, () => {
                    this.tryUnlockBusiness(i, id);
                });
            }
            this.scroll.content.addChild(cell);

            cell.x = x - cell.width*0.5;
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
        // TODO
    }

    private onWalletStateUpdate(): void {
        this.header.setMoney(this.states.wallet.money);
    }

    private workBusiness(cellIndex: number, businessID: string): void {
        console.log('workBusiness=' + businessID);
    }

    private tryUnlockBusiness(cellIndex: number, businessID: string): void {
        console.log('tryUnlockBusiness=' + businessID);
        const cell = this.businessCells[cellIndex];
        const cfg = this.configs.business.getBusinessConfig(businessID);
        if(cfg.unlockPrice > this.states.wallet.money) {
            // TODO notify can't buy
            console.log('not enough money');
            return;
        }

        this.states.wallet.addMoneyDelta(-cfg.unlockPrice);
        this.states.business.unlockBusiness(businessID);
    }
}
