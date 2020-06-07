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

        this.states.wallet.addObserverCallback(this, ()=>this.onWalletStateUpdate());
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
            const cell = new BusinessCell();
            this.businessCells.push(cell);

            this.updateBusinessCell(i);

            this.scroll.content.addChild(cell);
            cell.x = x - cell.width*0.5;
            cell.y = y;
            y += cell.height + padding;
        }
        this.scroll.update();

        Ticker.shared.add(this.update, this);
    }

    private updateBusinessCell(cellIndex: number): void {
        const businessIDs = this.configs.business.getBusinessIDs();
        const id = businessIDs[cellIndex];
        const cfg = this.configs.business.getBusinessConfig(id);
        const cell = this.businessCells[cellIndex];
        if(this.states.business.hasUnlockedBusiness(id)) {
            const business = this.states.business.businesses[id];
            const cost = this.configs.business.getCost(id, business.amount, 1);
            cell.setupUnlocked(cost, () => {
                this.workBusiness(cellIndex, id);
            });
        } else {
            cell.setupLocked(cfg.name, this.configs.business.getCost(id, 0, 1), () => {
                this.tryUnlockBusiness(cellIndex, id);
            });
        }
    }

    protected onExit() : void {
        this.states.wallet.removeObserverCallback(this);
    }

    private update() : void {
        const now = Date.now() / 1000;
        let cellIndex = 0;
        const businessIDs = this.configs.business.getBusinessIDs();

        for(let i = 0; i < businessIDs.length; ++i) {
            // TODO
            // if not working && has manager, mark to work
        }

        for(let i = 0; i < businessIDs.length; ++i) {
            const id = businessIDs[i];
            if(!this.states.business.hasUnlockedBusiness(id)) {
                continue;
            }
            if(!this.states.business.isWorking(id)) {
                continue;
            }

            console.log('working Business=' + id);
            const cell = this.businessCells[i];
            const business = this.states.business.getBusiness(id);

            if(now > this.states.business.businesses[id].workTimestamp) {
                console.log('finished working Business=' + id);
                this.states.business.setWorkTimestamp(id, -1);
                const profit = this.configs.business.getProfit(id);
                this.states.wallet.addMoneyDelta(profit);

                const timeToProfit = this.configs.business.getTimeToProfit(id, business.amount);
                cell.setTimeToProfit(timeToProfit);
            } else {
                cell.setTimeToProfit(business.workTimestamp - now);
            }
        }
    }

    private onWalletStateUpdate(): void {
        this.header.setMoney(this.states.wallet.money);
    }

    private workBusiness(cellIndex: number, businessID: string): void {
        const business = this.states.business.businesses[businessID];
        if(this.states.business.isWorking(businessID)) {
            // already working
            return;
        }

        console.log('workBusiness=' + businessID);
        const now = Date.now() / 1000;
        const timeToProfit = this.configs.business.getTimeToProfit(businessID, business.amount);
        this.states.business.setWorkTimestamp(businessID, now + timeToProfit);
    }

    private tryUnlockBusiness(cellIndex: number, businessID: string): void {
        console.assert(!this.states.business.hasUnlockedBusiness(businessID), 'already unlocked business');
        console.log('tryUnlockBusiness=' + businessID);
        const cost = this.configs.business.getCost(businessID, 0, 1);
        if(cost > this.states.wallet.money) {
            // TODO notify can't buy
            console.log('not enough money');
            return;
        }

        this.states.wallet.addMoneyDelta(-cost);
        this.states.business.unlockBusiness(businessID);

        const cell = this.businessCells[cellIndex];
        this.updateBusinessCell(cellIndex);
    }
}
