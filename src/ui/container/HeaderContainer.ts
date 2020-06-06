import { Container, Text } from 'pixi.js';

export class HeaderContainer extends Container {
    private moneyLabel: Text;

    public constructor() {
        super();
        this.moneyLabel = new Text('');
    }

    public init() : void {
        this.moneyLabel.x = (window.innerWidth * 0.5) - (this.moneyLabel.width * 0.5);
        this.addChild(this.moneyLabel);
    }

    public setMoney(money: number) : void {
        this.moneyLabel.text = `$ ${money}`;
    }
}