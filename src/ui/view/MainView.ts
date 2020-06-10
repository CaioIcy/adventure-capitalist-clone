import { Container, Text, Sprite, Texture } from 'pixi.js';
import { Scrollbox } from 'pixi-scrollbox';
import { BuyAmountToggle } from '../component/BuyAmountToggle';
import { BusinessCell } from '../component/BusinessCell';
import { MoneyUtil } from '../../util/MoneyUtil';
import { TextUtil } from '../util/TextUtil';
import { Window } from '../../util/Window';

export class MainView extends Container {
    // TODO move from controller to here
    public scroll: Scrollbox;
    public businessCells: BusinessCell[] = [];
    public buyAmountToggle: BuyAmountToggle;

    // header stuff
    public header: Sprite;
    private moneyLabel: Text;

    public constructor() {
        super();

        const pad = 8;
        const height = 64 + (pad*2);

        this.header = new Sprite(Texture.WHITE);
        this.header.width = Window.WIDTH;
        this.header.height = height;
        this.header.tint = 0x000000;
        this.header.alpha = 0.25;
        this.addChild(this.header);

        this.moneyLabel = new Text('$', TextUtil.createStyle({
            fontSize: 32,
        }));
        this.moneyLabel.x = 32;
        this.moneyLabel.y = height * 0.5 - this.moneyLabel.height*0.5;
        this.addChild(this.moneyLabel);
    }

    public setMoney(money: number) : void {
        this.moneyLabel.text = MoneyUtil.moneyToString(money);
    }
}