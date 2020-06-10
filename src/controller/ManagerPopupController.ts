import { Loader } from 'pixi.js';
import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { ConfigHolder } from '../config/ConfigHolder';
import { StateHolder } from '../state/StateHolder';
import { ManagerPopupView } from '../ui/view/ManagerPopupView';
import { MoneyUtil } from '../util/MoneyUtil';

export class ManagerPopupController extends BaseController {
    private configs: ConfigHolder;
    private states: StateHolder;
    private managerID: string;

    private view: ManagerPopupView;

    public constructor(controllerStack : ControllerStack, configs: ConfigHolder, states : StateHolder, managerID: string) {
        super(controllerStack);
        this.configs = configs;
        this.states = states;
        this.managerID = managerID;
    }

    protected onEnter() : void {
        const managerTexture = Loader.shared.resources[this.managerID].texture;
        this.view = new ManagerPopupView(managerTexture);
        this.addChild(this.view);

        const cost = this.configs.manager.getCost(this.managerID);
        this.view.setCost(MoneyUtil.moneyToString(cost));

        this.view.closeAction = () => { this.close(); };
        this.view.buyAction = () => { this.buy(); };
    }

    protected onExit() : void {
        //console.log('onExit');
    }

    private buy(): void {
        const cost = this.configs.manager.getCost(this.managerID);
        if(cost > this.states.wallet.money) {
            // TODO notify can't buy
            //console.log('not enough money');
            return;
        }

        this.states.wallet.addMoneyDelta(-cost);
        this.states.manager.unlockManager(this.managerID);

        this.close();
    }

    private close(): void {
        this.controllerStack.pop();
        this.destroy();
    }
}
