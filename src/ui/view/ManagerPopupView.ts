import { Container, Text, Texture, Sprite } from 'pixi.js';
import { ManagerCell } from '../component/ManagerCell';
import { Button } from '../component/Button';
import { TextUtil } from '../util/TextUtil';

export class ManagerPopupView extends Container {
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

        this.costLabel = new Text('', TextUtil.defaultStyle());
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
