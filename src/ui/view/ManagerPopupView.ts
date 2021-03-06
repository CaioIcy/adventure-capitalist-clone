import { Container, Text, Texture, Sprite } from 'pixi.js';
import { ManagerCell } from '../component/ManagerCell';
import { Background } from '../component/Background';
import { Button } from '../component/Button';
import { TextUtil } from '../util/TextUtil';
import { Window } from '../../util/Window';

export class ManagerPopupView extends Container {
    private managerCell: ManagerCell;
    private costLabel: Text;
    private buyButton: Button;

    public buyAction: ()=>void;
    public closeAction: ()=>void;

    public constructor(managerTex: Texture) {
        super();

        const width = 560;
        const height = Window.HEIGHT * 0.75;
        const pad = 48;

        const overlay = new Sprite(Texture.WHITE);
        overlay.tint = 0x000000;
        overlay.alpha = 0.75;
        overlay.x = -Window.WIDTH*2;
        overlay.y = -Window.HEIGHT*2;
        overlay.width = Window.WIDTH*4;
        overlay.height = Window.HEIGHT*4;
        overlay.interactive = true;
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

        const scale = Window.scale(width, height);
        this.scale.x = scale;
        this.scale.y = scale;

        this.x = Window.WIDTH * 0.5 - (width*scale) * 0.5;
        this.y = Window.HEIGHT * 0.5 - (height*scale) * 0.5;
    }

    public setCost(costText: string): void {
        this.costLabel.text = costText;
        this.costLabel.x = (560)*0.5 - this.costLabel.width * 0.5;
        this.costLabel.y = this.buyButton.y - (2*this.costLabel.height);
    }
}
