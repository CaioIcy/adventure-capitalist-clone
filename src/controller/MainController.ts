import { Loader, Ticker } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { ManagerPopupController } from './ManagerPopupController';
import { TimeUtil } from '../util/TimeUtil';
import { Button } from '../ui/component/Button';
import { BuyAmountToggle, BuyAmountType } from '../ui/component/BuyAmountToggle';
import { BusinessCell } from '../ui/component/BusinessCell';
import { MainView } from '../ui/view/MainView';
import { HeaderContainer } from '../ui/container/HeaderContainer';
import { ConfigHolder } from '../config/ConfigHolder';
import { StateHolder } from '../state/StateHolder';

export class MainController extends BaseController {
    private configs: ConfigHolder;
    private states: StateHolder;
    private view: MainView;
    private buyAmountType: BuyAmountType = BuyAmountType.One;

    public constructor(controllerStack : ControllerStack, configs: ConfigHolder, states : StateHolder) {
        super(controllerStack);
        this.configs = configs;
        this.states = states;
        this.view = new MainView();
        this.view.header = new HeaderContainer();
    }

    protected onEnter() : void {
        this.view.header.init();
        this.addChild(this.view.header);

        this.view.buyAmountToggle = new BuyAmountToggle(() => this.toggleBuyAmount());
        this.addChild(this.view.buyAmountToggle);
        this.view.buyAmountToggle.setText(this.buyAmountString());
        this.view.buyAmountToggle.x = window.innerWidth * 0.5 - this.view.buyAmountToggle.width*3;

        const btn = new Button('reset', () => {
            console.log('clear local storage')
            localStorage.clear();
        });
        this.addChild(btn);

        const btn2 = new Button('+$1000', () => {
            this.states.wallet.addMoneyDelta(1000);
        });
        btn2.x = btn.width*1.5;
        this.addChild(btn2);

        this.states.wallet.addObserverCallback(this, ()=>this.onWalletStateUpdate());
        this.onWalletStateUpdate();

        this.states.manager.addObserverCallback(this, ()=>this.onManagerStateUpdate());

        const padding = 8;
        let y = this.view.header.height + padding;
        this.view.scroll = new Scrollbox({
            boxWidth: window.innerWidth * 0.95,
            boxHeight: window.innerHeight - this.view.header.height,
        });
        this.view.scroll.y = y;
        this.addChild(this.view.scroll);

        let x = window.innerWidth * 0.5; // TODO ?
        const businessIDs = this.configs.business.getBusinessIDs();
        for(let i = 0; i < businessIDs.length; ++i) {
            const cell = new BusinessCell();
            this.view.businessCells.push(cell);

            const businessIDs = this.configs.business.getBusinessIDs();
            const id = businessIDs[i];
            const businessTexture = Loader.shared.resources[id].texture;
            const managerID = this.configs.manager.getBusinessMainManagerID(id);
            const managerTexture = Loader.shared.resources[managerID].texture;
            const cfg = this.configs.business.getBusinessConfig(id);
            if(this.states.business.hasUnlockedBusiness(id)) {
                cell.setupUnlocked(businessTexture, managerTexture,
                    () => {
                        // TODO block click if manager available;
                        this.workBusiness(i, id);
                    },
                    () => {
                        this.tryUpgradeBusiness(i, id);
                    }
                );
            } else {
                cell.setupLocked(businessTexture, cfg.name, this.configs.business.getCost(id, 0, 1), () => {
                    this.tryUnlockBusiness(i, id);
                });
            }

            this.updateBusinessCell(i);

            this.view.scroll.content.addChild(cell);
            cell.x = x - cell.width*0.5;
            cell.y = y;
            y += cell.height + padding;
        }
        this.view.scroll.update();

        Ticker.shared.add(this.update, this);
    }

    private updateBusinessCell(cellIndex: number): void {
        const businessIDs = this.configs.business.getBusinessIDs();
        const id = businessIDs[cellIndex];
        const cfg = this.configs.business.getBusinessConfig(id);
        const cell = this.view.businessCells[cellIndex];
        const texture = Loader.shared.resources[id].texture;
        if(this.states.business.hasUnlockedBusiness(id)) {
            const business = this.states.business.businesses[id];
            const buyAmount = this.buyAmount();
            const cost = buyAmount * this.configs.business.getCost(id, business.amount, buyAmount);
            const profit = this.configs.business.getProfit(id, business.amount);
            const nextMilestone = this.configs.business.getNextMilestone(business.amount);
            const managerID = this.configs.manager.getBusinessMainManagerID(id);
            cell.updateUnlocked(this.buyAmountString(), business.amount, nextMilestone, cost, profit, this.states.manager.hasUnlockedManager(managerID));

            const timeToProfit = this.configs.business.getTimeToProfit(id, business.amount);
            cell.setTimeToProfit(timeToProfit);

            // TODO no need to update this, only setup once
            cell.setManagerClickCallback(() => {
                this.openManagerPopup(managerID);
            });
        } else {
            // nothing to update on locked cell
        }
    }

    protected onExit() : void {
        this.states.wallet.removeObserverCallback(this);
        this.states.manager.removeObserverCallback(this);
    }

    private update() : void {
        let cellIndex = 0;
        const businessIDs = this.configs.business.getBusinessIDs();

        // manager auto-work setup
        for(let i = 0; i < businessIDs.length; ++i) {
            const businessID = businessIDs[i];
            if(!this.states.business.hasUnlockedBusiness(businessID)) {
                continue;
            }

            if(this.states.business.isWorking(businessID)) {
                continue;
            }

            let hasManager = false;
            const businessManagerIDs = this.configs.manager.getBusinessManagerIDs(businessID);
            for(const managerID of businessManagerIDs) {
                if(this.states.manager.hasUnlockedManager(managerID)) {
                    hasManager = true;
                    break;
                }
            }

            if(hasManager) {
                this.workBusiness(i, businessID);
            }
        }

        // update work progress
        const now = TimeUtil.nowS();
        for(let i = 0; i < businessIDs.length; ++i) {
            const id = businessIDs[i];
            if(!this.states.business.hasUnlockedBusiness(id)) {
                continue;
            }
            if(!this.states.business.isWorking(id)) {
                continue;
            }

            const cell = this.view.businessCells[i];
            const business = this.states.business.getBusiness(id);
            const timeToProfit = this.configs.business.getTimeToProfit(id, business.amount);

            if(now > this.states.business.businesses[id].workTimestamp) { // finished working
                this.states.business.setWorkTimestamp(id, -1);
                const profit = this.configs.business.getProfit(id, business.amount);
                this.states.wallet.addMoneyDelta(profit);

                cell.setProfitProgress(0);
                cell.setTimeToProfit(timeToProfit);
            }
            else { // still working
                const progress = 1.0 - ((business.workTimestamp - now) / timeToProfit);
                cell.setProfitProgress(progress);
                cell.setTimeToProfit(business.workTimestamp - now);
            }
        }
    }

    private onWalletStateUpdate(): void {
        this.view.header.setMoney(this.states.wallet.money);
    }

    private onManagerStateUpdate(): void {
        const businessIDs = this.configs.business.getBusinessIDs();
        for(let i = 0; i < this.view.businessCells.length; ++i) {
            const cell = this.view.businessCells[i];
            const managerID = this.configs.manager.getBusinessMainManagerID(businessIDs[i]);
            cell.setUnlockedManager(this.states.manager.hasUnlockedManager(managerID));
        }
    }

    private workBusiness(cellIndex: number, businessID: string): void {
        const business = this.states.business.getBusiness(businessID);
        if(this.states.business.isWorking(businessID)) {
            // already working
            return;
        }

        const now = TimeUtil.nowS();
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

        const businessTexture = Loader.shared.resources[businessID].texture;
        const managerTexture = Loader.shared.resources[this.configs.manager.getBusinessMainManagerID(businessID)].texture;
        const cell = this.view.businessCells[cellIndex];
        cell.setupUnlocked(businessTexture, managerTexture,
            () => {
                // TODO block click if manager available;
                this.workBusiness(cellIndex, businessID);
            },
            () => {
                this.tryUpgradeBusiness(cellIndex, businessID);
            }
        );
        this.updateBusinessCell(cellIndex);
    }

    private tryUpgradeBusiness(cellIndex: number, businessID: string): void {
        console.assert(this.states.business.hasUnlockedBusiness(businessID), 'needs unlocked business');
        console.log('tryUpgradeBusiness=' + businessID);

        const buyAmount = this.buyAmount();
        const business = this.states.business.getBusiness(businessID);
        const cost = buyAmount * this.configs.business.getCost(businessID, business.amount, buyAmount);
        if(cost > this.states.wallet.money) {
            // TODO notify can't buy
            console.log('not enough money');
            return;
        }

        this.states.wallet.addMoneyDelta(-cost);
        this.states.business.upgradeBusiness(businessID, buyAmount);

        const cell = this.view.businessCells[cellIndex];
        this.updateBusinessCell(cellIndex);
    }

    private openManagerPopup(managerID: string): void {
        this.controllerStack.push(new ManagerPopupController(this.controllerStack, this.configs, this.states, managerID), true);
    }

    private buyAmountString(): string {
        switch(this.buyAmountType) {
            case BuyAmountType.Ten: {
                return 'x10';
            }
            case BuyAmountType.Hundred: {
                return 'x100';
            }
            default: {
                return 'x1';
            }
        }
    }

    private buyAmount(): number {
        switch(this.buyAmountType) {
            case BuyAmountType.Ten: {
                return 10;
            }
            case BuyAmountType.Hundred: {
                return 100;
            }
            default: {
                return 1;
            }
        }
    }

    private toggleBuyAmount(): void {
        this.buyAmountType += 1;
        if(this.buyAmountType >= BuyAmountType.Max) {
            this.buyAmountType = BuyAmountType.One;
        }
        this.view.buyAmountToggle.setText(this.buyAmountString());

        for(let i = 0; i < this.view.businessCells.length; ++i) {
            this.updateBusinessCell(i);
        }
    }
}
