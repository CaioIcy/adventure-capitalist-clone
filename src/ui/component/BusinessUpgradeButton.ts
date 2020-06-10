import { Container, Text } from 'pixi.js';
import { Background } from './Background';
import { TextUtil } from '../util/TextUtil';

export interface BusinessUpgradeButtonOptions {
    width: number;
    height: number;
}

export class BusinessUpgradeButton extends Container {
    private background: Background;
    private buyLabel: Text;
    private amountLabel: Text;
    private costLabel: Text;
    private pad: number;

    public constructor(options: BusinessUpgradeButtonOptions) {
        super();

        const { width, height } = options;
        const pad = 4;
        this.pad = pad;

        this.background = new Background({
            tint: 0xee8d1f,
            borderTint: 0xd47913,
            width,
            height,
            pad,
        });
        this.addChild(this.background);

        const textStyle = {
            fill: 'white',
            dropShadow: true,
            dropShadowColor: 'black',
            dropShadowDistance: 2,
        };
        this.buyLabel = new Text('BUY', TextUtil.createStyle(textStyle));
        this.buyLabel.x = pad*4;
        this.buyLabel.y = pad;
        this.addChild(this.buyLabel);

        this.amountLabel = new Text('', TextUtil.createStyle(textStyle));
        this.setAmount('x?');
        this.addChild(this.amountLabel);
        this.amountLabel.y = pad;

        this.costLabel = new Text('', TextUtil.createStyle(textStyle));
        this.addChild(this.costLabel);
        this.setCost('OOOOO');
    }

    public setCallback(callback: ()=>void): void {
        this.background.interactive = true;
        this.background.buttonMode = true;
        this.background.removeAllListeners();
        this.background.on('pointerdown', callback);
    }

    public setCost(costText: string): void {
        this.costLabel.text = costText;
        this.costLabel.x = this.pad*4;
        this.costLabel.y = this.height - this.costLabel.height - this.pad;
    }

    public setAmount(amountText: string): void {
        this.amountLabel.text = amountText;
        this.amountLabel.x = this.width - this.amountLabel.width - this.pad*4;
    }
}
