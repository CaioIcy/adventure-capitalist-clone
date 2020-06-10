import { Loader, Ticker } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { ManagerPopupController } from './ManagerPopupController';
import { OfflineProfitPopupController } from './OfflineProfitPopupController';
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
            console.log('clear local storage');
            Ticker.shared.remove(this.update, this);
            window.localStorage.clear();
            window.location.reload();
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

        const padding = 16;
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
            const businessID = businessIDs[i];
            const businessTexture = Loader.shared.resources[businessID].texture;
            const managerID = this.configs.manager.getManagerID(businessID);
            const managerTexture = Loader.shared.resources[managerID].texture;
            const cfg = this.configs.business.getBusinessConfig(businessID);
            if(this.states.business.hasUnlockedBusiness(businessID)) {
                cell.setupUnlocked(businessTexture, managerTexture,
                    () => {
                        // TODO block click if manager available;
                        this.workBusiness(i, businessID);
                    },
                    () => {
                        this.tryUpgradeBusiness(i, businessID);
                    }
                );
            } else {
                cell.setupLocked(businessTexture, cfg.name, this.configs.business.getCost(businessID, 0, 1), () => {
                    this.tryUnlockBusiness(i, businessID);
                });
            }

            this.updateBusinessCell(i);

            this.view.scroll.content.addChild(cell);
            cell.x = x - cell.width*0.5;
            cell.y = y;
            y += cell.height + padding;
        }
        this.view.scroll.update();


        this.processOfflineProfit(); // before scheduling the update
        Ticker.shared.add(this.update, this);
    }

    private updateBusinessCell(cellIndex: number): void {
        const businessIDs = this.configs.business.getBusinessIDs();
        const businessID = businessIDs[cellIndex];
        const cfg = this.configs.business.getBusinessConfig(businessID);
        const cell = this.view.businessCells[cellIndex];
        const texture = Loader.shared.resources[businessID].texture;
        if(this.states.business.hasUnlockedBusiness(businessID)) {
            const business = this.states.business.getBusiness(businessID);
            const buyAmount = this.buyAmount();
            const cost = buyAmount * this.configs.business.getCost(businessID, business.amount, buyAmount);
            const profit = this.configs.business.getProfit(businessID, business.amount);
            const nextMilestone = this.configs.business.getNextMilestone(business.amount);
            const managerID = this.configs.manager.getManagerID(businessID);
            cell.updateUnlocked(this.buyAmountString(), business.amount, nextMilestone, cost, profit, this.states.manager.hasUnlockedManager(managerID));

            const timeToProfit = this.configs.business.getTimeToProfit(businessID, business.amount);
            cell.setTimeToProfit(timeToProfit);

            // TODO no need to update this, only setup once
            cell.setManagerClickCallback(() => {
                this.tryOpenManagerPopup(managerID);
            });
        } else {
            // nothing to update on locked cell
        }
    }

    protected onExit() : void {
        Ticker.shared.remove(this.update, this);
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

            const managerID = this.configs.manager.getManagerID(businessID);
            if(this.states.manager.hasUnlockedManager(managerID)) {
                this.workBusiness(i, businessID);
            }
        }

        // update work progress
        const now = TimeUtil.nowS();
        for(let i = 0; i < businessIDs.length; ++i) {
            const businessID = businessIDs[i];
            if(!this.states.business.hasUnlockedBusiness(businessID)) {
                continue;
            }
            if(!this.states.business.isWorking(businessID)) {
                continue;
            }

            const cell = this.view.businessCells[i];
            const business = this.states.business.getBusiness(businessID);
            const timeToProfit = this.configs.business.getTimeToProfit(businessID, business.amount);

            if(now > this.states.business.getBusiness(businessID).workTimestamp) { // finished working
                this.states.business.setWorkTimestamp(businessID, -1);
                const profit = this.configs.business.getProfit(businessID, business.amount);
                this.states.wallet.addMoneyDelta(profit);

                cell.setProfitProgress(0);
                cell.setTimeToProfit(timeToProfit);
            }
            else { // still working
                const progress = (timeToProfit > 0.5)
                    ? (1.0 - ((business.workTimestamp - now) / timeToProfit))
                    : 1.0;
                cell.setProfitProgress(progress);
                cell.setTimeToProfit(business.workTimestamp - now);
            }
        }

        this.states.game.setLastTimestamp(now);
    }

    private onWalletStateUpdate(): void {
        this.view.header.setMoney(this.states.wallet.money);
    }

    private onManagerStateUpdate(): void {
        const businessIDs = this.configs.business.getBusinessIDs();
        for(let i = 0; i < this.view.businessCells.length; ++i) {
            const cell = this.view.businessCells[i];
            const managerID = this.configs.manager.getManagerID(businessIDs[i]);
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
        const managerID = this.configs.manager.getManagerID(businessID);
        const managerTexture = Loader.shared.resources[managerID].texture;
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

    private tryOpenManagerPopup(managerID: string): void {
        if(this.states.manager.hasUnlockedManager(managerID)){
            return;
        }
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

    private processOfflineProfit(): void {
        const now = TimeUtil.nowS();
        const ts = this.states.game.getLastTimestamp();
        const secondsOffline = now - ts;
        if(ts < 0 || secondsOffline <= 0) { return; }

        let sumTotalProfit = 0;
        const businessIDs = this.configs.business.getBusinessIDs();
        for(let i = 0; i < businessIDs.length; ++i) {
            const businessID = businessIDs[i];
            const managerID = this.configs.manager.getManagerID(businessID);
            if(!this.states.manager.hasUnlockedManager(managerID)) {
                continue;
            }

            const business = this.states.business.getBusiness(businessID);
            const timeToProfit = this.configs.business.getTimeToProfit(businessID, business.amount);
            const timesProfitted = secondsOffline/timeToProfit;
            if(timesProfitted >= 1) {
                const profit = this.configs.business.getProfit(businessID, business.amount);
                sumTotalProfit += timesProfitted * profit;
            }
        }

        if(sumTotalProfit > 0) {
            this.states.wallet.addMoneyDelta(sumTotalProfit);
        }

        if(secondsOffline > this.configs.game.secondsToShowOfflineProfit && sumTotalProfit > 0) {
            this.controllerStack.push(new OfflineProfitPopupController(this.controllerStack, this.configs, this.states, sumTotalProfit), true);
        }
    }
}
