import { Container, Text, Texture, Sprite } from 'pixi.js';
import { Button } from '../component/Button';

export class OfflineProfitPopupView extends Container {
    private profitLabel: Text;
    public collectAction: ()=>void;

    public constructor() {
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

        const collectButton = new Button('COLLECT', ()=>{
            if(this.collectAction) {
                this.collectAction();
            }
        });
        collectButton.x = width*0.5 - collectButton.width*0.5;
        collectButton.y = height - pad;
        this.addChild(collectButton);

        this.profitLabel = new Text('');
        this.addChild(this.profitLabel);
        this.setProfit('OOOOO');
    }

    public setProfit(profitText: string): void {
        this.profitLabel.text = profitText;
        this.profitLabel.updateTransform();
        this.profitLabel.x = this.width*0.5 - this.profitLabel.width * 0.5;
        this.profitLabel.y = this.height*0.5 - this.profitLabel.height * 0.5;
    }
}
