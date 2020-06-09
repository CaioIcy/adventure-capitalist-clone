import { BaseController } from './BaseController';
import { ControllerStack } from './ControllerStack';
import { StateHolder } from '../state/StateHolder';

export class OfflineProfitController extends BaseController {
    private states: StateHolder;

    public constructor(controllerStack : ControllerStack, states : StateHolder) {
        super(controllerStack);
        this.states = states;
    }

    protected onEnter() : void {
        console.log('offline profit view');
    }

    protected onExit() : void {
        // do nothing
    }
}
