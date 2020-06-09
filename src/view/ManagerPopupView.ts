import { Container, Loader, Texture, Sprite, Text } from 'pixi.js';
import { BaseView } from './BaseView';
import { ViewStack } from './ViewStack';
import { ConfigController } from '../config/ConfigController';
import { StateController } from '../state/StateController';
import { ManagerCell } from '../ui/component/ManagerCell';
import { Button } from '../ui/component/Button';
import { MoneyUtil } from '../util/MoneyUtil';

// TODO move
class ManagerPopupVieww extends Container {
    private managerCell: ManagerCell;
    private costLabel: Text;

    public buyAction: ()=>void;
    public closeAction: ()=>void;

    public constructor(managerTex: Texture) {
        super();

        const width = 560;
        const height = window.innerHeight * 0.75;
        const pad = 48;

        this.x = window.innerWidth * 0.5 - width * 0.5;
        this.y = window.innerHeight * 0.5 - height * 0.5;

        const background = new Sprite(Texture.WHITE);
        background.tint = 0xEFEFEF;
        background.width = width;
        background.height = height;
        this.addChild(background);

        const closeButton = new Button('X', ()=>{
            if(this.closeAction) {
                this.closeAction();
            }
        });
        closeButton.x = width - closeButton.width;
        this.addChild(closeButton);

        this.managerCell = new ManagerCell();
        this.managerCell.width = 96;
        this.managerCell.height = 96;
        this.managerCell.x = width*0.5 - this.managerCell.width*0.5;
        this.managerCell.y = pad;
        this.addChild(this.managerCell);
        this.managerCell.setTexture(managerTex);

        // TODO only when not bought already
        const buyButton = new Button('BUY', ()=>{
            if(this.buyAction) {
                this.buyAction();
            }
        });
        buyButton.x = width*0.5 - buyButton.width*0.5;
        buyButton.y = height - pad;
        this.addChild(buyButton);

        this.costLabel = new Text('');
        this.addChild(this.costLabel);
        this.setCost('OOOOO');
    }

    public setCost(costText: string): void {
        this.costLabel.text = costText;
        this.costLabel.updateTransform();
        this.costLabel.x = this.width*0.5 - this.costLabel.width * 0.5;
        this.costLabel.y = this.height*0.5 - this.costLabel.height * 0.5;
    }
}

export class ManagerPopupView extends BaseView {
    private configs: ConfigController;
    private states: StateController;
    private managerID: string;

    private managerPopupVieww: ManagerPopupVieww;

    public constructor(viewStack : ViewStack, configs: ConfigController, states : StateController, managerID: string) {
        super(viewStack);
        this.configs = configs;
        this.states = states;
        this.managerID = managerID;
    }

    protected onEnter() : void {
        const managerTexture = Loader.shared.resources[this.managerID].texture;
        this.managerPopupVieww = new ManagerPopupVieww(managerTexture);
        this.addChild(this.managerPopupVieww);

        const cost = this.configs.manager.getCost(this.managerID);
        this.managerPopupVieww.setCost(MoneyUtil.moneyToString(cost));

        this.managerPopupVieww.closeAction = () => { this.close(); };
        this.managerPopupVieww.buyAction = () => { this.buy(); };
    }

    protected onExit() : void {
        console.log('onExit');
    }

    private buy(): void {
        const cost = this.configs.manager.getCost(this.managerID);
        if(cost > this.states.wallet.money) {
            // TODO notify can't buy
            console.log('not enough money');
            return;
        }

        this.states.wallet.addMoneyDelta(-cost);
        this.states.manager.unlockManager(this.managerID);

        this.close();
    }

    private close(): void {
        this.viewStack.pop();
        this.destroy();
    }
}
