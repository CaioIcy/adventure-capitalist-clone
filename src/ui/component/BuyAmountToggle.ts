import { Container, Text } from 'pixi.js';

export enum BuyAmountType {
    One,
    Ten,
    Hundred,
    Max, // TODO max impl
}

export class BuyAmountToggle extends Container {
    private label: Text;

    public constructor(onToggleAction: ()=>void) {
        super();

        this.label = new Text('x?');
        this.addChild(this.label);
        this.setClickCallback(onToggleAction);
    }

    public setClickCallback(action: ()=>void): void {
        this.label.interactive = true;
        this.label.buttonMode = true;
        this.label.removeAllListeners();
        this.label.on('pointerdown', action);
    }

    public setText(text: string): void {
        this.label.text = text;
    }
}