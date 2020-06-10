import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { ConfigHolder } from '../config/ConfigHolder';
import { StateHolder } from '../state/StateHolder';
import { OfflineProfitPopupView } from '../ui/view/OfflineProfitPopupView';
import { TimeUtil } from '../util/TimeUtil';
import { MoneyUtil } from '../util/MoneyUtil';

export class OfflineProfitPopupController extends BaseController {
    private configs: ConfigHolder;
    private states: StateHolder;
    private profit: number;
    private secondsOffline: number;

    private view: OfflineProfitPopupView;

    public constructor(controllerStack : ControllerStack, configs: ConfigHolder,
        states : StateHolder, profit: number, secondsOffline: number) {
        super(controllerStack);
        this.configs = configs;
        this.states = states;
        this.view = new OfflineProfitPopupView();
        this.profit = profit;
        this.secondsOffline = secondsOffline;
    }

    protected onEnter() : void {
        console.log('offline profit view');
        this.addChild(this.view);
        this.view.setProfit(MoneyUtil.moneyToString(this.profit));
        this.view.setTimeOffline(TimeUtil.secondsToString(this.secondsOffline));
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
