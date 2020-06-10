import { Container, Text, Texture, Sprite } from 'pixi.js';
import { ManagerCell } from '../component/ManagerCell';
import { Background } from '../component/Background';
import { Button } from '../component/Button';
import { TextUtil } from '../util/TextUtil';

export class ManagerPopupView extends Container {
    private managerCell: ManagerCell;
    private costLabel: Text;
    private buyButton: Button;

    public buyAction: ()=>void;
    public closeAction: ()=>void;

    public constructor(managerTex: Texture) {
        super();

        const width = 560;
        const height = window.innerHeight * 0.75;
        const pad = 48;

        this.x = window.innerWidth * 0.5 - width * 0.5;
        this.y = window.innerHeight * 0.5 - height * 0.5;

        const overlay = new Sprite(Texture.WHITE);
        overlay.tint = 0x000000;
        overlay.alpha = 0.75;
        overlay.x = -window.innerWidth*2;
        overlay.y = -window.innerHeight*2;
        overlay.width = window.innerWidth*4;
        overlay.height = window.innerHeight*4;
        this.addChild(overlay);

        const background = new Background({
            tint: 0x575757,
            lightTint: 0x575757,
            darkTint: 0x575757,
            borderTint: 0x171717,
            pad:4,
            width,
            height,
        });
        this.addChild(background);

        const closeButton = new Button('X', ()=>{
            if(this.closeAction) {
                this.closeAction();
            }
        });
        closeButton.x = width - closeButton.width;
        this.addChild(closeButton);

        this.managerCell = new ManagerCell({
            width: 96,
            height: 96,
        });
        this.managerCell.x = width*0.5 - this.managerCell.width*0.5;
        this.managerCell.y = pad;
        this.addChild(this.managerCell);
        this.managerCell.setTexture(managerTex);

        this.buyButton = new Button('HIRE', ()=>{
            if(this.buyAction) {
                this.buyAction();
            }
        });
        this.buyButton.x = width*0.5 - this.buyButton.width*0.5;
        this.buyButton.y = height - pad;
        this.addChild(this.buyButton);

        const hireLabel = new Text('Hire this manager?', TextUtil.defaultStyle());
        this.addChild(hireLabel);
        hireLabel.x = width*0.5 - hireLabel.width*0.5;
        hireLabel.y = this.managerCell.y + this.managerCell.height + pad;

        const descriptionLabel = new Text('A manager runs your business for you,\neven while you\'re gone!', TextUtil.defaultStyle());
        this.addChild(descriptionLabel);
        descriptionLabel.x = width*0.5 - descriptionLabel.width*0.5;
        descriptionLabel.y = hireLabel.y + hireLabel.height + pad;

        this.costLabel = new Text('OOOOO', TextUtil.defaultStyle());
        this.addChild(this.costLabel);
        this.setCost('OOOOO');
    }

    public setCost(costText: string): void {
        this.costLabel.text = costText;
        this.costLabel.x = (560)*0.5 - this.costLabel.width * 0.5;
        this.costLabel.y = this.buyButton.y - (2*this.costLabel.height);
    }
}
