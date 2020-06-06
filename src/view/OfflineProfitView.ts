import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
import { StateController } from '../state/StateController';

export class OfflineProfitView extends BaseView {
    private states: StateController;

    public constructor(viewStack : ViewStack, states : StateController) {
        super(viewStack);
        this.states = states;
    }

    protected onEnter() : void {
        console.log('offline profit view');
    }

    protected onExit() : void {
        // do nothing
    }
}
