import { Container, Text } from 'pixi.js';
import { Background } from './Background';
import { TextUtil } from '../util/TextUtil';

export enum BuyAmountType {
    One,
    Ten,
    Hundred,
    Max, // TODO max impl
}

export class BuyAmountToggle extends Container {
    private background: Background;
    private amountLabel: Text;

    public constructor(onToggleAction: ()=>void) {
        super();

        const width = 128;
        const height = 64;
        const pad = 4;
        this.background = new Background({
            tint: 0x1d6bc4,
            borderTint: 0x08458a,
            width,
            height,
            pad,
        });
        this.addChild(this.background);

        const buyLabel = new Text('BUY', TextUtil.defaultStyle());
        this.addChild(buyLabel);
        buyLabel.x = width*0.5 - buyLabel.width*0.5;
        buyLabel.y = pad;

        this.amountLabel = new Text('x?', TextUtil.defaultStyle());
        this.addChild(this.amountLabel);
        this.setClickCallback(onToggleAction);
    }

    public setClickCallback(action: ()=>void): void {
        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.removeAllListeners();
        this.background.on('pointerdown', action);
    }

    public setText(text: string): void {
        this.amountLabel.text = text;
        this.amountLabel.x = this.background.width*0.5 - this.amountLabel.width*0.5;
        this.amountLabel.y = this.background.height - this.amountLabel.height;
    }
}