import { Container, Text, Sprite, Texture } from 'pixi.js';
import { MoneyUtil } from '../../util/MoneyUtil';
import { TextUtil } from '../util/TextUtil';
import { Window } from '../../util/Window';

export class HeaderContainer extends Container {
    private moneyLabel: Text;

    public constructor() {
        super();
    }

    public init() : void {
        const pad = 8;
        const height = 64 + (pad*2);

        const background = new Sprite(Texture.WHITE);
        background.width = Window.WIDTH;
        background.height = height;
        background.tint = 0x000000;
        background.alpha = 0.25;
        this.addChild(background);

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