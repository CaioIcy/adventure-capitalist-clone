import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { ConfigHolder } from '../config/ConfigHolder';
import { StateHolder } from '../state/StateHolder';
import { OfflineProfitPopupView } from '../ui/view/OfflineProfitPopupView';
import { MoneyUtil } from '../util/MoneyUtil';

export class OfflineProfitPopupController extends BaseController {
    private configs: ConfigHolder;
    private states: StateHolder;
    private profit: number;

    private view: OfflineProfitPopupView;

    public constructor(controllerStack : ControllerStack, configs: ConfigHolder, states : StateHolder, profit: number) {
        super(controllerStack);
        this.configs = configs;
        this.states = states;
        this.view = new OfflineProfitPopupView();
        this.profit = profit;
    }

    protected onEnter() : void {
        console.log('offline profit view');
        this.addChild(this.view);
        this.view.setProfit(MoneyUtil.moneyToString(this.profit));
        this.view.collectAction = () => { this.close(); };
    }

    protected onExit() : void {
        // do nothing
    }

    private close(): void {
        this.controllerStack.pop();
        this.destroy();
    }
}
